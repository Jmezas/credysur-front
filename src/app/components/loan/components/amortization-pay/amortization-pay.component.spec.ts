import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortizationPayComponent } from './amortization-pay.component';

describe('AmortizationPayComponent', () => {
  let component: AmortizationPayComponent;
  let fixture: ComponentFixture<AmortizationPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmortizationPayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AmortizationPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
