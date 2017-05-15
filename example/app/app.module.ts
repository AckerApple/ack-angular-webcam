import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WebCamComponent } from './ack-angular-webcam/index';
import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule
  ],
  declarations: [
    AppComponent,
    WebCamComponent
  ],
  providers: [],
  bootstrap: [ AppComponent ]
}) export class AppModule {}
