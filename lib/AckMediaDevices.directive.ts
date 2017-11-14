import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core'
import { browser } from "./videoHelp"

export interface device{
  deviceId: string
  kind: "videoinput" | "audioinput" | string
  label: string
  groupId: string
}

@Directive({
  selector: 'ack-media-devices'
}) export class AckMediaDevices {
  @Input() array:device[] = []
  @Output() arrayChange:EventEmitter<device[]> = new EventEmitter()

  @Input() error:Error
  @Output() errorChange:EventEmitter<Error> = new EventEmitter()
  @Output('catch') catcher:EventEmitter<Error> = new EventEmitter()

  ngOnInit(){
    this.loadDevices()
  }

  loadDevices():Promise<device[]>{
    return browser.mediaDevices.enumerateDevices()
    .then( devices=>this.arrayChange.emit(this.array=devices) )
    .catch(e=>{
      this.catcher.emit(e)
      this.errorChange.emit(this.error=e)
      return Promise.reject(e)
    })
  }
}