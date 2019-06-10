"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var videoHelp_1 = require("./videoHelp");
var AckMediaDevices = /** @class */ (function () {
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
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], AckMediaDevices.prototype, "array", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AckMediaDevices.prototype, "arrayChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Error)
    ], AckMediaDevices.prototype, "error", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AckMediaDevices.prototype, "errorChange", void 0);
    __decorate([
        core_1.Output('catch'),
        __metadata("design:type", core_1.EventEmitter)
    ], AckMediaDevices.prototype, "catcher", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], AckMediaDevices.prototype, "videoInputs", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AckMediaDevices.prototype, "videoInputsChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], AckMediaDevices.prototype, "audioInputs", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AckMediaDevices.prototype, "audioInputsChange", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], AckMediaDevices.prototype, "audioOutputs", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], AckMediaDevices.prototype, "audioOutputsChange", void 0);
    AckMediaDevices = __decorate([
        core_1.Directive({
            selector: 'ack-media-devices'
        })
    ], AckMediaDevices);
    return AckMediaDevices;
}());
exports.AckMediaDevices = AckMediaDevices;
//# sourceMappingURL=AckMediaDevices.directive.js.map