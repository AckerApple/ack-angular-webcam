//import * as a from './audioTest'

import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import {
  browser,
  getMedia,
  Options,
  dataUriToFormData,
  videoInputsByDevices,
  Fallback,
  //MediaDevice,
  promiseDevices,
  promiseDeviceById
} from "./videoHelp"

const template = `<video id="video" *ngIf="(isSupportUserMedia||isSupportWebRTC)" autoplay="" playsinline="">Video stream not available</video>`

export interface vidElmOptions{
  audio: boolean | MediaTrackConstraints
  video: boolean | MediaTrackConstraints
}

export interface elementSets{
  width:number
  height:number
}

export interface sets{
  element:elementSets
}

@Component({
  selector: 'ack-webcam',
  template: template
}) export class WebCamComponent {
  /* platform support variables */
    flashPlayer:Fallback
    isSupportUserMedia: boolean
    isSupportWebRTC: boolean
    isFallback: boolean
  /* end: platform support variables */
  
  initComplete:boolean
  observer:MutationObserver
  onResize:()=>any
  stream:MediaStream

  sets:sets = {element:{width:0,height:0}}

  @Input() videoDevice:MediaDeviceInfo
  @Input() videoDeviceId:string
  //@Input() audioDeviceId:string
  
  @Input() reflect:boolean//mirror camera image
  @Input() facingMode:"user"|"environment"|"left"|"right"|string
  @Input() mime = 'image/jpeg'
  @Input() useParentWidthHeight:boolean = false
  
  @Input() options: Options
  @Output() success:EventEmitter<MediaStream> = new EventEmitter()

  //-Lazy @ViewChild() variable reference
  //@Input() ref:WebCamComponent
  //@Output() refChange:EventEmitter<WebCamComponent> = new EventEmitter()
  
  @Input() error:Error
  @Output() errorChange:EventEmitter<Error> = new EventEmitter()
  @Output('catch') catcher:EventEmitter<Error> = new EventEmitter()

  constructor(
    private sanitizer: DomSanitizer,
    private element: ElementRef){
    console.log("123")
  }

  ngOnInit(){
    this.isSupportUserMedia = getMedia()!=null ? true : false
    this.isSupportUserMedia = false
    this.isSupportWebRTC = !!(browser.mediaDevices && browser.mediaDevices.getUserMedia)
  }

  ngAfterViewInit(){
    this.applyDefaults()
    setTimeout(()=>this.afterInitCycles(), 0)
  }

  ngOnChanges( changes ) {
    if( !this.initComplete )return

    if(
      changes.facingMode
    || changes.videoDevice
    || changes.videoDeviceId
    ){
      this.redraw()//restart
    }

    if( changes.reflect ){
      this.applyReflect()
    }
  }

  ngOnDestroy(){
    this.observer.disconnect()
    window.removeEventListener('resize', this.onResize)
    this.stop()
  }

  play(){
    return this.redraw()
  }

  stop(){
    const vid = this.getVideoElm()
    if(vid && vid.pause){
      vid.pause()
    }

    if( this.stream ){
      this.stream.getTracks().forEach(track=>track.stop())
    }
  }

  redraw(){
    this.stop()
    this.startCapturingVideo()
  }

  afterInitCycles(){
    const media = getMedia()

    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if ((browser.mediaDevices === undefined) && !!media) {
      browser.mediaDevices = {}
    }

    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    const getUserMediaUndefined = (browser.mediaDevices && browser.mediaDevices.getUserMedia === undefined) && !!media
    if( getUserMediaUndefined ){
      browser.mediaDevices.getUserMedia = constraints=>{
        return new Promise((resolve, reject)=>{
          const userMedia = media.call(browser, constraints, resolve, reject)

          if( userMedia.then ){
            userMedia.then( stream=>this.applyStream(stream) )
          }
        })
        .catch( err=>this.catchError(err) )
      }
    }

    this.initComplete = true
    
    //deprecated. Use angular hash template referencing and @ViewChild
    //setTimeout(()=>this.refChange.emit(this), 0)

    this.createVideoResizer()
    
    this.startCapturingVideo()
    .then( ()=>setTimeout(()=>this.resize(), 10) )
    .catch( err=>this.catchError(err) )
  }

  applyReflect(){
    const videoElm = this.getVideoElm()

    if(!videoElm)return

    if( this.reflect ){
      videoElm.style.transform = "scaleX(-1)"
    }else{
      videoElm.style.transform = "scaleX(1)"
    }
  }

  applyStream( stream:MediaStream ){
    const videoElm = this.getVideoElm()
    videoElm.srcObject = stream
    this.applyReflect()
  }

  createVideoResizer(){
    this.observer = new MutationObserver( ()=>this.resize() )
    
    const config = {
      attributes: true,
      childList: true,
      characterData: true
      //,subtree: true
    }
    this.observer.observe(this.element.nativeElement, config)

    this.onResize = ()=>this.resize()
    window.addEventListener('resize', this.onResize)
  }

  applyDefaults(){
    this.options = this.options || <Options>{}
    this.options.fallbackSrc = this.options.fallbackSrc || 'jscam_canvas_only.swf'
    this.options.fallbackMode = this.options.fallbackMode || 'callback'
    this.options.fallbackQuality = this.options.fallbackQuality || 200
    this.isFallback = this.options.fallback || (!this.isSupportUserMedia && !this.isSupportWebRTC && this.options.fallbackSrc) ? true : false

    if(!this.options.video && !this.options.audio){
      this.options.video = true
    }
  }

  onWebRTC(): Promise<MediaStream> {
    let promise:Promise<MediaDeviceInfo> = Promise.resolve(null)

    return this.promiseVideoOptions()
    .then( options=>{
      this.options.video = options
      return this.setWebcam(this.options)
    })
  }

  promiseVideoOptions():Promise<MediaTrackConstraints>{
    let promise = Promise.resolve()

    const videoOptions:MediaTrackConstraints = {}
    
    if( this.options.video && isOb(this.options.video) ){
      Object.assign(videoOptions, this.options.video)

      /* attempt to prevent bad videoOptions */
        if( videoOptions.width && isOb(videoOptions.width) && !Object.keys(videoOptions.width).length ){
          delete videoOptions.width
        }

        if( videoOptions.height && isOb(videoOptions.height) && !Object.keys(videoOptions.height).length ){
          delete videoOptions.height
        }
      /* end: fix vid options */
    }

    if( this.facingMode ){
      videoOptions.facingMode = this.facingMode//{exact:this.facingMode}
    }

    if( this.videoDeviceId ){
      //videoOptions.deviceId = {exact:this.videoDeviceId}
      videoOptions.deviceId = this.videoDeviceId
    }else if( this.videoDevice ){
      //videoOptions.deviceId = {exact:this.videoDevice.deviceId}
      videoOptions.deviceId = this.videoDevice.deviceId
    }

    return promise.then( ()=>videoOptions )
  }

  //old method name (deprecated)
  resizeVideo(maxAttempts=4){
    return this.resize(maxAttempts)
  }

  resize(maxAttempts=4){
    const video = this.getVideoElm()
    
    if(!video)return

    video.style.position='absolute'
    
    const elm = this.useParentWidthHeight ? this.element.nativeElement.parentNode : this.element.nativeElement

    let width = this.options.width || parseInt(elm.offsetWidth, 10)
    let height = this.options.height || parseInt(elm.offsetHeight, 10)

    if(!width || !height){
      width = 320
      height = 240
    }

    setTimeout(()=>{
      video.width = width
      video.height = height
      
      this.sets.element.width = width
      this.sets.element.height = height
      
      video.style.position='static'
  
      //now that we set a width and height, it may need another adjustment if it pushed percent based items around
      const resizeAgain = (!this.options.width && width!=parseInt(elm.offsetWidth, 10)) || (!this.options.height && height!=parseInt(elm.offsetHeight, 10))
  
      if( resizeAgain && maxAttempts){
        this.resize( --maxAttempts )
      }
    }, 1)
  }

  getVideoDimensions(video){
    video = video || this.getVideoElm()
    const dim = {width:0, height:0}

    if( video.videoWidth ){
      dim.width = video.videoWidth
      dim.height = video.videoHeight
    }else{
      dim.width = this.options.width || parseInt(this.element.nativeElement.offsetWidth, 10)
      dim.height = this.options.height || parseInt(this.element.nativeElement.offsetHeight, 10)
    }

    if( !dim.width )dim.width = 320
    if( !dim.height )dim.height = 240

    return dim
  }

  getVideoElm(){
    const native = this.element.nativeElement
    const elmType = this.isFallback ? 'object' : 'video'
    return native.getElementsByTagName(elmType)[0]
  }

  setWebcam(options:Options): Promise<MediaStream> {
    return this.promiseStreamByVidOptions(options)
    .then(stream=>{
      this.applyStream(stream)
      this.processSuccess(stream)
      this.stream = stream
      return stream
    })
    .catch( err=>this.catchError(err) )
  }

  catchError(err:Error):Promise<any>{
    this.errorChange.emit(this.error=err)
    this.catcher.emit(err)

    if( !this.errorChange.observers.length && !this.catcher.observers.length ){
      return Promise.reject(err)//if no error subscriptions promise need to continue to be Uncaught
    }
  }

  promiseStreamByVidOptions(
    optionObject:vidElmOptions
  ):Promise<MediaStream>{
    return new Promise((resolve, reject) => {
      try {
        browser.mediaDevices.getUserMedia(optionObject)
        .then(stream=>resolve(stream))
        .catch((objErr:any)=>reject(objErr))
      } catch (e) {
        reject(e)
      }
    })
  }

  processSuccess(stream?){
    if (this.isFallback) {
      this.setupFallback()
    }else{
      this.success.emit(stream)
    }
  }

  /**
   * Start capturing video stream
   * @returns {void}
   */
  startCapturingVideo(): Promise<any> {
    if (!this.isFallback && this.isSupportWebRTC) {
      return this.onWebRTC()
    }

    return Promise.resolve( this.processSuccess() )
  }

  getCanvas(){
    const canvas = document.createElement('canvas')
    const video = this.getVideoElm()
    this.setCanvasWidth(canvas, video)
    const ctx = canvas.getContext('2d')

    if( this.reflect ){
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0)
    return canvas
  }

  getBlob():Promise<Blob>{
    return new Promise((res,rej)=>{
      const canvas = this.getCanvas()
      canvas.toBlob(file=>{
        res(file)
      }, this.mime, 1)
    })
  }

  getFile( fileName:string ):Promise<File>{
    return this.getBlob().then(file=>blobToFile(file,fileName))
  }

  /** returns promise . @mime - null=png . Also accepts image/jpeg */
  getBase64(mime?):Promise<string>{
    if(this.isFallback){
      return this.flashPlayer.captureBase64(mime||this.mime)
      //return this.getFallbackBase64(mime)
    }else{
      const canvas = this.getCanvas()
      return Promise.resolve( canvas.toDataURL(mime) )
    }
  }

  setCanvasWidth(canvas, video){
    const di = this.getVideoDimensions(video)
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

    const obs = this.element.nativeElement.getElementsByTagName('object')
    if(obs.length){
      this.element.nativeElement.removeChild( obs[0] )
    }

    this.element.nativeElement.appendChild( rtnElm )

    return rtnElm
  }

  setupFallback(): void {
    this.isFallback = true
    const vidElm = this.getVideoElm() || this.createVidElmOb()
    this.flashPlayer = new Fallback( vidElm )
  }

  /** single image to FormData */
  captureAsFormData(options?:{mime?:string, fileName?:string, form?:FormData}){
    options = options || {}
    return this.getBase64(options.mime)
    .then( base64=>dataUriToFormData(base64, {fileName:options.fileName}) )
  }

  dataUriToFormData(base64, options){
    return dataUriToFormData(base64, {fileName:options.fileName})
  }
}


function isOb(v){
  return typeof(v)==='object'
}

function blobToFile(
  theBlob: Blob, fileName:string
 ):File{
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
}
