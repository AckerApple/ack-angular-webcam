"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var template = "\n<video id=\"video\" *ngIf=\"isSupportWebRTC && videoSrc\" [src]=\"videoSrc\" autoplay>Video stream not available</video>\n\n<object *ngIf=\"isFallback\" data=\"jscam_canvas_only.swf\">\n  Video stream not available\n  <param name=\"FlashVars\" value=\"mode=callback&amp;quality=200\">\n  <param name=\"allowScriptAccess\" value=\"always\">\n  <param name=\"movie\" value=\"jscam_canvas_only.swf\">\n</object>\n";
/**
 * Render WebCam Component
 */
var WebCamComponent = (function () {
    function WebCamComponent(sanitizer, element) {
        this.sanitizer = sanitizer;
        this.element = element;
        this.refChange = new core_1.EventEmitter();
        this.onSuccess = new core_1.EventEmitter();
        this.onError = new core_1.EventEmitter();
        this.isFallback = false;
        this.isSupportWebRTC = false;
        this.browser = navigator;
    }
    WebCamComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.afterInitCycles(); }, 0);
    };
    WebCamComponent.prototype.afterInitCycles = function () {
        var _this = this;
        // getUserMedia() feature detection for older browser
        this.browser.getUserMedia_ = (this.browser.getUserMedia
            || this.browser.webkitGetUserMedia
            || this.browser.mozGetUserMedia
            || this.browser.msGetUserMedia);
        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if ((this.browser.mediaDevices === undefined) && !!this.browser.getUserMedia_) {
            this.browser.mediaDevices = {};
        }
        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if ((this.browser.mediaDevices && this.browser.mediaDevices.getUserMedia === undefined) && !!this.browser.getUserMedia_) {
            this.browser.mediaDevices.getUserMedia = function (constraints) {
                return new Promise(function (resolve, reject) {
                    _this.browser.getUserMedia_.call(_this.browser, constraints, resolve, reject);
                });
            };
        }
        this.isSupportWebRTC = !!(this.browser.mediaDevices && this.browser.mediaDevices.getUserMedia);
        this.applyDefaults();
        this.ref = Object.assign(this, this.ref);
        setTimeout(function () { return _this.refChange.emit(_this); }, 0);
        this.observer = new MutationObserver(function () { return _this.resizeVideo(); });
        var config = {
            attributes: true,
            childList: true,
            characterData: true,
        };
        this.observer.observe(this.element.nativeElement, config);
        this.onResize = function () { this.resizeVideo(); }.bind(this);
        window.addEventListener('resize', this.onResize);
        this.startCapturingVideo();
        this.onResize();
    };
    WebCamComponent.prototype.applyDefaults = function () {
        this.options = this.options || {};
        // default options
        this.options.fallbackSrc = this.options.fallbackSrc || 'jscam_canvas_only.swf';
        this.options.fallbackMode = this.options.fallbackMode || 'callback';
        this.options.fallbackQuality = this.options.fallbackQuality || 200;
        //this.options.width = this.options.width || 320;
        //this.options.height = this.options.height || 240;
        this.options.cameraType = this.options.cameraType || 'front';
        // flash fallback detection
        this.isFallback = this.options.fallback || (!this.isSupportWebRTC && !!this.options.fallbackSrc);
        if (!this.options.video && !this.options.audio) {
            this.options.video = true;
        }
    };
    /**
     * Switch to facing mode and setup web camera
     * @returns {void}
     */
    WebCamComponent.prototype.onWebRTC = function () {
        var _this = this;
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
        if (this.browser.mediaDevices.enumerateDevices && this.options.video) {
            var cameraType_1 = this.options.cameraType;
            this.browser.mediaDevices.enumerateDevices().then(function (devices) {
                devices.forEach(function (device) {
                    if (device && device.kind === 'videoinput') {
                        if (device.label.toLowerCase().search(cameraType_1) > -1) {
                            _this.options.video = { deviceId: { exact: device.deviceId }, facingMode: 'environment' };
                        }
                    }
                });
                _this.setWebcam();
            });
        }
        else {
            this.setWebcam();
        }
    };
    WebCamComponent.prototype.resizeVideo = function () {
        var video = this.getVideoElm();
        if (!video)
            return;
        video.width = 0;
        video.height = 0;
        var width = this.options.width || parseInt(this.element.nativeElement.offsetWidth, 10);
        var height = this.options.height || parseInt(this.element.nativeElement.offsetHeight, 10);
        if (!width || !height) {
            width = 320;
            height = 240;
        }
        video.width = width;
        video.height = height;
    };
    WebCamComponent.prototype.getVideoDimensions = function (video) {
        video = video || this.getVideoElm();
        var dim = { width: 0, height: 0 };
        if (video.videoWidth) {
            dim.width = video.videoWidth;
            dim.height = video.videoHeight;
        }
        else {
            dim.width = this.options.width || parseInt(this.element.nativeElement.offsetWidth, 10);
            dim.height = this.options.height || parseInt(this.element.nativeElement.offsetHeight, 10);
        }
        if (!dim.width)
            dim.width = 320;
        if (!dim.height)
            dim.height = 240;
        return dim;
    };
    WebCamComponent.prototype.getVideoElm = function () {
        var elmType = this.isFallback ? 'object' : 'video';
        return this.element.nativeElement.getElementsByTagName(elmType)[0];
    };
    /**
     * Setup web camera using native browser API
     * @returns {void}
     */
    WebCamComponent.prototype.setWebcam = function () {
        var _this = this;
        // constructing a getUserMedia config-object and
        // an string (we will try both)
        var optionObject = { audio: false, video: false };
        var optionString = '';
        if (this.options.video) {
            optionObject.video = this.options.video;
            optionString = 'video';
        }
        if (this.options.audio === true) {
            optionObject.audio = true;
            if (optionString !== '') {
                optionString = optionString + ', ';
            }
            optionString = optionString + 'audio';
        }
        // Promisify async callback's for angular2 change detection
        var promisifyGetUserMedia = function () {
            return new Promise(function (resolve, reject) {
                // first we try if getUserMedia supports the config object
                try {
                    // try object
                    _this.browser.mediaDevices.getUserMedia(optionObject)
                        .then(function (stream) { return resolve(stream); })
                        .catch(function (objErr) {
                        // option object fails
                        // try string syntax
                        // if the config object failes, we try a config string
                        _this.browser.mediaDevices.getUserMedia(optionObject)
                            .then(function (stream) { return resolve(stream); })
                            .catch(function (strErr) {
                            console.error(objErr);
                            console.error(strErr);
                            reject(new Error('Both configs failed. Neither object nor string works'));
                        });
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        promisifyGetUserMedia().then(function (stream) {
            var webcamUrl = URL.createObjectURL(stream);
            _this.videoSrc = _this.sanitizer.bypassSecurityTrustResourceUrl(webcamUrl);
            _this.processSuccess(stream);
        }).catch(function (err) {
            _this.onError.emit(err);
        });
    };
    WebCamComponent.prototype.processSuccess = function (stream) {
        if (this.isFallback) {
            this.setupFallback();
        }
        else {
            this.onSuccess.emit(stream);
        }
    };
    /**
     * Add <param>'s into fallback object
     * @param cam - Flash web camera instance
     * @returns {void}
     */
    WebCamComponent.prototype.addFallbackParams = function (cam) {
        var paramFlashVars = document.createElement('param');
        paramFlashVars.name = 'FlashVars';
        paramFlashVars.value = 'mode=' + this.options.fallbackMode + '&amp;quality=' + this.options.fallbackQuality;
        cam.appendChild(paramFlashVars);
        var paramAllowScriptAccess = document.createElement('param');
        paramAllowScriptAccess.name = 'allowScriptAccess';
        paramAllowScriptAccess.value = 'always';
        cam.appendChild(paramAllowScriptAccess);
        // if (this.browser.appVersion.indexOf('MSIE') > -1) {
        // if (isIE) {
        cam.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
        var paramMovie = document.createElement('param');
        paramMovie.name = 'movie';
        paramMovie.value = this.options.fallbackSrc;
        cam.appendChild(paramMovie);
        // } else {
        cam.data = this.options.fallbackSrc;
        // }
    };
    /**
     * On web camera using flash fallback
     * .swf file is necessary
     * @returns {void}
     */
    WebCamComponent.prototype.onFallback = function () {
        // Act as a plain getUserMedia shield if no fallback is required
        if (this.options) {
            // Fallback to flash
            var self_1 = this;
            var cam_1 = this.getVideoElm();
            cam_1.width = self_1.options.width;
            cam_1.height = self_1.options.height;
            this.addFallbackParams(cam_1);
            (function register(run) {
                if (cam_1.capture !== undefined) {
                    self_1.onSuccess.emit(cam_1);
                }
                else if (run === 0) {
                    self_1.onError.emit(new Error('Flash movie not yet registered!'));
                }
                else {
                    // Flash interface not ready yet
                    window.setTimeout(register, 1000 * (4 - run), run - 1);
                }
            }(3));
        }
        else {
            console.error('WebCam options is require');
        }
    };
    /**
     * Start capturing video stream
     * @returns {void}
     */
    WebCamComponent.prototype.startCapturingVideo = function () {
        if (!this.isFallback && this.isSupportWebRTC) {
            return this.onWebRTC();
        }
        return this.processSuccess();
    };
    WebCamComponent.prototype.drawImageArrayToCanvas = function (imgArray) {
        var canvas = this.getCanvas();
        //const di = this.getVideoDimensions()
        var ctx = canvas.getContext('2d');
        var width = imgArray[0].split(';').length;
        var height = imgArray.length;
        canvas.width = width;
        canvas.height = height;
        ctx.clearRect(0, 0, width, height);
        var externData = {
            imgData: ctx.getImageData(0, 0, width, height),
            pos: 0
        };
        var tmp = null;
        for (var x = 0; x < imgArray.length; ++x) {
            var col = imgArray[x].split(';');
            for (var i = 0; i < width; i++) {
                tmp = parseInt(col[i], 10);
                externData.imgData.data[externData.pos + 0] = (tmp >> 16) & 0xff;
                externData.imgData.data[externData.pos + 1] = (tmp >> 8) & 0xff;
                externData.imgData.data[externData.pos + 2] = tmp & 0xff;
                externData.imgData.data[externData.pos + 3] = 0xff;
                externData.pos += 4;
            }
            /*if (externData.pos >= 4 * width * height) {
              ctx.putImageData(externData.imgData, 0, 0);
              externData.pos = 0;
            }*/
        }
        ctx.putImageData(externData.imgData, 0, 0);
        return canvas;
    };
    WebCamComponent.prototype.ngOnDestroy = function () {
        this.observer.disconnect();
        window.removeEventListener(this.onResize);
    };
    WebCamComponent.prototype.getCanvas = function () {
        return document.createElement('canvas');
    };
    /** returns promise . @mime - null=png . Also accepts image/jpeg */
    WebCamComponent.prototype.getBase64 = function (mime) {
        if (this.isFallback) {
            return this.getFallbackBase64(mime);
        }
        else {
            var canvas = this.getCanvas();
            var video = this.getVideoElm();
            this.setCanvasWidth(canvas, video);
            canvas.getContext('2d').drawImage(video, 0, 0);
            return Promise.resolve(canvas.toDataURL(mime));
        }
    };
    WebCamComponent.prototype.getFallbackBase64 = function (mime) {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.flashPlayer.onImage = function (img) {
                res(img);
            };
            _this.getVideoElm().capture();
        })
            .then(function (canvas) { return canvas['toDataURL'](mime); });
    };
    WebCamComponent.prototype.setCanvasWidth = function (canvas, video) {
        var di = this.getVideoDimensions(video);
        canvas = canvas || this.getCanvas();
        canvas.width = di.width;
        canvas.height = di.height;
    };
    /**
     * Implement fallback external interface
     */
    WebCamComponent.prototype.setupFallback = function () {
        this.isFallback = true;
        var dataImgArray = [];
        this.flashPlayer = window['webcam'] = {
            onImage: function () { },
            debug: function (tag, message) {
                if (tag == 'notify' && message == 'Capturing finished.') {
                    this.flashPlayer.onImage(this.drawImageArrayToCanvas(dataImgArray));
                }
            }.bind(this),
            onCapture: function () {
                dataImgArray.length = 0;
                this.getVideoElm().save();
            }.bind(this),
            onTick: function (time) { },
            onSave: function (data) {
                dataImgArray.push(data);
            }
        };
    };
    return WebCamComponent;
}());
WebCamComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: 'ack-webcam',
                template: template
            },] },
];
/** @nocollapse */
WebCamComponent.ctorParameters = function () { return [
    { type: platform_browser_1.DomSanitizer, },
    { type: core_1.ElementRef, },
]; };
WebCamComponent.propDecorators = {
    'ref': [{ type: core_1.Input },],
    'refChange': [{ type: core_1.Output },],
    'options': [{ type: core_1.Input },],
    'onSuccess': [{ type: core_1.Output },],
    'onError': [{ type: core_1.Output },],
};
exports.WebCamComponent = WebCamComponent;
//# sourceMappingURL=webcam.component.js.map