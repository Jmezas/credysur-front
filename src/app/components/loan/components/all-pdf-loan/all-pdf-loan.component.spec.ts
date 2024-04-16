import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPdfLoanComponent } from './all-pdf-loan.component';

describe('AllPdfLoanComponent', () => {
  let component: AllPdfLoanComponent;
  let fixture: ComponentFixture<AllPdfLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPdfLoanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllPdfLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
