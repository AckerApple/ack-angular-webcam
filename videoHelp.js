"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.browser = navigator;
function getMedia() {
    return exports.browser.getUserMedia
        || exports.browser.webkitGetUserMedia
        || exports.browser.mozGetUserMedia
        || exports.browser.msGetUserMedia;
}
exports.getMedia = getMedia;
/*
export interface MediaDevice{
  deviceId: string
  kind: "videoinput" | "audioinput" | string
  label: string
  groupId: string
}*/
function dataUriToBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    }
    else {
        byteString = window['unescape'](dataURI.split(',')[1]);
    }
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}
exports.dataUriToBlob = dataUriToBlob;
/** single image to transmittable resource */
function dataUriToFormData(dataURI, options) {
    options = options || {};
    options.form = options.form || new FormData();
    options.form.append('file', dataUriToBlob(dataURI), options.fileName || 'file.jpg');
    return options.form;
}
exports.dataUriToFormData = dataUriToFormData;
function drawImageArrayToCanvas(imgArray) {
    var canvas = document.createElement('canvas');
    // const di = this.getVideoDimensions()
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
}
exports.drawImageArrayToCanvas = drawImageArrayToCanvas;
var Fallback = (function () {
    function Fallback(videoObject) {
        var _this = this;
        this.onImage = new core_1.EventEmitter();
        this.videoObject = videoObject;
        var dataImgArray = [];
        //method intended to live within window memory
        this.debug = function (tag, message) {
            if (tag == 'notify' && message == 'Capturing finished.') {
                _this.onImage.emit(drawImageArrayToCanvas(dataImgArray));
            }
        };
        //method intended to live within window memory
        this.onCapture = function () {
            dataImgArray.length = 0;
            videoObject.save();
        };
        //method intended to live within window memory
        this.onSave = function (data) {
            dataImgArray.push(data);
        };
        //Flash swf file expects window.webcam to exist as communication bridge
        window['webcam'] = this;
    }
    Fallback.prototype.captureToCanvas = function () {
        var _this = this;
        return new Promise(function (res, rej) {
            var subscription = _this.onImage.subscribe(function (img) {
                res(img);
                subscription.unsubscribe();
            });
            _this.videoObject.capture();
        });
    };
    Fallback.prototype.captureBase64 = function (mime) {
        return this.captureToCanvas()
            .then(function (canvas) { return canvas.toDataURL(mime || 'image/jpeg'); });
    };
    /**
     * Add <param>'s into fallback object
     * @param cam - Flash web camera instance
     * @returns {void}
     */
    /**
       * Add <param>'s into fallback object
       * @param cam - Flash web camera instance
       * @returns {void}
       */
    Fallback.prototype.addFallbackParams = /**
       * Add <param>'s into fallback object
       * @param cam - Flash web camera instance
       * @returns {void}
       */
    function (options) {
        var paramFlashVars = document.createElement('param');
        paramFlashVars.name = 'FlashVars';
        paramFlashVars.value = 'mode=' + options.fallbackMode + '&amp;quality=' + options.fallbackQuality;
        this.videoObject.appendChild(paramFlashVars);
        var paramAllowScriptAccess = document.createElement('param');
        paramAllowScriptAccess.name = 'allowScriptAccess';
        paramAllowScriptAccess.value = 'always';
        this.videoObject.appendChild(paramAllowScriptAccess);
        //is this even needed?
        this.videoObject.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
        var paramMovie = document.createElement('param');
        paramMovie.name = 'movie';
        paramMovie.value = options.fallbackSrc;
        this.videoObject.appendChild(paramMovie);
        this.videoObject.data = options.fallbackSrc;
    };
    return Fallback;
}());
exports.Fallback = Fallback;
function videoInputsByDevices(devices) {
    return devicesByKind(devices, 'videoinput');
}
exports.videoInputsByDevices = videoInputsByDevices;
function audioInputsByDevices(devices) {
    return devicesByKind(devices, 'audioinput');
}
exports.audioInputsByDevices = audioInputsByDevices;
function audioOutputsByDevices(devices) {
    return devicesByKind(devices, 'audiooutput');
}
exports.audioOutputsByDevices = audioOutputsByDevices;
function devicesByKind(devices, kind) {
    return devices.filter(function (device) { return device.kind === kind; });
}
exports.devicesByKind = devicesByKind;
function promiseDeviceById(id) {
    return promiseDevices().then(function (devices) { return devices.find(function (device) { return device.deviceId == id; }); });
}
exports.promiseDeviceById = promiseDeviceById;
function promiseDevices() {
    //const x:Promise<MediaDeviceInfo[]> = browser.mediaDevices.enumerateDevices().then( devices=>devices )
    return exports.browser.mediaDevices.enumerateDevices();
}
exports.promiseDevices = promiseDevices;
function isFacingModeSupported() {
    if (!exports.browser.mediaDevices)
        return false;
    var contraints = exports.browser.mediaDevices.getSupportedConstraints();
    return contraints.facingMode;
}
exports.isFacingModeSupported = isFacingModeSupported;
//# sourceMappingURL=videoHelp.js.map