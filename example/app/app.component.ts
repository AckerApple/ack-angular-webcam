import { Component, ElementRef } from '@angular/core';

const template=`
<!-- devices -->
<table border=0 cellpadding=0 cellspacing=0 width="100%" height="100%" *ngIf="view=='devices'">
  <tr *ngIf="!deviceError">
    <td>
      <textarea style="padding:.5em;font-size:1em;width:100%;height:100%">{{ devices | json }}</textarea>
    </td>
  </tr>
  <tr *ngIf="deviceError">
    <td>
      <textarea style="padding:.5em;font-size:1em;width:100%;height:100%;color:red;">{{ deviceError | json }}</textarea>
    </td>
  </tr>
  <tr>
    <td style="height:60px">
      <ack-media-devices [(array)]="devices" [(error)]="deviceError"></ack-media-devices>
      <button (click)="view=null" style="padding:1em;font-size:1.2em;width:100%">close</button>
    </td>
  </tr>
</table>

<!-- webcam -->
<table border=0 cellpadding=0 cellspacing=0 width="100%" height="100%" *ngIf="!view">
  <tr *ngIf="camError">
    <td colspan="2">
      <textarea style="padding:.5em;font-size:1em;width:100%;height:100%;color:red;">{{ camError | json }}</textarea>
    </td>
  </tr>
  <tr *ngIf="!camError">
    <td valign="top" style="overflow:hidden;width:50%;text-align:center;background-position:center;background-size:contain;background-repeat:no-repeat;" [hidden]="!captured" [style.background-image]="base64?'url('+base64+')':null">
      &nbsp;
    </td>
    <td valign="top" *ngIf="!destroy" [ngStyle]="{width:captured?'50%':'100%'}" [attr.colspan]="base64?null:2">
      <ack-webcam
        [(ref)]   = "webcam"
        [(error)] = "camError"
        [options] = "options"
        (success) = "onSuccess($event)"
        style     = "width:100%;height:100%;display:block;"
      ></ack-webcam>
    </td>
  </tr>
  <tr *ngIf="showBase64" style="height:60px">
    <td colspan="2">
      <input style="width:100%;padding:1em;" [attr.value]="base64" readonly />
    </td>
  </tr>
  <tr *ngIf="captured" style="height:60px">
    <td colspan="2">
      <button (click)="showBase64=!showBase64" style="padding:1em;font-size:1.2em;width:100%;">Show Base64</button>
    </td>
  </tr>
  <tr style="height:60px">
    <td>
      <button *ngIf="webcam" (click)="captureBase64()" style="padding:1em;font-size:1.2em;width:100%">Capture</button>
    </td>
    <td>
      <button (click)="destroy=!destroy" style="padding:1em;font-size:1.2em;width:100%">{{ destroy ? 'Create' : 'Destroy'}}</button>
    </td>
  </tr>
  <tr style="height:60px">
    <td colspan="2">
      <button (click)="view='devices'" style="padding:1em;font-size:1.2em;width:100%">Devices</button>
    </td>
  </tr>
</table>
`

@Component({
  selector: 'app-component',
  template:template
}) export class AppComponent {
  view:string
  captured:any = false
  webcam: any
  
  base64:any
  error: any;
  options: any;

  constructor(private element: ElementRef) {
    this.options = {
      audio: false,
      video: true,
      fallbackSrc: 'fallback/jscam_canvas_only.swf'
    };
    
  }

  onSuccess(stream: any){
    console.log('capturing video stream');
  }

  captureBase64(){
    return this.webcam.getBase64()
    .then(base=>{
      this.captured = new Date()
      this.base64 = base
      setTimeout(()=>this.webcam.resizeVideo(), 0)
    })
    .catch( e=>console.error(e) )
  }
}