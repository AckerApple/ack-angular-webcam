import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';
import { WebCamComponent } from './webcam.component';

let fixture: ComponentFixture<WebCamComponent>;
let comp: WebCamComponent;

//make AoT compatible with ngc
if(!describe){
  var describe = (i?,x?)=>{}
  var beforeEach = (i?)=>{}
  var it = (i?,x?)=>{}
  var expect = (i?)=>{return {toBeTruthy:()=>{}}}
}

describe('WebCamComponent', () => {

  const elementRefStub = {};
  const domSanitizerStub = {
    bypassSecurityTrustResourceUrl: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
          WebCamComponent
        ],
        providers: [
          {provide: ElementRef, useValue: elementRefStub},
          {provide: DomSanitizer, useValue: domSanitizerStub}
        ]
      })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WebCamComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('should create the WebCamComponent', async(() => {
    const step = fixture.debugElement.componentInstance;
    expect(step).toBeTruthy();
  }));
});
