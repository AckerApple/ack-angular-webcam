"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var videoHelp_1 = require("./videoHelp");
var AckMediaDevices = (function () {
    function AckMediaDevices() {
        this.array = [];
        this.arrayChange = new core_1.EventEmitter();
        this.errorChange = new core_1.EventEmitter();
        this.catcher = new core_1.EventEmitter();
        this.videoInputsChange = new core_1.EventEmitter();
        this.audioInputsChange = new core_1.EventEmitter();
        this.audioOutputsChange = new core_1.EventEmitter();
    }
    AckMediaDevices.prototype.ngOnInit = function () {
        this.loadDevices();
    };
    AckMediaDevices.prototype.loadDevices = function () {
        var _this = this;
        return videoHelp_1.promiseDevices()
            .then(function (devices) { return _this.onDevices(devices) && devices; })
            .catch(function (e) {
            _this.catcher.emit(e);
            _this.errorChange.emit(_this.error = e);
            return Promise.reject(e);
        });
    };
    AckMediaDevices.prototype.onDevices = function (devices) {
        this.arrayChange.emit(this.array = devices);
        if (this.audioInputsChange.observers.length) {
            this.audioInputs = videoHelp_1.audioInputsByDevices(devices);
            this.audioInputsChange.emit(this.audioInputs);
        }
        if (this.audioOutputsChange.observers.length) {
            this.audioOutputs = videoHelp_1.audioOutputsByDevices(devices);
            this.audioOutputsChange.emit(this.audioOutputs);
        }
        if (this.videoInputsChange.observers.length) {
            this.videoInputs = videoHelp_1.videoInputsByDevices(devices);
            this.videoInputsChange.emit(this.videoInputs);
        }
        return this;
    };
    AckMediaDevices.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ack-media-devices'
                },] },
    ];
    /** @nocollapse */
    AckMediaDevices.ctorParameters = function () { return []; };
    AckMediaDevices.propDecorators = {
        "array": [{ type: core_1.Input },],
        "arrayChange": [{ type: core_1.Output },],
        "error": [{ type: core_1.Input },],
        "errorChange": [{ type: core_1.Output },],
        "catcher": [{ type: core_1.Output, args: ['catch',] },],
        "videoInputs": [{ type: core_1.Input },],
        "videoInputsChange": [{ type: core_1.Output },],
        "audioInputs": [{ type: core_1.Input },],
        "audioInputsChange": [{ type: core_1.Output },],
        "audioOutputs": [{ type: core_1.Input },],
        "audioOutputsChange": [{ type: core_1.Output },],
    };
    return AckMediaDevices;
}());
exports.AckMediaDevices = AckMediaDevices;
//# sourceMappingURL=AckMediaDevices.directive.js.map