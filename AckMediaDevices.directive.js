"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var videoHelp_1 = require("./videoHelp");
var AckMediaDevices = /** @class */ (function () {
    function AckMediaDevices() {
        this.array = [];
        this.arrayChange = new core_1.EventEmitter();
        this.errorChange = new core_1.EventEmitter();
        this.catcher = new core_1.EventEmitter();
    }
    AckMediaDevices.prototype.ngOnInit = function () {
        this.loadDevices();
    };
    AckMediaDevices.prototype.loadDevices = function () {
        var _this = this;
        return videoHelp_1.browser.mediaDevices.enumerateDevices()
            .then(function (devices) { return _this.arrayChange.emit(_this.array = devices); })
            .catch(function (e) {
            _this.catcher.emit(e);
            _this.errorChange.emit(_this.error = e);
            return Promise.reject(e);
        });
    };
    AckMediaDevices.decorators = [
        { type: core_1.Directive, args: [{
                    selector: 'ack-media-devices'
                },] },
    ];
    /** @nocollapse */
    AckMediaDevices.ctorParameters = function () { return []; };
    AckMediaDevices.propDecorators = {
        'array': [{ type: core_1.Input },],
        'arrayChange': [{ type: core_1.Output },],
        'error': [{ type: core_1.Input },],
        'errorChange': [{ type: core_1.Output },],
        'catcher': [{ type: core_1.Output, args: ['catch',] },],
    };
    return AckMediaDevices;
}());
exports.AckMediaDevices = AckMediaDevices;
//# sourceMappingURL=AckMediaDevices.directive.js.map