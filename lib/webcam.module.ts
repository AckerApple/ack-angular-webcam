import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WebCamComponent } from './webcam.component';
import { AckMediaDevices } from './AckMediaDevices.directive';

const declarations = [
  WebCamComponent,
  AckMediaDevices
]

@NgModule({
  imports: [ CommonModule ],
  declarations: declarations,
  exports: declarations
}) export class WebCamModule {}