webpackJsonp(["main"],{

/***/ "./example/app/$$_lazy_route_resource lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./example/app/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./example/app/app.component.ts":
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var videoHelp_1 = __webpack_require__("./src/videoHelp.ts");
var pack = __webpack_require__("./package.json");
var app_template_1 = __webpack_require__("./example/app/app.template.ts");
var AppComponent = (function () {
    function AppComponent(element) {
        this.element = element;
        this.isFacingModeSupported = videoHelp_1.isFacingModeSupported();
        this.version = pack["version"];
        this.cameras = [];
        this.facingModes = ["user", "environment", "left", "right"];
        this.captured = false;
        this.addCamera();
    }
    AppComponent.prototype.addCamera = function () {
        this.cameras.push({ options: {
                audio: false,
                video: { width: {}, height: {} },
                fallbackSrc: 'fallback/jscam_canvas_only.swf'
            } });
    };
    AppComponent.prototype.onSuccess = function (stream) {
        console.log('capturing video stream');
    };
    AppComponent.prototype.captureBase64 = function (webcam) {
        var _this = this;
        return webcam.getBase64()
            .then(function (base) {
            _this.captured = new Date();
            _this.base64 = base;
            setTimeout(function () { return webcam.resizeVideo(); }, 0);
        })
            .catch(function (e) { return console.error(e); });
    };
    AppComponent.prototype.getErrorJson = function (error) {
        var keys = Object.getOwnPropertyNames(error);
        var ob = {};
        keys.forEach(function (key) { return ob[key] = error[key]; });
        return ob;
    };
    AppComponent.prototype.logerror = function (e) {
        console.error(e);
        console.info('debug cameras', this.cameras);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-component',
            template: app_template_1.string
        }),
        __metadata("design:paramtypes", [core_1.ElementRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;


/***/ }),

/***/ "./example/app/app.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
var index_1 = __webpack_require__("./src/index.ts");
var app_component_1 = __webpack_require__("./example/app/app.component.ts");
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                index_1.WebCamModule
            ],
            declarations: [
                app_component_1.AppComponent
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ }),

/***/ "./example/app/app.template.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.string = "<!-- devices--><div style=\"position:absolute;right:5px;color:#999999;\">v{{ version || '0.0.0' }}</div><ng-container *ngIf=\"changeConfig\"><ack-media-devices [(array)]=\"devices\" [(videoInputs)]=\"videoDevices\" [(audioInputs)]=\"audioDevices\" [(audioOutputs)]=\"audioOutputs\" [(error)]=\"deviceError\"></ack-media-devices><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" height=\"100%\"><tbody *ngIf=\"!deviceError\"><tr><td colspan=\"3\" style=\"height:40px;\"><div style=\"font-weight:bold;font-size:1.3em;\">{{ devices?.length }} Devices</div>{{ audioOutputs?.length }} Audio Outputs</td></tr><tr style=\"height:40px;\"><td valign=\"bottom\">{{ videoDevices?.length }} Video Inputs</td><td valign=\"bottom\">{{ audioDevices?.length }} Audio Inputs</td><td>Facing Mode {{ isFacingModeSupported ? 'IS' : 'NOT' }} Supported</td></tr><tr style=\"height:40px;\"><td><select style=\"display:block;width:100%;height:100%\" (change)=\"changeConfig.videoDeviceId=$event.target.value\"><option>default</option><option *ngFor=\"let device of videoDevices;let index=index\" [value]=\"device.deviceId\" [selected]=\"changeConfig.videoDeviceId==device.deviceId\">{{ device.label || device.kind+'('+index+')' }}</option></select></td><td><select style=\"display:block;width:100%;height:100%\" (change)=\"changeConfig.audioDeviceId=$event.target.value\"><option>default</option><option *ngFor=\"let device of audioDevices;let index=index\" [value]=\"device.deviceId\" [selected]=\"changeConfig.audioDeviceId==device.deviceId\">{{ device.label || device.kind+'('+index+')' }}</option></select></td><td><select style=\"display:block;width:100%;height:100%\" (change)=\"changeConfig.facingMode=$event.target.value\"><option>default</option><option *ngFor=\"let item of facingModes;let index=index\" [value]=\"item\" [selected]=\"changeConfig.facingMode==item\">{{ item }}</option></select></td></tr><tr><td colspan=\"3\"><textarea style=\"padding:.5em;font-size:1em;width:100%;height:100%;min-height:200px;\">{{ devices | json }}</textarea></td></tr></tbody><tfoot><tr *ngIf=\"deviceError\"><td colspan=\"3\"><textarea readonly=\"readonly\" style=\"padding:.5em;font-size:1em;width:100%;height:100%;color:red;\">{{ deviceError.name+'\r\r' }}{{ deviceError.message+'\r\r' }}{{ deviceError | json }}</textarea></td></tr><tr><td colspan=\"3\" style=\"height:60px\"><button (click)=\"changeConfig=null\" style=\"padding:1em;font-size:1.2em;width:100%\">close</button></td></tr></tfoot></table></ng-container><!-- capture--><table *ngIf=\"!changeConfig &amp;&amp; captured\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" height=\"100%\"><tr><td colspan=\"2\" valign=\"top\" style=\"overflow:hidden;width:100%;text-align:center;background-position:center;background-size:contain;background-repeat:no-repeat;\" [hidden]=\"!captured\" [style.background-image]=\"base64?'url('+base64+')':null\">&nbsp;</td></tr><tr *ngIf=\"showBase64\" style=\"height:60px\"><td colspan=\"2\"><input style=\"width:100%;padding:1em;\" [attr.value]=\"base64\" readonly=\"readonly\"/></td></tr><tr style=\"height:60px\"><td><button (click)=\"showBase64=!showBase64\" style=\"padding:1em;font-size:1.2em;width:100%;\">{{ showBase64 ? 'Hide':'Show'}} Base64</button></td><td><button (click)=\"showBase64=null;captured=null\" style=\"padding:1em;font-size:1.2em;width:100%;\">Close</button></td></tr></table><!-- webcam--><table *ngIf=\"!captured\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" height=\"100%\"><ng-container *ngFor=\"let camConfig of cameras; let index=index\"><tr *ngIf=\"cameras[index].error\"><td colspan=\"2\"><textarea style=\"padding:.5em;font-size:1em;width:100%;height:100%;color:red;\">{{ cameras[index].error.name+'\r\r' }}{{ cameras[index].error.message+'\r\r' }}{{ getErrorJson(cameras[index].error) | json }}</textarea></td></tr><tr *ngIf=\"!cameras[index].error\"><td *ngIf=\"!cameras[index].destroy\" colspan=\"3\" valign=\"top\"><ack-webcam #webcam=\"\" [videoDeviceId]=\"cameras[index].videoDeviceId\" [facingMode]=\"cameras[index].facingMode\" [reflect]=\"cameras[index].reflect\" [(error)]=\"cameras[index].error\" (errorChange)=\"logerror($event)\" [options]=\"cameras[index].options\" (success)=\"onSuccess($event)\" style=\"width:100%;height:100%;display:block;text-align:center;\"></ack-webcam></td></tr><tr style=\"height:60px\"><td colspan=\"3\" style=\"text-align:center\"><div *ngIf=\"cameras[index].resize\"><div>width:<input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.width=$event.target.value &amp;&amp; webcam.resize() : null\" [placeholder]=\"webcam.sets.element.width\"/>px" +
    "\n&nbsp;&nbsp;x&nbsp;&nbsp;" +
    "\nheight:<input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.height=$event.target.value &amp;&amp; webcam.resize() : null\" [placeholder]=\"webcam.sets.element.height\"/>px</div><br/><table align=\"center\"><tr><td></td><td>Video Width</td><td> Video Height</td></tr><tr><td>min:</td><td><input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.video.width.min=$event.target.value &amp;&amp; webcam.redraw() : null\"/></td><td><input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.video.width.min=$event.target.value &amp;&amp; webcam.redraw() : null\"/></td></tr><tr><td>ideal:</td><td><input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.video.width.ideal=$event.target.value &amp;&amp; webcam.redraw() : null\"/></td><td><input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.video.width.ideal=$event.target.value &amp;&amp; webcam.redraw() : null\"/></td></tr><tr><td>exact:</td><td><input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.video.width.exact=$event.target.value &amp;&amp; webcam.redraw() : null\"/></td><td><input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.video.height.exact=$event.target.value &amp;&amp; webcam.redraw() : null\"/></td></tr><tr><td>max:</td><td><input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.video.width.max=$event.target.value &amp;&amp; webcam.redraw() : null\"/></td><td><input type=\"number\" (keyup)=\"$event.target.value ? cameras[index].options.video.width.max=$event.target.value &amp;&amp; webcam.redraw() : null\"/></td></tr></table></div><button (click)=\"cameras[index].reflect=!cameras[index].reflect\" style=\"padding:.5em;font-size:1.1em;\" [style.background-color]=\"cameras[index].reflect ? '#999' : null\">Reflect{{ cameras[index].reflect ? 'ing' : ''}}</button><button *ngIf=\"webcam\" (click)=\"captureBase64(webcam)\" style=\"padding:.5em;font-size:1.1em;\">Capture</button><button (click)=\"cameras.splice(index,1)\" style=\"padding:.5em;font-size:1.1em;\">Destroy</button><button (click)=\"changeConfig=camConfig\" style=\"padding:.5em;font-size:1.1em;\">Devices</button><button (click)=\"cameras[index].resize=!cameras[index].resize\" style=\"padding:.5em;font-size:1.1em;\" [style.background-color]=\"cameras[index].resize ? '#999' : null\">Sizing</button><button (click)=\"cameras[index].playing=cameras[index].playing?0:1;cameras[index].playing ? webcam.stop() : webcam.play()\" style=\"padding:.5em;font-size:1.1em;\" [style.background-color]=\"cameras[index].resize ? '#999' : null\">Stop/Starts</button></td><td></td><td></td></tr></ng-container><tr style=\"height:60px\"><td colspan=\"3\"><button (click)=\"addCamera()\" style=\"padding:1em;font-size:1.2em;width:100%\">Add Device</button></td></tr></table>";


/***/ }),

