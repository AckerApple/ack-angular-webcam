import { Component, ElementRef } from '@angular/core';

const template=`
<table border=0 cellpadding=0 cellspacing=0 width="100%" height="100%">
  <tr>
    <td style="overflow:hidden;width:50%;text-align:center;background-position:center;background-size:contain;background-repeat:no-repeat;" [hidden]="!captured" [style.background-image]="base64?'url('+base64+')':null">
      &nbsp;
    </td>
    <td [ngStyle]="{width:captured?'50%':'100%'}">
      <ack-webcam [(ref)]="webcam" [options]="options" [onSuccess]="onSuccess" [onError]="onError" style="width:100%;height:100%;display:block;"></ack-webcam>
    </td>
  </tr>
  <tr *ngIf="showBase64" style="height:60px">
    <td colspan="2">
      <input style="width:100%;padding:1em;" [attr.value]="base64" readonly />
    </td>
  </tr>
  <tr style="height:60px">
    <td [hidden]="!captured">
      <button (click)="showBase64=!showBase64" style="padding:1em;font-size:1.2em;width:100%;">Show Base64</button>
    </td>
    <td>
      <button (click)="captureBase64()" style="padding:1em;font-size:1.2em;width:100%">Capture</button>
    </td>
  </tr>
</table>
`

@Component({
  selector: 'app-component',
  template:template
}) export class AppComponent {
  public captured:any = false
  public webcam: any
  base64:any
  error: any;
  options: any;
  onSuccess: Function;
  onError: Function;

  constructor(private element: ElementRef) {
    this.options = {
      audio: false,
      video: true,
      //fallback: true,//force flash
      //width: 320,
      //height: 240,
      //fallbackQuality: 200,
      fallbackSrc: 'jscam_canvas_only.swf'
    };
    
    this.onSuccess = (stream: any) => {
      console.log('capturing video stream');
    };
    
    this.onError = (err) => {
      console.log(err);
    };
  }

  captureBase64(){
    return this.webcam.getBase64()
    .then(base=>{
      this.captured = new Date()
      this.base64 = base
      setTimeout(()=>this.webcam.resizeVideo(), 0)
    })
    .catch( e=>console.error(e) )
//    setTimeout(()=>this.webcam.onResize(), 0)
  }
}