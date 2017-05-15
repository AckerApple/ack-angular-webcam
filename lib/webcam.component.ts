import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

const template = `
<video id="video" *ngIf="isSupportWebRTC && videoSrc" [src]="videoSrc" autoplay>Video stream not available</video>

<object *ngIf="isFallback" data="jscam_canvas_only.swf">
  Video stream not available
  <param name="FlashVars" value="mode=callback&amp;quality=200">
  <param name="allowScriptAccess" value="always">
  <param name="movie" value="jscam_canvas_only.swf">
</object>
`

/**
 * Component options structure interface
 */
export interface Options {
  video: boolean | any;
  cameraType: string;
  audio: boolean;
  width: number;
  height: number;
  fallback:boolean;
  fallbackSrc: string;
  fallbackMode: string;
  fallbackQuality: number;
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices
 */
export interface MediaDevice {
  deviceId: string;
  kind: string;
  label: string;
}

/**
 * Render WebCam Component
 */
@Component({
  selector: 'ack-webcam',
  template: template
}) export class WebCamComponent {
  public flashPlayer
  public videoSrc: any;
  public isSupportWebRTC: boolean;
  public isFallback: boolean;
  public browser: any;
  public observer
  public onResize

  @Input() ref
  @Output() refChange = new EventEmitter()
  
  @Input() options: Options;
  @Input() onSuccess: Function;
  @Input() onError: Function;

  constructor(private sanitizer: DomSanitizer, private element: ElementRef) {
    this.isFallback = false;
    this.isSupportWebRTC = false;
    this.browser = <any>navigator;
  }

  ngAfterViewInit() {
    // getUserMedia() feature detection for older browser
    this.browser.getUserMedia_ = (this.browser.getUserMedia
    || this.browser.webkitGetUserMedia
    || this.browser.mozGetUserMedia
    || this.browser.msGetUserMedia);

    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if ((this.browser.mediaDevices === undefined) && !!this.browser.getUserMedia_) {
      this.browser.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if ((this.browser.mediaDevices && this.browser.mediaDevices.getUserMedia === undefined) && !!this.browser.getUserMedia_) {
      this.browser.mediaDevices.getUserMedia = (constraints) => {
        return new Promise((resolve, reject) => {
          this.browser.getUserMedia_.call(this.browser, constraints, resolve, reject);
        });
      }
    }
    
    this.isSupportWebRTC = !!(this.browser.mediaDevices && this.browser.mediaDevices.getUserMedia);
    this.applyDefaults()

    this.ref = Object.assign(this,this.ref)
    setTimeout(()=>this.refChange.emit(this), 0)

    this.observer = new MutationObserver( ()=>this.resizeVideo() )
    
    const config = {
      attributes: true,
      childList: true,
      characterData: true,
      //subtree: true
    }
    this.observer.observe(this.element.nativeElement, config);

    this.onResize = function(){this.resizeVideo()}.bind(this)

    window.addEventListener('resize', this.onResize)

    this.startCapturingVideo();

    setTimeout(()=>this.onResize(), 0)
  }

  applyDefaults(){
    // default options
    this.options.fallbackSrc = this.options.fallbackSrc || 'jscam_canvas_only.swf';
    this.options.fallbackMode = this.options.fallbackMode || 'callback';
    this.options.fallbackQuality = this.options.fallbackQuality || 200;
    //this.options.width = this.options.width || 320;
    //this.options.height = this.options.height || 240;
    this.options.cameraType = this.options.cameraType  || 'front';
    // flash fallback detection
    this.isFallback = this.options.fallback || (!this.isSupportWebRTC && !!this.options.fallbackSrc)
  }

  /**
   * Switch to facing mode and setup web camera
   * @returns {void}
   */
  onWebRTC(): any {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
    if (this.browser.mediaDevices.enumerateDevices && this.options.video) {
      const cameraType = this.options.cameraType;
      this.browser.mediaDevices.enumerateDevices().then((devices) => {
        devices.forEach((device: MediaDevice) => {
          if (device && device.kind === 'videoinput') {
            if (device.label.toLowerCase().search(cameraType) > -1) {
              this.options.video = {deviceId: {exact: device.deviceId}, facingMode: 'environment'};
            }
          }
        });
        this.setWebcam();
      });
    }
    else {
      this.setWebcam();
    }
  }

  resizeVideo(){
    const video = this.getVideoElm();
    
    if(!video)return

    video.width = 0;
    video.height = 0;
    
    video.width = this.options.width || parseInt(this.element.nativeElement.offsetWidth, 10)
    video.height = this.options.height || parseInt(this.element.nativeElement.offsetHeight, 10)
  }

  getVideoDimensions(video){
    video = video || this.getVideoElm()

    if(video.videoWidth){
      return {
        width:video.videoWidth,
        height:video.videoHeight
      }
    }

    return {
      width:this.options.width || parseInt(this.element.nativeElement.offsetWidth, 10),
      height:this.options.height || parseInt(this.element.nativeElement.offsetHeight, 10)
    }
  }

  getVideoElm(){
    const elmType = this.isFallback ? 'object' : 'video'
    return this.element.nativeElement.getElementsByTagName(elmType)[0]
  }

  /**
   * Setup web camera using native browser API
   * @returns {void}
   */
  setWebcam(): any {
    // constructing a getUserMedia config-object and
    // an string (we will try both)
    let optionObject = { audio: false, video: false };
    let optionString = '';

    if (this.options.video) {
      optionObject.video = this.options.video;
      optionString = 'video';
    }

    if (this.options.audio === true) {
      optionObject.audio = true;
      if (optionString !== '') {
        optionString = optionString + ', ';
      }
      optionString = optionString + 'audio';
    }

    // Promisify async callback's for angular2 change detection
    const promisifyGetUserMedia = () => {
      return new Promise<string>((resolve, reject) => {
        // first we try if getUserMedia supports the config object
        try {
          // try object
          this.browser.mediaDevices.getUserMedia(optionObject)
            .then((stream: any) => resolve(stream))
            .catch((objErr: any) => {
              // option object fails
              // try string syntax
              // if the config object failes, we try a config string
              this.browser.mediaDevices.getUserMedia(optionObject)
                .then((stream: any) => resolve(stream))
                .catch((strErr: any) => {

                  console.error(objErr);
                  console.error(strErr);

                  reject(new Error('Both configs failed. Neither object nor string works'));
              });
          });
        } catch (e) {
          reject(e);
        }
      });
    };

    promisifyGetUserMedia().then((stream) => {
      let webcamUrl = URL.createObjectURL(stream);
      this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(webcamUrl);
      this.processSuccess(stream)
    }).catch((err) => {
      this.onError(err);
    });
  }

  processSuccess(stream?){
    if (this.isFallback) {
      this.setupFallback()
    }else{
      this.onSuccess(stream)
    }
  }

  /**
   * Add <param>'s into fallback object
   * @param cam - Flash web camera instance
   * @returns {void}
   */
  addFallbackParams(cam: any): any {
    const paramFlashVars = document.createElement('param');
    paramFlashVars.name = 'FlashVars';
    paramFlashVars.value = 'mode=' + this.options.fallbackMode + '&amp;quality=' + this.options.fallbackQuality;
    cam.appendChild(paramFlashVars);

    const paramAllowScriptAccess = document.createElement('param');
    paramAllowScriptAccess.name = 'allowScriptAccess';
    paramAllowScriptAccess.value = 'always';
    cam.appendChild(paramAllowScriptAccess);

    // if (this.browser.appVersion.indexOf('MSIE') > -1) {
    // if (isIE) {
    cam.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
    const paramMovie = document.createElement('param');
    paramMovie.name = 'movie';
    paramMovie.value = this.options.fallbackSrc;
    cam.appendChild(paramMovie);
    // } else {
    cam.data = this.options.fallbackSrc;
    // }
  }

  /**
   * On web camera using flash fallback
   * .swf file is necessary
   * @returns {void}
   */
  onFallback(): any {
    // Act as a plain getUserMedia shield if no fallback is required
    if (this.options) {
      // Fallback to flash
      const self = this;
      const cam = this.getVideoElm();
      cam.width = self.options.width;
      cam.height = self.options.height;

      this.addFallbackParams(cam);

      (function register(run) {
        if (cam.capture !== undefined) {
          self.onSuccess(cam);
        } else if (run === 0) {
          self.onError(new Error('Flash movie not yet registered!'));
        } else {
          // Flash interface not ready yet
          window.setTimeout(register, 1000 * (4 - run), run - 1);
        }
      }(3));
    }
    else {
      console.error('WebCam options is require');
    }
  }

  /**
   * Start capturing video stream
   * @returns {void}
   */
  startCapturingVideo(): any {
    if (!this.isFallback && this.isSupportWebRTC) {
      return this.onWebRTC();
    }

    return this.processSuccess()
  }

  drawImageArrayToCanvas(imgArray){
    const canvas = this.getCanvas();
    //const di = this.getVideoDimensions()
    const ctx = canvas.getContext('2d');
    const width = imgArray[0].split(';').length
    const height = imgArray.length
    canvas.width = width
    canvas.height = height
    ctx.clearRect(0, 0, width, height);

    const externData = {
      imgData: ctx.getImageData(0, 0, width, height),
      pos: 0
    };

    let tmp = null;
    for(let x=0; x < imgArray.length; ++x){
      let col = imgArray[x].split(';')
      for (let i = 0; i < width; i++) {
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

    return canvas
  }
  ngOnDestroy(){
    this.observer.disconnect()
    window.removeEventListener(this.onResize)
  }

  getCanvas(){
    return document.createElement('canvas')
  }

  /** returns promise . @mime - null=png . Also accepts image/jpeg */
  getBase64(mime?){
    if(this.isFallback){
      return this.getFallbackBase64(mime)
    }else{
      const canvas = this.getCanvas()
      const video = this.getVideoElm()
      this.setCanvasWidth(canvas, video)
      canvas.getContext('2d').drawImage(video, 0, 0)
      return Promise.resolve( canvas.toDataURL(mime) )
    }
  }

  getFallbackBase64(mime){
    return new Promise((res,rej)=>{
      this.flashPlayer.onImage = img=>{
        res(img)
      }
      this.getVideoElm().capture()
    })
    .then( canvas=>canvas['toDataURL'](mime) )
  }

  setCanvasWidth(canvas?, video?){
    const di = this.getVideoDimensions(video)
    canvas = canvas || this.getCanvas()
    canvas.width = di.width
    canvas.height = di.height
  }

  /**
   * Implement fallback external interface
   */
  setupFallback(): void {
    this.isFallback = true
    let dataImgArray = []

    this.flashPlayer = window['webcam'] = {
      onImage:()=>{},
      debug: function(tag, message){
        if(tag=='notify' && message=='Capturing finished.'){
          this.flashPlayer.onImage( this.drawImageArrayToCanvas(dataImgArray) )
        }
      }.bind(this),
      onCapture: function(){
        dataImgArray.length = 0
        this.getVideoElm().save();
      }.bind(this),
      onTick: (time) => {},
      onSave: (data) => {
        dataImgArray.push(data)
      }
    }
  }
}