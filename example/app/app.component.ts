import { Component, ElementRef } from '@angular/core';
import { WebCamComponent } from './ack-angular-webcam';

const template=`
<!-- devices -->
<table border=0 cellpadding=0 cellspacing=0 width="100%" height="100%" *ngIf="changeConfig">
  <tbody *ngIf="!deviceError">
    <tr>
      <td colspan="2" style="height:40px;">
        <div style="font-weight:bold;font-size:1.3em;">
          {{ devices?.length }} Devices
        </div>
        {{ audioOutputs?.length }} Audio Outputs
      </td>
    </tr>
    <tr style="height:40px;">
      <td valign="bottom">
        {{ videoDevices?.length }} Video Inputs
      </td>
      <td valign="bottom">
        {{ audioDevices?.length }} Audio Inputs
      </td>
    </tr>
    <tr style="height:40px;">
      <td>
        <select style="display:block;width:100%;height:100%" (change)="changeConfig.videoDeviceId=$event.target.value">
          <ng-container *ngFor="let device of videoDevices">
            <option [value]="device.deviceId">{{ device.label || device.kind+'('+index+')' }}</option>
          </ng-container>
        </select>
      </td>
      <td>
        <select style="display:block;width:100%;height:100%">
          <ng-container *ngFor="let device of audioDevices;let index=index">
            <option [value]="device.deviceId">{{ device.label || device.kind+'('+index+')' }}</option>
          </ng-container>
        </select>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <textarea style="padding:.5em;font-size:1em;width:100%;height:100%;min-height:200px;">{{ devices | json }}</textarea>
      </td>
    </tr>
  </tbody>
  <tfoot>
    <tr *ngIf="deviceError">
      <td colspan="2">
        <textarea style="padding:.5em;font-size:1em;width:100%;height:100%;color:red;">{{ deviceError | json }}</textarea>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="height:60px">
        <ack-media-devices
          [(array)]        = "devices"
          [(videoInputs)]  = "videoDevices"
          [(audioInputs)]  = "audioDevices"
          [(audioOutputs)] = "audioOutputs"
          [(error)]        = "deviceError"
        ></ack-media-devices>
        <button (click)="changeConfig=null" style="padding:1em;font-size:1.2em;width:100%">close</button>
      </td>
    </tr>
  </tfoot>
</table>

<!-- capture -->
<table border=0 cellpadding=0 cellspacing=0 width="100%" height="100%" *ngIf="!changeConfig && captured">
  <tr>
    <td colspan="2" valign="top" style="overflow:hidden;width:100%;text-align:center;background-position:center;background-size:contain;background-repeat:no-repeat;" [hidden]="!captured" [style.background-image]="base64?'url('+base64+')':null">
      &nbsp;
    </td>
  </tr>

  <tr *ngIf="showBase64" style="height:60px">
    <td colspan="2">
      <input style="width:100%;padding:1em;" [attr.value]="base64" readonly />
    </td>
  </tr>

  <tr style="height:60px">
    <td>
      <button (click)="showBase64=!showBase64" style="padding:1em;font-size:1.2em;width:100%;">{{ showBase64 ? 'Hide':'Show'}} Base64</button>
    </td>
    <td>
      <button (click)="showBase64=null;captured=null" style="padding:1em;font-size:1.2em;width:100%;">Close</button>
    </td>
  </tr>
</table>

<!-- webcam -->
<table border=0 cellpadding=0 cellspacing=0 width="100%" height="100%" *ngIf="!changeConfig && !captured">
  <ng-container *ngFor="let camConfig of cameras; let index=index">
    <tr *ngIf="cameras[index].error">
      <td colspan="2">
        <textarea style="padding:.5em;font-size:1em;width:100%;height:100%;color:red;">{{ cameras[index].error | json }}</textarea>
      </td>
    </tr>
    <tr *ngIf="!cameras[index].error">
      <td colspan="3" valign="top" *ngIf="!cameras[index].destroy">
        <ack-webcam
          [(ref)]         = "cameras[index].webcam"
          [videoDeviceId] = "cameras[index].videoDeviceId"
          [(error)]       = "cameras[index].error"
          [options]       = "options"
          (success)       = "onSuccess($event)"
          style           = "width:100%;height:100%;display:block;"
        ></ack-webcam>
      </td>
    </tr>
    <tr style="height:60px">
      <td>
        <button *ngIf="cameras[index].webcam" (click)="captureBase64(cameras[index].webcam)" style="padding:1em;font-size:1.2em;width:100%">Capture</button>
      </td>
      <td>
        <button (click)="cameras.splice(index,1)" style="padding:1em;font-size:1.2em;width:100%">Destroy</button>
      </td>
      <td>
        <button (click)="changeConfig=camConfig" style="padding:1em;font-size:1.2em;width:100%">Devices</button>
      </td>
    </tr>
  </ng-container>
  <tr style="height:60px">
    <td colspan="3">
      <button (click)="cameras.push({})" style="padding:1em;font-size:1.2em;width:100%">Add Device</button>
    <td>
  </tr>
</table>
`

@Component({
  selector: 'app-component',
  template:template
}) export class AppComponent {
  cameras:any[] = [{}]
  changeConfig:string
  captured:any = false

  base64:any
  error: any;
  options: any;

  constructor(private element: ElementRef) {
    this.options = {
      audio: false,
      video: true,
      fallbackSrc: 'fallback/jscam_canvas_only.swf'
    }
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
}