import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceRejectedComponent } from './remittance-rejected.component';

describe('RemittanceRejectedComponent', () => {
  let component: RemittanceRejectedComponent;
  let fixture: ComponentFixture<RemittanceRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemittanceRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemittanceRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
