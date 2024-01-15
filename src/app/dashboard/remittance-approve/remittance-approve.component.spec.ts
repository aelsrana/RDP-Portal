import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceApproveComponent } from './remittance-approve.component';

describe('RemittanceApproveComponent', () => {
  let component: RemittanceApproveComponent;
  let fixture: ComponentFixture<RemittanceApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemittanceApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemittanceApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
