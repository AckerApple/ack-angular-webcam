"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Adobe flash fallback dispatcher
 */
var FallbackDispatcher = (function () {
    function FallbackDispatcher(camera) {
        this.cam = camera;
    }
    FallbackDispatcher.implementExternal = function (callbacks) {
        var win = window;
        win.webcam = {
            debug: callbacks.debug,
            onCapture: callbacks.onCapture,
            onTick: callbacks.onTick,
            onSave: callbacks.onSave
        };
    };
    FallbackDispatcher.prototype.capture = function (x) {
        try {
            return this.cam.capture(x);
        }
        catch (e) {
            console.error(e);
        }
    };
    FallbackDispatcher.prototype.save = function (x) {
        try {
            return this.cam.save(x);
        }
        catch (e) {
            console.error(e);
        }
    };
    FallbackDispatcher.prototype.setCamera = function (x) {
        try {
            return this.cam.setCamera(x);
        }
        catch (e) {
            console.error(e);
        }
    };
    FallbackDispatcher.prototype.getCameraSize = function () {
        try {
            return { width: this.cam.width, height: this.cam.height };
        }
        catch (e) {
            console.error(e);
        }
    };
    FallbackDispatcher.prototype.getCameraList = function () {
        try {
            return this.cam.getCameraList();
        }
        catch (e) {
            console.error(e);
        }
    };
    return FallbackDispatcher;
}());
exports.FallbackDispatcher = FallbackDispatcher;
//# sourceMappingURL=fallback.dispatcher.js.map