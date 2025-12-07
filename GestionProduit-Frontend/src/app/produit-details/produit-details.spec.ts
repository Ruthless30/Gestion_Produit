import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduitDetails } from './produit-details';

describe('ProduitDetails', () => {
  let component: ProduitDetails;
  let fixture: ComponentFixture<ProduitDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProduitDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
