import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceMyApproveComponent } from './remittance-my-approve.component';

describe('RemittanceApproveComponent', () => {
  let component: RemittanceMyApproveComponent;
  let fixture: ComponentFixture<RemittanceMyApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemittanceMyApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemittanceMyApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
