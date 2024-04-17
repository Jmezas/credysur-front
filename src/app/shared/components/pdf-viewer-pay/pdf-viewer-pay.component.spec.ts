import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfViewerPayComponent } from './pdf-viewer-pay.component';

describe('PdfViewerPayComponent', () => {
  let component: PdfViewerPayComponent;
  let fixture: ComponentFixture<PdfViewerPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfViewerPayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfViewerPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
