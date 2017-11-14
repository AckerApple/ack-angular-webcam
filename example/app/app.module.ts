import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WebCamModule } from './ack-angular-webcam/index';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    WebCamModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
}) export class AppModule {}
