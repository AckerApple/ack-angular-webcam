"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var webcam_component_1 = require("./webcam.component");
var AckMediaDevices_directive_1 = require("./AckMediaDevices.directive");
var declarations = [
    webcam_component_1.WebCamComponent,
    AckMediaDevices_directive_1.AckMediaDevices
];
var WebCamModule = (function () {
    function WebCamModule() {
    }
    WebCamModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [common_1.CommonModule],
                    declarations: declarations,
                    exports: declarations
                },] },
    ];
    /** @nocollapse */
    WebCamModule.ctorParameters = function () { return []; };
    return WebCamModule;
}());
exports.WebCamModule = WebCamModule;
//# sourceMappingURL=webcam.module.js.map