/***/ "./example/app/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("./node_modules/zone.js/dist/zone.js");
__webpack_require__("./node_modules/reflect-metadata/Reflect.js");
//import { enableProdMode } from "@angular/core"
var platform_browser_dynamic_1 = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/esm5/platform-browser-dynamic.js");
var app_module_1 = __webpack_require__("./example/app/app.module.ts");
//enableProdMode()
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);


/***/ }),

/***/ "./package.json":
/***/ (function(module, exports) {

module.exports = {"name":"ack-angular-webcam","version":"1.10.0","description":"Angular webcam component. Based on MediaDevices and getUserMedia.js ","main":"dist/index.js","typings":"dist/index.d.ts","scripts":{"build:templates":"ack-pug-bundler example/app example/app --outFileExt template.ts --outType ts --oneToOne","start":"ack-reload -d example/www -b","test:old":"karma start --sr","watch:js":"ack-webpack ./example/app/index.ts example/www/index.js --project example/app/tsconfig.json --modules . --watch --browser","watch:dist":"watch \"npm-run-all build:dist\" src/","watch":"npm-run-all --parallel watch:dist watch:js watch:templates","watch:templates":"npm run build:templates -- --watch","build:dist":"ngc --declaration --project src","ack-webpack":"ack-webpack","build":"npm-run-all build:templates compile:dist:package build:dist build:js","build:js":"node --max-old-space-size=8192 ./node_modules/.bin/ng build --app=example --sourcemaps=true --output-hashing=all","compile:dist:package":"node scripts/update-dist-package.js","test":"ng test --browser PhantomJS --single-run","test:watch":"ng test"},"repository":{"type":"git","url":"git+https://github.com/ackerapple/ack-angular-webcam.git"},"keywords":["ng2","Angular","getusermedia","webcam","video","gum"],"author":"Akcer Apple","licenses":[{"type":"MIT"}],"devDependencies":{"@angular/cli":"^1.6.3","@angular/common":"^5.1.2","@angular/compiler":"^5.1.2","@angular/compiler-cli":"^5.1.2","@angular/core":"^5.1.2","@angular/platform-browser":"^5.1.2","@angular/platform-browser-dynamic":"^5.1.2","ack-pug-bundler":"^1.4.7","ack-webpack":"^1.2.1","classlist-polyfill":"^1.2.0","core-js":"^2.5.3","minimatch":"^3.0.4","npm-run-all":"^4.1.2","reflect-metadata":"^0.1.10","rxjs":"^5.5.6","ts-helpers":"^1.1.2","ts-loader":"^3.2.0","typescript":"2.4.2","webpack":"^3.10.0","webpack-merge":"^4.1.1","zone.js":"^0.8.19"},"bugs":{"url":"https://github.com/ackerapple/ack-angular-webcam/issues"},"homepage":"https://github.com/ackerapple/ack-angular-webcam#readme","directories":{"example":"example"},"license":"MIT","private":true,"scriptsInfo":{"test":"Tests angular app using karama and jasmine","test:watch":"Opens local browser to test angular app"}}

/***/ }),

