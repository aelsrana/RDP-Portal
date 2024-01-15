import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceDisburseComponent } from './remittance-disburse.component';

describe('RemittanceAllComponent', () => {
  let component: RemittanceDisburseComponent;
  let fixture: ComponentFixture<RemittanceDisburseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemittanceDisburseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemittanceDisburseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
