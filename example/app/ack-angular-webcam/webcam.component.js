"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var videoHelp_1 = require("./videoHelp");
var template = "<video id=\"video\" *ngIf=\"(isSupportUserMedia||isSupportWebRTC)\" autoplay=\"\" playsinline=\"\">Video stream not available</video>";
/**
 * Render WebCam Component
 */
var WebCamComponent = /** @class */ (function () {
    function WebCamComponent(sanitizer, element) {
        this.sanitizer = sanitizer;
        this.element = element;
        this.isSupportUserMedia = false;
        this.isSupportWebRTC = false;
        this.isFallback = false;
        this.mime = 'image/jpeg';
        this.useParentWidthHeight = false;
        this.refChange = new core_1.EventEmitter();
        this.success = new core_1.EventEmitter();
        this.errorChange = new core_1.EventEmitter();
        this.catcher = new core_1.EventEmitter();
    }
    WebCamComponent.prototype.ngOnInit = function () {
        this.isSupportUserMedia = videoHelp_1.getMedia() != null ? true : false;
        this.isSupportUserMedia = false;
        this.isSupportWebRTC = !!(videoHelp_1.browser.mediaDevices && videoHelp_1.browser.mediaDevices.getUserMedia);
        //this.element.nativeElement.style.display='block'
        //this.element.nativeElement.style.width='100%'
        //this.element.nativeElement.style.height='100%'
    };
    WebCamComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.applyDefaults();
        setTimeout(function () { return _this.afterInitCycles(); }, 0);
    };
    /*ngOnChanges() {
      this.onResize()
    }*/
    WebCamComponent.prototype.afterInitCycles = function () {
        var _this = this;
        var media = videoHelp_1.getMedia();
        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if ((videoHelp_1.browser.mediaDevices === undefined) && !!media) {
            videoHelp_1.browser.mediaDevices = {};
        }
        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if ((videoHelp_1.browser.mediaDevices && videoHelp_1.browser.mediaDevices.getUserMedia === undefined) && !!media) {
            videoHelp_1.browser.mediaDevices.getUserMedia = function (constraints) {
                return new Promise(function (resolve, reject) {
                    var userMedia = media.call(videoHelp_1.browser, constraints, resolve, reject);
                    if (userMedia.then) {
                        userMedia.then(function (stream) { return _this.applyStream(stream); });
                    }
                });
            };
        }
        //deprecated. use angular hash template referencing    
        setTimeout(function () { return _this.refChange.emit(_this); }, 0);
        this.createVideoResizer();
        this.startCapturingVideo();
        this.onResize();
    };
    WebCamComponent.prototype.applyStream = function (stream) {
        var videoElm = this.getVideoElm();
        videoElm.srcObject = stream;
    };
    WebCamComponent.prototype.createVideoResizer = function () {
        var _this = this;
        this.observer = new MutationObserver(function () { return _this.resizeVideo(); });
        var config = {
            attributes: true,
            childList: true,
            characterData: true
            //,subtree: true
        };
        this.observer.observe(this.element.nativeElement, config);
        this.onResize = function () { this.resizeVideo(); }.bind(this);
        window.addEventListener('resize', this.onResize);
    };
    WebCamComponent.prototype.applyDefaults = function () {
        this.options = this.options || {};
        this.options.fallbackSrc = this.options.fallbackSrc || 'jscam_canvas_only.swf';
        this.options.fallbackMode = this.options.fallbackMode || 'callback';
        this.options.fallbackQuality = this.options.fallbackQuality || 200;
        this.options.cameraType = this.options.cameraType || 'front';
        this.isFallback = this.options.fallback || (!this.isSupportUserMedia && !this.isSupportWebRTC && this.options.fallbackSrc) ? true : false;
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
        if (videoHelp_1.browser.mediaDevices.enumerateDevices && this.options.video) {
            var cameraType_1 = this.options.cameraType;
            videoHelp_1.browser.mediaDevices.enumerateDevices().then(function (devices) {
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
        var elm = this.useParentWidthHeight ? this.element.nativeElement.parentNode : this.element.nativeElement;
        var width = this.options.width || parseInt(elm.offsetWidth, 10);
        var height = this.options.height || parseInt(elm.offsetHeight, 10);
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
        var native = this.element.nativeElement;
        var elmType = this.isFallback ? 'object' : 'video';
        return native.getElementsByTagName(elmType)[0];
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
                try {
                    videoHelp_1.browser.mediaDevices.getUserMedia(optionObject)
                        .then(function (stream) { return resolve(stream); })
                        .catch(function (objErr) {
                        reject(objErr);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        promisifyGetUserMedia()
            .then(function (stream) {
            _this.applyStream(stream);
            _this.processSuccess(stream);
            _this.stream = stream;
        }).catch(function (err) {
            _this.errorChange.emit(_this.error = err);
            _this.catcher.emit(err);
            return Promise.reject(err);
        });
    };
    WebCamComponent.prototype.processSuccess = function (stream) {
        if (this.isFallback) {
            this.setupFallback();
        }
        else {
            this.success.emit(stream);
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
    WebCamComponent.prototype.ngOnDestroy = function () {
        this.observer.disconnect();
        window.removeEventListener('resize', this.onResize);
        var vid = this.getVideoElm();
        if (vid && vid.pause) {
            vid.pause();
        }
        if (this.stream) {
            this.stream.getTracks().forEach(function (track) { return track.stop(); });
            //this.stream.getTracks()[0].stop();
        }
    };
    WebCamComponent.prototype.getCanvas = function () {
        return document.createElement('canvas');
    };
    /** returns promise . @mime - null=png . Also accepts image/jpeg */
    WebCamComponent.prototype.getBase64 = function (mime) {
        if (this.isFallback) {
            return this.flashPlayer.captureBase64(mime || this.mime);
            //return this.getFallbackBase64(mime)
        }
        else {
            var canvas = this.getCanvas();
            var video = this.getVideoElm();
            this.setCanvasWidth(canvas, video);
            canvas.getContext('2d').drawImage(video, 0, 0);
            return Promise.resolve(canvas.toDataURL(mime));
        }
    };
    WebCamComponent.prototype.setCanvasWidth = function (canvas, video) {
        var di = this.getVideoDimensions(video);
        canvas = canvas || this.getCanvas();
        canvas.width = di.width;
        canvas.height = di.height;
    };
    /** older browsers (IE11) cannot dynamically apply most attribute changes to object elements. Use this method during fallback */
    WebCamComponent.prototype.createVidElmOb = function () {
        var rtnElm = document.createElement('object');
        rtnElm.innerHTML = 'Video stream not available';
        rtnElm.setAttribute('type', 'application/x-shockwave-flash');
        rtnElm.setAttribute('data', this.options.fallbackSrc);
        var paramVar = document.createElement('param');
        paramVar.setAttribute('name', 'FlashVars');
        paramVar.setAttribute('value', 'mode=callback&amp;quality=200');
        rtnElm.appendChild(paramVar);
        paramVar = document.createElement('param');
        paramVar.setAttribute('name', 'allowScriptAccess');
        paramVar.setAttribute('value', 'always');
        rtnElm.appendChild(paramVar);
        paramVar = document.createElement('param');
        paramVar.setAttribute('name', 'movie');
        paramVar.setAttribute('value', this.options.fallbackSrc);
        rtnElm.appendChild(paramVar);
        var obs = this.element.nativeElement.getElementsByTagName('object');
        if (obs.length) {
            this.element.nativeElement.removeChild(obs[0]);
        }
        this.element.nativeElement.appendChild(rtnElm);
        return rtnElm;
    };
    /**
     * Implement fallback external interface
     */
    WebCamComponent.prototype.setupFallback = function () {
        this.isFallback = true;
        var vidElm = this.getVideoElm() || this.createVidElmOb();
        this.flashPlayer = new videoHelp_1.Fallback(vidElm);
    };
    /** single image to FormData */
    WebCamComponent.prototype.captureAsFormData = function (options) {
        options = options || {};
        return this.getBase64(options.mime)
            .then(function (base64) { return videoHelp_1.dataUriToFormData(base64, { fileName: options.fileName }); });
    };
    WebCamComponent.prototype.dataUriToFormData = function (base64, options) {
        return videoHelp_1.dataUriToFormData(base64, { fileName: options.fileName });
    };
    WebCamComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ack-webcam',
                    template: template,
                    exportAs: 'webcam'
                },] },
    ];
    /** @nocollapse */
    WebCamComponent.ctorParameters = function () { return [
        { type: platform_browser_1.DomSanitizer, },
        { type: core_1.ElementRef, },
    ]; };
    WebCamComponent.propDecorators = {
        'mime': [{ type: core_1.Input },],
        'useParentWidthHeight': [{ type: core_1.Input },],
        'ref': [{ type: core_1.Input },],
        'refChange': [{ type: core_1.Output },],
        'options': [{ type: core_1.Input },],
        'success': [{ type: core_1.Output },],
        'error': [{ type: core_1.Input },],
        'errorChange': [{ type: core_1.Output },],
        'catcher': [{ type: core_1.Output, args: ['catch',] },],
    };
    return WebCamComponent;
}());
exports.WebCamComponent = WebCamComponent;
//# sourceMappingURL=webcam.component.js.map