# ack-angular-webcam
A cross-browser angular2 component, it will use the browser's native `getUserMedia()` implementation, otherwise an optional Flash fallback is available.

### Table of Contents

- [Screenshot](screenshot)
- [Notes](notes)
- [Getting Started](getting-started)
- [Tablet and Phone](tablet-and-phone)
- [Flash Fallback](flash-fallbak)
- [Example and Tests](example-and-tests)
- [Credits](credits)
- [Spec References](#spec-references)

## Screenshot

![Screenshot](https://bytebucket.org/archik/ng2-webcam/raw/0ccfb605f860ba5401b3afe902be251fcf0dd7ab/media/screen.png)

## Notes

This component based on [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)  and [getUserMedia.js Polyfill](https://github.com/addyosmani/getUserMedia.js).

Please, check original repository for clear understanding


## Getting Started

```
npm install ack-angular-webcam --save-dev
```

Use webcam as a pure angular2 component

+ Add component into your module
```javascript
import { WebCamComponent } from 'ack-angular-webcam';
...

@NgModule({
  imports: [
    BrowserModule,
    AppRouting
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
+ Use in html markup
```html
<ack-webcam [options]="options" [onSuccess]="onSuccess" [onError]="onError"></ack-webcam>
```

+ Below is a sample of options structure

```javascript
cont options = {
  audio: false,
  video: true,
  width: 500,
  height: 500
};
const onSuccess = (stream: MediaStream) => {};
const onError = (err) => {};
```

+ You can capture image form webcam using following example
```javascript
...
const video = <any>document.getElementsByTagName('video')[0];
const canvas = <any>document.getElementsByTagName('canvas')[0];
if (video) {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
}
...
```

## Tablet and Phone
On devices you can switch camera modes using following option:

```
cont options = {
  cameraType: 'front' // or 'back'
};
```

Tested for tablet (Android 4.4.2 GT-N5110) and phone (Android 4.1.2 GT-I8268)


## Flash Fallback

First, the flash swf file location must be established.
```javascript
cont options = {
  audio: false,
  video: true,
  fallbackMode: 'callback',
  fallbackSrc: 'assets/js/jscam_canvas_only.swf',
  fallbackQuality: 85
};
```

Action script fallback provides the following API

```javascript
interface FallbackDispatcher {
  capture: Function;
  save: Function;
  setCamera: Function;
  getCameraSize: Function;
  getCameraList: Function;
}
```

For correct communication with this script You have to implement following external callback interface
```
interface EventCallbacks {
  debug: Function;
  onCapture: Function;
  onTick: Function;
  onSave: Function;
}
```

Below is a sample of fallback implementation
```javascript
import { FallbackDispatcher } from 'ack-webcam'

...

cont options = {
  audio: false,
  video: true
};
const onSuccess = (flashplayer: MediaStream | FallbackDispatcher) => {
  if (stream instanceof FallbackDispatcher) {
    this.flashPlayer = <FallbackDispatcher>stream;
    this.onFallback();
  }
};
const onError = (err) => {
  console.log(err);
};

...

/**
 * Implement fallback external interface
 */
onFallback(): void {
  const self = this;
  const canvas = <any>document.getElementsByTagName('canvas')[0];
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const size = self.flashPlayer.getCameraSize();
    const w = size.width;
    const h = size.height;
    const externData = {
      imgData: ctx.getImageData(0, 0, w, h),
      pos: 0
    };

    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    FallbackDispatcher.implementExternal({
      onSave: (data) => {
        try {
          let col = data.split(';');
          let tmp = null;

          for (let i = 0; i < w; i++) {
            tmp = parseInt(col[i], 10);
            externData.imgData.data[externData.pos + 0] = (tmp >> 16) & 0xff;
            externData.imgData.data[externData.pos + 1] = (tmp >> 8) & 0xff;
            externData.imgData.data[externData.pos + 2] = tmp & 0xff;
            externData.imgData.data[externData.pos + 3] = 0xff;
            externData.pos += 4;
          }

          if (externData.pos >= 4 * w * h) {
            ctx.putImageData(externData.imgData, 0, 0);
            externData.pos = 0;
          }
        } catch (e) {
          console.error(e);
        }
      },
      debug: (tag, message) => {
        console.log(tag, message);
      },
      onCapture: () => {
        self.flashPlayer.save();
      },
      onTick: (time) => {
        // do nothing
      }
    });
  }
}
```

Also You can extend options using specific flash fallback params

```javascript
cont options = {
  audio: false,
  video: true,
  width: 320, // by default, need remake .swf for other size
  height: 240, // by default, need remake .swf for other size
  fallbackMode: 'callback',
  fallbackSrc: 'assets/js/jscam_canvas_only.swf', // you can put your fallback swf
  fallbackQuality: 85
};
```

Check this file `lib/fallback/src/jscam.as` for clear understanding

## Example and Tests

You can check example using following npm commands:
```
cd ack-angular-webcam
npm i
npm start
```

For tests:
```
cd ack-angular-webcam
npm i
npm run lint
npm test
npm run e2e

```

![angular2](https://bytebucket.org/archik/ng2-webcam/raw/fa43c0a740dc806ed53022b9fc440aba169ab6e1/media/tech.png)

## Credits
- [pre-fork package credits](https://github.com/addyosmani/getUserMedia.js#credits)
- [Artur Basak](https://www.npmjs.com/~archik408)

## Spec References
* [MediaDevices](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
* [getUserMedia()](https://w3c.github.io/mediacapture-main/getusermedia.html)
* [WebRTC 1.0](http://w3c.github.io/webrtc-pc/)
