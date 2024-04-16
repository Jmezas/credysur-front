import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPayComponent } from './detail-pay.component';

describe('DetailPayComponent', () => {
  let component: DetailPayComponent;
  let fixture: ComponentFixture<DetailPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
