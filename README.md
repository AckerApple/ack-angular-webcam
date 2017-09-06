# ack-angular-webcam
A cross-browser angular2 component, it will use the browser's native `getUserMedia()` implementation, otherwise an optional Flash fallback is available.

[Demo Page](https://ackerapple.github.io/ack-angular-webcam/)

### BEWARE
- HTTPS or localhost required
  - Host must be localhost or an https connection
- Internet Explorer<span name="internet-explorer" id="internet-explorer" ref="old md title link"></span>
  - Internet Explorer is not at all supported. Sorry not sorry

### Table of Contents

- [Screenshot](#screenshot)
- [Notes](#notes)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Importing](#importing)
  - [Example Usage](#example-usage)
- [Options](#options)
- [Flash Fallback](#flash-fallbak)
- [Example and Tests](#example-and-tests)
  - [Locally-Test](#locally-test)
- [WoRk On ThIs PaCkAgE](#work-on-this-package)
- [If You Like ack-webpack](#if-you-like-ack-webpack)
- [Credits](#credits)
- [Spec References](#spec-references)

## Screenshot

![Screenshot](https://ackerapple.github.io/ack-angular-webcam/screenshot.png)

## Notes

This component is based on [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)  and [getUserMedia.js Polyfill](https://github.com/addyosmani/getUserMedia.js).

Please, check original repository for clear understanding

## Getting Started

### Installation
```bash
npm install ack-angular-webcam --save-dev
```

### Importing
Use webcam as a pure angular2 component

+ Add component into your module
```javascript
import { WebCamComponent } from 'ack-angular-webcam';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    WebCamComponent
  ],
  bootstrap: [ AppComponent ]
})
class AppModule {
}
export default AppModule;
```

### Example Usage

app.component.ts
```javascript
import { Component } from '@angular/core';
import { Http, Request } from '@angular/http';

const template = `
<ack-webcam [(ref)]="webcam" [options]="options" (onSuccess)="onCamSuccess($event)" (onError)="onCamError($event)"></ack-webcam>
<button (click)="genBase64()"> generate base64 </button>
<button (click)="genPostData()"> generate post data </button>
`

@Component({
  selector:'app-component',
  template:template
}) export class AppComponent{
  public webcam//will be populated by ack-webcam [(ref)]
  public base64

  constructor(public http:Http){}

  genBase64(){
    this.webcam.getBase64()
    .then( base=>this.base64=base)
    .catch( e=>console.error(e) )
  }

  //get HTML5 FormData object and pretend to post to server
  genPostData(){
    this.webcam.captureAsFormData({fileName:'file.jpg'})
    .then( formData=>this.postFormData(formData) )
    .catch( e=>console.error(e) )
  }

  //a pretend process that would post the webcam photo taken
  postFormData(formData){
    const config = {
      method:"post",
      url:"http://www.aviorsciences.com/",
      body: formData
    }

    const request = new Request(config)

    return this.http.request( request )
  }

  onCamError(err){}

  onCamSuccess(){}
}
```

## Options

```javascript
{
  audio: boolean,
  video: boolean,
  width: number,
  height: number,
  fallbackMode: 'callback',
  fallbackSrc: 'jscam_canvas_only.swf',
  fallbackQuality: 85,
  cameraType: 'front' || 'back'
};
```

Tested for tablet (Android 4.4.2 GT-N5110) and phone (Android 4.1.2 GT-I8268)

## Flash Fallback

Quite Simple: You must indicate the URL of the swf fallback file named **jscam_canvas_only.swf**

> This file is included and located at ack-angular-webcam/jscam_canvas_only.swf



## Example and Tests

You can check example using following npm commands:
```
npm run watch
```

### Locally Test
Type the following commands in a command prompt terminal

Step 1 of 4
```
git clone https://github.com/ackerapple/ack-angular-webcam -b master
```

Step 2 of 4
```
cd ack-angular-webcam
```

Step 3 of 4
```
npm install
```

Step 4 of 4
```
npm run watch
```

> After step 4, a web browser should auto open a demo page and any code changes you perform to ack-angular-webcam will cause an auto-refresh of browser

## WoRk On ThIs PaCkAgE
Nobodies perfect

> Source files are on not the default github branch

- [Source files here](https://github.com/AckerApple/ack-angular-webcam/tree/master)

### Process to pull request
- Make changes in  master branch
- Change package version number based on impact of change 0.0.0
- npm run build

## If You Like ack-webpack
You might also want to give these packages a try
- [ack-angular](https://www.npmjs.com/package/ack-angular)
- [ack-angular-fx](https://www.npmjs.com/package/ack-angular-fx)
- [ack-css-boot](https://www.npmjs.com/package/ack-css-boot)

## Credits
- [pre-fork package credits](https://github.com/addyosmani/getUserMedia.js#credits)
- Fork from : [Artur Basak](https://www.npmjs.com/~archik408)
- Forked by : [Acker Apple](https://www.npmjs.com/~ackerapple)

## Spec References
* [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
* [getUserMedia()](https://w3c.github.io/mediacapture-main/getusermedia.html)
* [WebRTC 1.0](http://w3c.github.io/webrtc-pc/)
