import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { WebCamModule } from '../../src/index';
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
