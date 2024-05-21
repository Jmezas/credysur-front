import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayAllComponent } from './pay-all.component';

describe('PayAllComponent', () => {
  let component: PayAllComponent;
  let fixture: ComponentFixture<PayAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayAllComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
