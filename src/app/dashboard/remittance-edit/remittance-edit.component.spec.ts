import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceEditComponent } from './remittance-edit.component';

describe('RemittanceEditComponent', () => {
  let component: RemittanceEditComponent;
  let fixture: ComponentFixture<RemittanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemittanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemittanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
