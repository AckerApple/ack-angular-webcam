import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as videoHelp from "./videoHelp"

const template = `<video id="video" *ngIf="isSupportWebRTC && videoSrc" autoplay playsinline>Video stream not available</video>`
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
  observer:MutationObserver
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
    //this.onResize = function(){}
  }

  ngOnInit(){
    this.isSupportUserMedia = this.getMedia()!=null ? true : false
    this.isSupportWebRTC = !!(this.browser.mediaDevices && this.browser.mediaDevices.getUserMedia);
  }

  ngAfterViewInit() {
    this.applyDefaults()
    setTimeout(()=>this.afterInitCycles(), 0)
  }

  /*ngOnChanges() {
    this.onResize()
  }*/

  getMedia(){
    return this.browser.getUserMedia
    || this.browser.webkitGetUserMedia
    || this.browser.mozGetUserMedia
    || this.browser.msGetUserMedia
  }

  afterInitCycles(){
    // getUserMedia() feature detection for older browser
    const media = this.getMedia()

    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if ((this.browser.mediaDevices === undefined) && !!media) {
      this.browser.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if ((this.browser.mediaDevices && this.browser.mediaDevices.getUserMedia === undefined) && !!media) {
      this.browser.mediaDevices.getUserMedia = constraints=>{
        return new Promise((resolve, reject)=>{
          const userMedia = media.call(this.browser, constraints, resolve, reject);

          if( userMedia.then ){
            userMedia.then( stream=>this.applyStream(stream) )
          }
        })
      }
    }
    
    //template ref to class object
    /*this.ref = Object.assign(this, this.ref, {
      element:this.element,
      options:this.options,
      onSuccess:this.onSuccess,
      onError:this.onError
    })*/
    setTimeout(()=>this.refChange.emit(this), 0)

    this.createVideoResizer()
    this.startCapturingVideo();
    this.onResize()
  }

  applyStream(stream){
    let webcamUrl = URL.createObjectURL(stream);
    this.videoSrc = this.sanitizer.bypassSecurityTrustResourceUrl(webcamUrl);

    //wait for a cycle to render the html video element
    setTimeout(()=>{
      const videoElm = this.getVideoElm()
      videoElm.src = this.videoSrc
      videoElm.srcObject = stream//Safari      
    }, 0)
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
    const native = this.element.nativeElement
    const elmType = this.isFallback ? 'object' : 'video'
    return native.getElementsByTagName(elmType)[0]
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
              try{
                this.browser.mediaDevices.getUserMedia(optionString)
                  .then((stream: any) => resolve(stream))
                  .catch((strErr: any) => {
                    console.error(objErr)
                    console.error(strErr)
                    reject(new Error('Both configs failed. Neither object nor string works'))
                });
              }catch(e){
                console.error(objErr)
                reject(objErr)
              }
          });
        } catch (e) {
          reject(e);
        }
      });
    };

    promisifyGetUserMedia()
    .then(stream=>{
      this.applyStream(stream)
      this.processSuccess(stream)
      this.stream = stream
    }).catch(err=>{
      this.onError.emit(err)
      return Promise.reject(err)
    })
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

    if( this.stream ){
      this.stream.getTracks().forEach(track=>track.stop())
      //this.stream.getTracks()[0].stop();
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

  /** older browsers (IE11) cannot dynamically apply most attribute changes to object elements. Use this method during fallback */
  createVidElmOb(){
    const rtnElm = document.createElement('object')
    rtnElm.innerHTML = 'Video stream not available'
    rtnElm.setAttribute('type','application/x-shockwave-flash')
    rtnElm.setAttribute('data',this.options.fallbackSrc)

    let paramVar = document.createElement('param')
    paramVar.setAttribute('name','FlashVars')
    paramVar.setAttribute('value','mode=callback&amp;quality=200')
    rtnElm.appendChild( paramVar )

    paramVar = document.createElement('param')
    paramVar.setAttribute('name','allowScriptAccess')
    paramVar.setAttribute('value','always')
    rtnElm.appendChild( paramVar )

    paramVar = document.createElement('param')
    paramVar.setAttribute('name','movie')
    paramVar.setAttribute('value',this.options.fallbackSrc)
    rtnElm.appendChild( paramVar )

    const obs = this.element.nativeElement.getElementsByTagName('object');
    if(obs.length){
      this.element.nativeElement.removeChild( obs[0] )
    }

    this.element.nativeElement.appendChild( rtnElm )

    return rtnElm
  }

  /**
   * Implement fallback external interface
   */
  setupFallback(): void {
    this.isFallback = true
    const vidElm = this.getVideoElm() || this.createVidElmOb()
    this.flashPlayer = new videoHelp.Fallback( vidElm )
  }

  /** single image to FormData */
  captureAsFormData(options?:{mime?:string, fileName?:string, form?:FormData}){
    options = options || {}
    return this.getBase64(options.mime)
    .then( base64=>videoHelp.dataUriToFormData(base64, {fileName:options.fileName}) )
  }

  dataUriToFormData(base64, options){
    return videoHelp.dataUriToFormData(base64, {fileName:options.fileName})
  }

  videoHelp(){
    return videoHelp
  }
}