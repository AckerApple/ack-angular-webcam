import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core'
import {
  audioInputsByDevices,
  audioOutputsByDevices,
  videoInputsByDevices,
  //MediaDevice,
  browser,
  promiseDevices
} from "./videoHelp"

@Directive({
  selector: 'ack-media-devices'
}) export class AckMediaDevices {
  @Input() array:MediaDeviceInfo[] = []
  @Output() arrayChange:EventEmitter<MediaDeviceInfo[]> = new EventEmitter()

  @Input() error:Error
  @Output() errorChange:EventEmitter<Error> = new EventEmitter()
  @Output('catch') catcher:EventEmitter<Error> = new EventEmitter()

  @Input() videoInputs:MediaDeviceInfo[]
  @Output() videoInputsChange:EventEmitter<MediaDeviceInfo[]> = new EventEmitter()

  @Input() audioInputs:MediaDeviceInfo[]
  @Output() audioInputsChange:EventEmitter<MediaDeviceInfo[]> = new EventEmitter()

  @Input() audioOutputs:MediaDeviceInfo[]
  @Output() audioOutputsChange:EventEmitter<MediaDeviceInfo[]> = new EventEmitter()

  ngOnInit(){
    this.loadDevices()
  }

  loadDevices():Promise<MediaDeviceInfo[]>{
    return promiseDevices()
    .then(devices=>this.onDevices(devices) && devices)
    .catch(e=>{
      this.catcher.emit(e)
      this.errorChange.emit(this.error=e)
      return Promise.reject(e)
    })
  }

  onDevices(devices:MediaDeviceInfo[]):AckMediaDevices{
    this.arrayChange.emit(this.array=devices)
    
    if(this.audioInputsChange.observers.length){
      this.audioInputs = audioInputsByDevices(devices)
      this.audioInputsChange.emit(this.audioInputs)
    }
    
    if(this.audioOutputsChange.observers.length){
      this.audioOutputs = audioOutputsByDevices(devices)
      this.audioOutputsChange.emit(this.audioOutputs)
    }

    if(this.videoInputsChange.observers.length){
      this.videoInputs = videoInputsByDevices(devices)
      this.videoInputsChange.emit(this.videoInputs)
    }

    return this
  }
}