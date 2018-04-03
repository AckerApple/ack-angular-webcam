"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var videoHelp_1 = require("./videoHelp");
var template = "<video id=\"video\" *ngIf=\"(isSupportUserMedia||isSupportWebRTC)\" autoplay=\"\" playsinline=\"\">Video stream not available</video>";
var WebCamComponent = (function () {
    function WebCamComponent(sanitizer, element) {
        this.sanitizer = sanitizer;
        this.element = element;
        this.isSupportUserMedia = false;
        this.isSupportWebRTC = false;
        this.isFallback = false;
        this.sets = { element: { width: 0, height: 0 } };
        this.mime = 'image/jpeg';
        this.useParentWidthHeight = false;
        this.success = new core_1.EventEmitter();
        this.refChange = new core_1.EventEmitter();
        this.errorChange = new core_1.EventEmitter();
        this.catcher = new core_1.EventEmitter();
    }
    WebCamComponent.prototype.ngOnInit = function () {
        this.isSupportUserMedia = videoHelp_1.getMedia() != null ? true : false;
        this.isSupportUserMedia = false;
        this.isSupportWebRTC = !!(videoHelp_1.browser.mediaDevices && videoHelp_1.browser.mediaDevices.getUserMedia);
    };
    WebCamComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.applyDefaults();
        setTimeout(function () { return _this.afterInitCycles(); }, 0);
    };
    WebCamComponent.prototype.ngOnChanges = function (changes) {
        if (!this.initComplete)
            return;
        if (changes.facingMode
            || changes.videoDevice
            || changes.videoDeviceId) {
            this.redraw(); //restart
        }
        if (changes.reflect) {
            this.applyReflect();
        }
    };
    WebCamComponent.prototype.ngOnDestroy = function () {
        this.observer.disconnect();
        window.removeEventListener('resize', this.onResize);
        this.stop();
    };
    WebCamComponent.prototype.play = function () {
        return this.redraw();
    };
    WebCamComponent.prototype.stop = function () {
        var vid = this.getVideoElm();
        if (vid && vid.pause) {
            vid.pause();
        }
        if (this.stream) {
            this.stream.getTracks().forEach(function (track) { return track.stop(); });
        }
    };
    WebCamComponent.prototype.redraw = function () {
        this.stop();
        this.startCapturingVideo();
    };
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
        var getUserMediaUndefined = (videoHelp_1.browser.mediaDevices && videoHelp_1.browser.mediaDevices.getUserMedia === undefined) && !!media;
        if (getUserMediaUndefined) {
            videoHelp_1.browser.mediaDevices.getUserMedia = function (constraints) {
                return new Promise(function (resolve, reject) {
                    var userMedia = media.call(videoHelp_1.browser, constraints, resolve, reject);
                    if (userMedia.then) {
                        userMedia.then(function (stream) { return _this.applyStream(stream); });
                    }
                })
                    .catch(function (err) { return _this.catchError(err); });
            };
        }
        this.initComplete = true;
        //deprecated. Use angular hash template referencing and @ViewChild
        setTimeout(function () { return _this.refChange.emit(_this); }, 0);
        this.createVideoResizer();
        this.startCapturingVideo()
            .then(function () { return setTimeout(function () { return _this.resize(); }, 10); })
            .catch(function (err) { return _this.catchError(err); });
    };
    WebCamComponent.prototype.applyReflect = function () {
        var videoElm = this.getVideoElm();
        if (!videoElm)
            return;
        if (this.reflect) {
            videoElm.style.transform = "scaleX(-1)";
        }
        else {
            videoElm.style.transform = "scaleX(1)";
        }
    };
    WebCamComponent.prototype.applyStream = function (stream) {
        var videoElm = this.getVideoElm();
        videoElm.srcObject = stream;
        this.applyReflect();
    };
    WebCamComponent.prototype.createVideoResizer = function () {
        var _this = this;
        this.observer = new MutationObserver(function () { return _this.resize(); });
        var config = {
            attributes: true,
            childList: true,
            characterData: true
            //,subtree: true
        };
        this.observer.observe(this.element.nativeElement, config);
        this.onResize = function () { return _this.resize(); };
        window.addEventListener('resize', this.onResize);
    };
    WebCamComponent.prototype.applyDefaults = function () {
        this.options = this.options || {};
        this.options.fallbackSrc = this.options.fallbackSrc || 'jscam_canvas_only.swf';
        this.options.fallbackMode = this.options.fallbackMode || 'callback';
        this.options.fallbackQuality = this.options.fallbackQuality || 200;
        this.isFallback = this.options.fallback || (!this.isSupportUserMedia && !this.isSupportWebRTC && this.options.fallbackSrc) ? true : false;
        if (!this.options.video && !this.options.audio) {
            this.options.video = true;
        }
    };
    WebCamComponent.prototype.onWebRTC = function () {
        var _this = this;
        var promise = Promise.resolve(null);
        return this.promiseVideoOptions()
            .then(function (options) {
            _this.options.video = options;
            return _this.setWebcam(_this.options);
        });
    };
    WebCamComponent.prototype.promiseVideoOptions = function () {
        var promise = Promise.resolve();
        var videoOptions = {};
        if (this.options.video && isOb(this.options.video)) {
            Object.assign(videoOptions, this.options.video);
            if (videoOptions.width && isOb(videoOptions.width) && !Object.keys(videoOptions.width).length) {
                delete videoOptions.width;
            }
            if (videoOptions.height && isOb(videoOptions.height) && !Object.keys(videoOptions.height).length) {
                delete videoOptions.height;
            }
        }
        if (this.facingMode) {
            videoOptions.facingMode = this.facingMode; //{exact:this.facingMode}
        }
        if (this.videoDeviceId) {
            //videoOptions.deviceId = {exact:this.videoDeviceId}
            videoOptions.deviceId = this.videoDeviceId;
        }
        else if (this.videoDevice) {
            //videoOptions.deviceId = {exact:this.videoDevice.deviceId}
            videoOptions.deviceId = this.videoDevice.deviceId;
        }
        return promise.then(function () { return videoOptions; });
    };
    //old method name (deprecated)
    //old method name (deprecated)
    WebCamComponent.prototype.resizeVideo = 
    //old method name (deprecated)
    function (maxAttempts) {
        if (maxAttempts === void 0) { maxAttempts = 4; }
        return this.resize(maxAttempts);
    };
    WebCamComponent.prototype.resize = function (maxAttempts) {
        var _this = this;
        if (maxAttempts === void 0) { maxAttempts = 4; }
        var video = this.getVideoElm();
        if (!video)
            return;
        video.style.position = 'absolute';
        var elm = this.useParentWidthHeight ? this.element.nativeElement.parentNode : this.element.nativeElement;
        var width = this.options.width || parseInt(elm.offsetWidth, 10);
        var height = this.options.height || parseInt(elm.offsetHeight, 10);
        if (!width || !height) {
            width = 320;
            height = 240;
        }
        setTimeout(function () {
            video.width = width;
            video.height = height;
            _this.sets.element.width = width;
            _this.sets.element.height = height;
            video.style.position = 'static';
            //now that we set a width and height, it may need another adjustment if it pushed percent based items around
            var resizeAgain = (!_this.options.width && width != parseInt(elm.offsetWidth, 10)) || (!_this.options.height && height != parseInt(elm.offsetHeight, 10));
            if (resizeAgain && maxAttempts) {
                _this.resize(--maxAttempts);
            }
        }, 1);
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
    WebCamComponent.prototype.setWebcam = function (options) {
        var _this = this;
        return this.promiseStreamByVidOptions(options)
            .then(function (stream) {
            _this.applyStream(stream);
            _this.processSuccess(stream);
            _this.stream = stream;
            return stream;
        })
            .catch(function (err) { return _this.catchError(err); });
    };
    WebCamComponent.prototype.catchError = function (err) {
        this.errorChange.emit(this.error = err);
        this.catcher.emit(err);
        if (!this.errorChange.observers.length && !this.catcher.observers.length) {
            return Promise.reject(err); //if no error subscriptions promise need to continue to be Uncaught
        }
    };
    WebCamComponent.prototype.promiseStreamByVidOptions = function (optionObject) {
        return new Promise(function (resolve, reject) {
            try {
                videoHelp_1.browser.mediaDevices.getUserMedia(optionObject)
                    .then(function (stream) { return resolve(stream); })
                    .catch(function (objErr) { return reject(objErr); });
            }
            catch (e) {
                reject(e);
            }
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
    /**
       * Start capturing video stream
       * @returns {void}
       */
    WebCamComponent.prototype.startCapturingVideo = /**
       * Start capturing video stream
       * @returns {void}
       */
    function () {
        if (!this.isFallback && this.isSupportWebRTC) {
            return this.onWebRTC();
        }
        return Promise.resolve(this.processSuccess());
    };
    WebCamComponent.prototype.getCanvas = function () {
        return document.createElement('canvas');
    };
    /** returns promise . @mime - null=png . Also accepts image/jpeg */
    /** returns promise . @mime - null=png . Also accepts image/jpeg */
    WebCamComponent.prototype.getBase64 = /** returns promise . @mime - null=png . Also accepts image/jpeg */
    function (mime) {
        if (this.isFallback) {
            return this.flashPlayer.captureBase64(mime || this.mime);
            //return this.getFallbackBase64(mime)
        }
        else {
            var canvas = this.getCanvas();
            var video = this.getVideoElm();
            this.setCanvasWidth(canvas, video);
            var ctx = canvas.getContext('2d');
            if (this.reflect) {
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
            }
            ctx.drawImage(video, 0, 0);
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
    /** older browsers (IE11) cannot dynamically apply most attribute changes to object elements. Use this method during fallback */
    WebCamComponent.prototype.createVidElmOb = /** older browsers (IE11) cannot dynamically apply most attribute changes to object elements. Use this method during fallback */
    function () {
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
    WebCamComponent.prototype.setupFallback = function () {
        this.isFallback = true;
        var vidElm = this.getVideoElm() || this.createVidElmOb();
        this.flashPlayer = new videoHelp_1.Fallback(vidElm);
    };
    /** single image to FormData */
    /** single image to FormData */
    WebCamComponent.prototype.captureAsFormData = /** single image to FormData */
    function (options) {
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
        "videoDevice": [{ type: core_1.Input },],
        "videoDeviceId": [{ type: core_1.Input },],
        "reflect": [{ type: core_1.Input },],
        "facingMode": [{ type: core_1.Input },],
        "mime": [{ type: core_1.Input },],
        "useParentWidthHeight": [{ type: core_1.Input },],
        "options": [{ type: core_1.Input },],
        "success": [{ type: core_1.Output },],
        "ref": [{ type: core_1.Input },],
        "refChange": [{ type: core_1.Output },],
        "error": [{ type: core_1.Input },],
        "errorChange": [{ type: core_1.Output },],
        "catcher": [{ type: core_1.Output, args: ['catch',] },],
    };
    return WebCamComponent;
}());
exports.WebCamComponent = WebCamComponent;
function isOb(v) {
    return typeof (v) === 'object';
}
//# sourceMappingURL=webcam.component.js.map