/***/ "./src/AckMediaDevices.directive.ts":
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var videoHelp_1 = __webpack_require__("./src/videoHelp.ts");
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


/***/ }),

/***/ "./src/audioTest.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
console.log("loading");
//stream.getAudioTracks()[0].stop()
// success callback when requesting audio input stream
function gotStream(stream) {
    console.log("stream", stream);
    //window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();
    // Create an AudioNode from the stream.
    var mediaStreamSource = audioContext.createMediaStreamSource(stream);
    // Connect it to the destination to hear yourself (or any other node for processing!)
    mediaStreamSource.connect(audioContext.destination);
    console.log("connected");
    setTimeout(function () {
        mediaStreamSource.disconnect();
    }, 10000);
}
//navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia({ audio: true }, gotStream, function (e) { console.log('e', e); });
exports.a = 1;
console.log("loaded");


/***/ }),

/***/ "./src/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var webcam_component_1 = __webpack_require__("./src/webcam.component.ts");
exports.WebCamComponent = webcam_component_1.WebCamComponent;
var webcam_module_1 = __webpack_require__("./src/webcam.module.ts");
exports.WebCamModule = webcam_module_1.WebCamModule;


/***/ }),

/***/ "./src/videoHelp.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
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
    Fallback.prototype.addFallbackParams = function (options) {
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


/***/ }),

