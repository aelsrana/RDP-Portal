import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsrInformationComponent } from './bsr-information.component';

describe('BsrInformationComponent', () => {
    let component: BsrInformationComponent;
    let fixture: ComponentFixture<BsrInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [BsrInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
      fixture = TestBed.createComponent(BsrInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
