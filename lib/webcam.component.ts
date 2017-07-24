import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as videoHelp from "./videoHelp"

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
  flashPlayer:videoHelp.Fallback
  videoSrc: any
  isSupportUserMedia: boolean = false
  isSupportWebRTC: boolean = false
  isFallback: boolean = false
  browser: any
  observer
  onResize
  stream
  
  @Input() mime = 'image/jpeg'

  @Input() ref
  @Output() refChange = new EventEmitter()
  
  @Input() options: videoHelp.Options;
  @Output() onSuccess = new EventEmitter()
  @Output() onError = new EventEmitter()

  constructor(private sanitizer: DomSanitizer, private element: ElementRef) {
    this.browser = <any>navigator;
  }

  ngOnInit(){
    this.isSupportUserMedia = this.getMedia()!=null ? true : false
    this.isSupportWebRTC = !!(this.browser.mediaDevices && this.browser.mediaDevices.getUserMedia);
  }

  ngAfterViewInit() {
    this.applyDefaults()
    setTimeout(()=>this.afterInitCycles(), 0)
  }

  getMedia(){
    return this.browser.getUserMedia
    || this.browser.webkitGetUserMedia
    || this.browser.mozGetUserMedia
    || this.browser.msGetUserMedia
  }

  afterInitCycles(){
    // getUserMedia() feature detection for older browser
    const media = this.getMedia();

    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if ((this.browser.mediaDevices === undefined) && !!media) {
      this.browser.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if ((this.browser.mediaDevices && this.browser.mediaDevices.getUserMedia === undefined) && !!media) {
      this.browser.mediaDevices.getUserMedia = (constraints) => {
        return new Promise((resolve, reject) => {
          media.call(this.browser, constraints, resolve, reject);
        });
      }
    }
    
    //template ref to class object
    this.ref = Object.assign(this, this.ref, {
      element:this.element,
      options:this.options,
      onSuccess:this.onSuccess,
      onError:this.onError
    })
    setTimeout(()=>this.refChange.emit(this), 0)

    this.createVideoResizer()
    this.startCapturingVideo();
    this.onResize()
  }

  createVideoResizer(){
    this.observer = new MutationObserver( ()=>this.resizeVideo() )
    
    const config = {
      attributes: true,
      childList: true,
      characterData: true,
      // subtree: true
    }
    this.observer.observe(this.element.nativeElement, config);

    this.onResize = function(){this.resizeVideo()}.bind(this)
    window.addEventListener('resize', this.onResize)
  }

  applyDefaults(){
    this.options = this.options || <videoHelp.Options>{}
    this.options.fallbackSrc = this.options.fallbackSrc || 'jscam_canvas_only.swf';
    this.options.fallbackMode = this.options.fallbackMode || 'callback';
    this.options.fallbackQuality = this.options.fallbackQuality || 200;
    this.options.cameraType = this.options.cameraType  || 'front';
    this.isFallback = this.options.fallback || (!this.isSupportUserMedia && !this.isSupportWebRTC && this.options.fallbackSrc) ? true : false

    if(!this.options.video && !this.options.audio){
      this.options.video = true
    }
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
    
    let width = this.options.width || parseInt(this.element.nativeElement.offsetWidth, 10)
    let height = this.options.height || parseInt(this.element.nativeElement.offsetHeight, 10)

    if(!width || !height){
      width = 320
      height = 240
    }

    video.width = width
    video.height = height
  }

  getVideoDimensions(video){
    video = video || this.getVideoElm()
    const dim = {width:0, height:0}

    if(video.videoWidth){
      dim.width = video.videoWidth
      dim.height = video.videoHeight
    }else{
      dim.width = this.options.width || parseInt(this.element.nativeElement.offsetWidth, 10)
      dim.height = this.options.height || parseInt(this.element.nativeElement.offsetHeight, 10)
    }

    if(!dim.width)dim.width = 320
    if(!dim.height)dim.height = 240

    return dim
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
              this.browser.mediaDevices.getUserMedia(optionString)
                .then((stream: any) => resolve(stream))
                .catch((strErr: any) => {
                  console.error(objErr)
                  console.error(strErr)
                  reject(new Error('Both configs failed. Neither object nor string works'))
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
      this.stream = stream
    }).catch((err) => {
      this.onError.emit(err);
    });
  }

  processSuccess(stream?){
    if (this.isFallback) {
      this.setupFallback()
    }else{
      this.onSuccess.emit(stream)
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

  ngOnDestroy(){
    this.observer.disconnect()
    window.removeEventListener('resize', this.onResize)

    const vid = this.getVideoElm()

    if(vid && vid.pause){
      vid.pause()
    }

    if(this.stream){
      this.stream.getTracks()[0].stop();
    }
  }

  getCanvas(){
    return document.createElement('canvas')
  }

  /** returns promise . @mime - null=png . Also accepts image/jpeg */
  getBase64(mime?){
    if(this.isFallback){
      return this.flashPlayer.captureBase64(mime||this.mime)
      //return this.getFallbackBase64(mime)
    }else{
      const canvas = this.getCanvas()
      const video = this.getVideoElm()
      this.setCanvasWidth(canvas, video)
      canvas.getContext('2d').drawImage(video, 0, 0)
      return Promise.resolve( canvas.toDataURL(mime) )
    }
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
    const vidElm = this.getVideoElm()
    vidElm.setAttribute('data', this.options.fallbackSrc)
    
    const params = vidElm.getElementsByTagName('param')
    for(let x=params.length-1; x >= 0; --x){
      if(params[x].getAttribute('name')=='movie'){
        params[x].setAttribute('value', this.options.fallbackSrc)
        break
      }
    }
    
    this.flashPlayer = new videoHelp.Fallback(vidElm)
  }

  /** single image to FormData */
  captureAsFormData(options?:{mime?:string, fileName?:string, form?:FormData}){
    options = options || {}
    return this.getBase64(options.mime)
    .then( base64=>videoHelp.dataUriToFormData(base64, {fileName:options.fileName}) )
  }
}