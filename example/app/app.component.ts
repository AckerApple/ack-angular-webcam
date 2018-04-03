import { Component, ElementRef } from "@angular/core"
import { WebCamComponent } from "../../src/"
import { isFacingModeSupported } from "../../src/videoHelp"
import * as pack from "../../package.json"
import { string as template } from "./app.template"

@Component({
  selector: 'app-component',
  template:template
}) export class AppComponent {
  isFacingModeSupported = isFacingModeSupported()
  version = pack["version"]
  cameras:any[] = []
  facingModes = ["user","environment","left","right"]
  changeConfig:string
  captured:any = false

  base64:any
  error: any;
  options: any;

  constructor(private element: ElementRef){
    this.addCamera()
  }

  addCamera(){
    this.cameras.push({options:{
      audio: false,
      video: {width:{}, height:{}},
      fallbackSrc: 'fallback/jscam_canvas_only.swf'    
    }})
  }

  onSuccess(stream: any){
    console.log('capturing video stream');
  }

  captureBase64(webcam:WebCamComponent){
    return webcam.getBase64()
    .then(base=>{
      this.captured = new Date()
      this.base64 = base
      setTimeout(()=>webcam.resizeVideo(), 0)
    })
    .catch( e=>console.error(e) )
  }

  getErrorJson(error){
    const keys = Object.getOwnPropertyNames(error)
    const ob = {}
    keys.forEach( key=>ob[key]=error[key] )
    return ob     
  }

  logerror(e:Error){
    console.error(e)
    console.info('debug cameras', this.cameras)
  }
}