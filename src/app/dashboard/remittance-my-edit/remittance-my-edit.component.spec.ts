import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceMyEditComponent } from './remittance-my-edit.component';

describe('RemittanceEditComponent', () => {
  let component: RemittanceMyEditComponent;
  let fixture: ComponentFixture<RemittanceMyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemittanceMyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemittanceMyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
