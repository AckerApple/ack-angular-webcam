import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WebCamComponent } from '../../src/index';

describe('App Component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        WebCamComponent
      ],
      imports: []
    })
      .compileComponents();
  }));

  it('should create the root component', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