/***/ "./src/webcam.component.ts":
/***/ (function(module, exports, __webpack_require__) {

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
var a = __webpack_require__("./src/audioTest.ts");
console.log("a", a);
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var platform_browser_1 = __webpack_require__("./node_modules/@angular/platform-browser/esm5/platform-browser.js");
var videoHelp_1 = __webpack_require__("./src/videoHelp.ts");
var template = "<video id=\"video\" *ngIf=\"(isSupportUserMedia||isSupportWebRTC)\" autoplay=\"\" playsinline=\"\">Video stream not available</video>";
var WebCamComponent = (function () {
    function WebCamComponent(sanitizer, element) {
        this.sanitizer = sanitizer;
        this.element = element;
        this.sets = { element: { width: 0, height: 0 } };
        this.mime = 'image/jpeg';
        this.useParentWidthHeight = false;
        this.success = new core_1.EventEmitter();
        this.errorChange = new core_1.EventEmitter();
        this.catcher = new core_1.EventEmitter();
        console.log("123");
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
        //setTimeout(()=>this.refChange.emit(this), 0)
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
            /* attempt to prevent bad videoOptions */
            if (videoOptions.width && isOb(videoOptions.width) && !Object.keys(videoOptions.width).length) {
                delete videoOptions.width;
            }
            if (videoOptions.height && isOb(videoOptions.height) && !Object.keys(videoOptions.height).length) {
                delete videoOptions.height;
            }
            /* end: fix vid options */
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
    WebCamComponent.prototype.resizeVideo = function (maxAttempts) {
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
    WebCamComponent.prototype.startCapturingVideo = function () {
        if (!this.isFallback && this.isSupportWebRTC) {
            return this.onWebRTC();
        }
        return Promise.resolve(this.processSuccess());
    };
    WebCamComponent.prototype.getCanvas = function () {
        var canvas = document.createElement('canvas');
        var video = this.getVideoElm();
        this.setCanvasWidth(canvas, video);
        var ctx = canvas.getContext('2d');
        if (this.reflect) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        return canvas;
    };
    WebCamComponent.prototype.getBlob = function () {
        var _this = this;
        return new Promise(function (res, rej) {
            var canvas = _this.getCanvas();
            canvas.toBlob(function (file) {
                res(file);
            }, _this.mime, 1);
        });
    };
    WebCamComponent.prototype.getFile = function (fileName) {
        return this.getBlob().then(function (file) { return blobToFile(file, fileName); });
    };
    /** returns promise . @mime - null=png . Also accepts image/jpeg */
    WebCamComponent.prototype.getBase64 = function (mime) {
        if (this.isFallback) {
            return this.flashPlayer.captureBase64(mime || this.mime);
            //return this.getFallbackBase64(mime)
        }
        else {
            var canvas = this.getCanvas();
            return Promise.resolve(canvas.toDataURL(mime));
        }
    };
    WebCamComponent.prototype.setCanvasWidth = function (canvas, video) {
        var di = this.getVideoDimensions(video);
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
    __decorate([
        core_1.Input(),
        __metadata("design:type", MediaDeviceInfo)
    ], WebCamComponent.prototype, "videoDevice", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], WebCamComponent.prototype, "videoDeviceId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], WebCamComponent.prototype, "reflect", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], WebCamComponent.prototype, "facingMode", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], WebCamComponent.prototype, "mime", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], WebCamComponent.prototype, "useParentWidthHeight", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], WebCamComponent.prototype, "options", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], WebCamComponent.prototype, "success", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Error)
    ], WebCamComponent.prototype, "error", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", core_1.EventEmitter)
    ], WebCamComponent.prototype, "errorChange", void 0);
    __decorate([
        core_1.Output('catch'),
        __metadata("design:type", core_1.EventEmitter)
    ], WebCamComponent.prototype, "catcher", void 0);
    WebCamComponent = __decorate([
        core_1.Component({
            selector: 'ack-webcam',
            template: template
        }),
        __metadata("design:paramtypes", [platform_browser_1.DomSanitizer,
            core_1.ElementRef])
    ], WebCamComponent);
    return WebCamComponent;
}());
exports.WebCamComponent = WebCamComponent;
function isOb(v) {
    return typeof (v) === 'object';
}
function blobToFile(theBlob, fileName) {
    var b = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
    //Cast to a File() type
    return theBlob;
}


/***/ }),

/***/ "./src/webcam.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = __webpack_require__("./node_modules/@angular/common/esm5/common.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/esm5/core.js");
var webcam_component_1 = __webpack_require__("./src/webcam.component.ts");
var AckMediaDevices_directive_1 = __webpack_require__("./src/AckMediaDevices.directive.ts");
var declarations = [
    webcam_component_1.WebCamComponent,
    AckMediaDevices_directive_1.AckMediaDevices
];
var WebCamModule = (function () {
    function WebCamModule() {
    }
    WebCamModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: declarations,
            exports: declarations
        })
    ], WebCamModule);
    return WebCamModule;
}());
exports.WebCamModule = WebCamModule;


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./example/app/index.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.359616ba293797d12356.bundle.js.map