"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var webcam_component_1 = require("./webcam.component");
var fixture;
var comp;
// make AoT compatible with ngc
if (!describe) {
    var describe = function (i, x) { };
    var beforeEach = function (i) { };
    var it = function (i, x) { };
    var expect = function (i) { return { toBeTruthy: function () { } }; };
}
console.log('88');
describe('WebCamComponent', function () {
    var elementRefStub = {};
    var domSanitizerStub = {
        bypassSecurityTrustResourceUrl: function () { }
    };
    beforeEach(testing_1.async(function () {
        console.log('77');
        testing_1.TestBed.configureTestingModule({
            declarations: [
                webcam_component_1.WebCamComponent
            ],
            providers: [
                { provide: core_1.ElementRef, useValue: elementRefStub },
                { provide: platform_browser_1.DomSanitizer, useValue: domSanitizerStub }
            ]
        })
            .compileComponents()
            .then(function () {
            console.log('100');
            fixture = testing_1.TestBed.createComponent(webcam_component_1.WebCamComponent);
            comp = fixture.componentInstance;
        });
    }));
    it('should create the WebCamComponent', function () {
        console.log('99');
        var step = fixture.debugElement.componentInstance;
        expect(step).toBeTruthy();
    });
});
//# sourceMappingURL=webcam.component.spec.js.map