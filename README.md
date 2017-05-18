# ack-angular-webcam
A cross-browser angular2 component, it will use the browser's native `getUserMedia()` implementation, otherwise an optional Flash fallback is available.

[Demo Page](https://ackerapple.github.io/ack-angular-webcam/)

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
const template = `
<ack-webcam [(ref)]="webcam" [options]="options" (onSuccess)="onCamSuccess($event)" (onError)="onCamError($event)"></ack-webcam>
<button (click)="genBase64()"> generate base64 </button>
<button (click)="genPostData()"> generate post data </button>
`

@Component({
  selector:'app-component',
  template:template
}) export class AppComponent{
  public webcam
  public base64

  genBase64(){
    this.webcam.getBase64()
    .then( base=>this.base64=base)
    .catch( e=>console.error(e) )
  }

  genPostData(){
    this.webcam.captureAsFormData({fileName:'file.jpg'})
    .then( FormData=>console.log(FormData))
    .catch( e=>console.error(e) )
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

## Credits
- [pre-fork package credits](https://github.com/addyosmani/getUserMedia.js#credits)
- Fork from : [Artur Basak](https://www.npmjs.com/~archik408)
- Forked by : [Acker Apple](https://www.npmjs.com/~ackerapple)

## Spec References
* [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
* [getUserMedia()](https://w3c.github.io/mediacapture-main/getusermedia.html)
* [WebRTC 1.0](http://w3c.github.io/webrtc-pc/)
