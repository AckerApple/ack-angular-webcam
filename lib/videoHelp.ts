import { EventEmitter } from "@angular/core"


export const browser = <any>navigator
export function getMedia(){
  return browser.getUserMedia
  || browser.webkitGetUserMedia
  || browser.mozGetUserMedia
  || browser.msGetUserMedia
}

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

export interface VideoObject{
  capture:Function,
  save:Function,
  appendChild:Function
  classid?:string,
  data?:{}
}

export interface Canvas{
  toDataURL:Function,
  getContext:Function,
  width,
  height
}


export function dataUriToBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0){
    byteString = atob(dataURI.split(',')[1]);
  }else{
    byteString = window['unescape'](dataURI.split(',')[1]);
  }

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}

/** single image to transmittable resource */
export function dataUriToFormData(
  dataURI,
  options?:{fileName?:string, form?:FormData}
){
  options = options || {}
  options.form = options.form || new FormData()
  options.form.append('file', dataUriToBlob(dataURI), options.fileName||'file.jpg');
  return options.form
}

export function drawImageArrayToCanvas( imgArray:string[] ):Canvas{
  const canvas = document.createElement('canvas')

  // const di = this.getVideoDimensions()
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

export class Fallback{
  debug:Function
  onCapture:Function
  onSave:Function
  videoObject:VideoObject
  onImage = new EventEmitter()
  
  constructor(videoObject:VideoObject){
    this.videoObject = videoObject
    const dataImgArray = []

    //method intended to live within window memory
    this.debug = (tag, message)=>{
      if(tag=='notify' && message=='Capturing finished.'){
        this.onImage.emit( drawImageArrayToCanvas(dataImgArray) )
      }
    }

    //method intended to live within window memory
    this.onCapture = ()=>{
      dataImgArray.length = 0
      videoObject.save()
    }

    //method intended to live within window memory
    this.onSave = (data) => {
      dataImgArray.push(data)
    }

    //Flash swf file expects window.webcam to exist as communication bridge
    window['webcam'] = this
  }


  captureToCanvas():Promise<Canvas>{
    console.log('333', this.videoObject)
    return new Promise((res,rej)=>{
      const subscription = this.onImage.subscribe(img=>{
        res(img)
        subscription.unsubscribe()
      })
      this.videoObject.capture()
    })
  }

  captureBase64(mime?):Promise<string>{
    return this.captureToCanvas()
    .then( (canvas:Canvas)=>canvas.toDataURL(mime || 'image/jpeg') )
  }

  /**
   * Add <param>'s into fallback object
   * @param cam - Flash web camera instance
   * @returns {void}
   */
  addFallbackParams(options:Options): any {
    const paramFlashVars = document.createElement('param');
    paramFlashVars.name = 'FlashVars';
    paramFlashVars.value = 'mode=' + options.fallbackMode + '&amp;quality=' + options.fallbackQuality;
    this.videoObject.appendChild(paramFlashVars);

    const paramAllowScriptAccess = document.createElement('param');
    paramAllowScriptAccess.name = 'allowScriptAccess';
    paramAllowScriptAccess.value = 'always';
    this.videoObject.appendChild(paramAllowScriptAccess);

    //is this even needed?
    this.videoObject.classid = 'clsid:D27CDB6E-AE6D-11cf-96B8-444553540000';
    
    const paramMovie = document.createElement('param');
    paramMovie.name = 'movie';
    paramMovie.value = options.fallbackSrc;
    this.videoObject.appendChild(paramMovie);
    this.videoObject.data = options.fallbackSrc;
  }
}