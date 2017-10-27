import { NgModule, Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AckModule } from "../src"

@Component({ selector: 'app', template: 'nothing here'})
export class AppComponent {}

@NgModule({
  imports: [ BrowserModule, AckModule ],
  declarations: [ AppComponent ],
  bootstrap: [AppComponent]
}) export class AppModule {}