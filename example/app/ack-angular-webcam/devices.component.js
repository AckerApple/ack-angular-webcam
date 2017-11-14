"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var videoHelp_1 = require("./videoHelp");
var WebCamComponent = /** @class */ (function () {
    function WebCamComponent() {
        this.array = [];
        this.arrayChange = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.errorChange = new core_1.EventEmitter();
    }
    WebCamComponent.prototype.ngOnInit = function () {
        this.loadDevices();
    };
    WebCamComponent.prototype.loadDevices = function () {
        var _this = this;
        videoHelp_1.getMedia().enumerateDevices()
            .then(function (devices) { return _this.array = devices; })
            .catch(function (e) { return _this.errorChange.emit(_this.error = e); });
    };
    WebCamComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'ack-media-devices',
                    template: '<ng-content></ng-content>'
                },] },
    ];
    /** @nocollapse */
    WebCamComponent.ctorParameters = function () { return []; };
    WebCamComponent.propDecorators = {
        'array': [{ type: core_1.Input },],
        'arrayChange': [{ type: core_1.Output },],
        'error': [{ type: core_1.Input },],
        'errorChange': [{ type: core_1.Output, args: ['catch',] },],
    };
    return WebCamComponent;
}());
exports.WebCamComponent = WebCamComponent;
//# sourceMappingURL=devices.component.js.map