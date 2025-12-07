import { Component , OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import {Produit} from '../models/produit';
import {ListeProduitComponent} from '../liste-produits/liste-produits';
import {ProduitService} from '../services/produit-service';

@Component({
  selector: 'app-produit-details',
  standalone:true,
  imports: [CommonModule,RouterLink],
  templateUrl: './produit-details.html',
  styleUrl: './produit-details.css'
})
export class ProduitDetails {
  productId: number | null = null;
  productNom: string | null = null;
  productPrix: number | null = null;
  productQuantite: number | null = null;
  products: Produit[] = [];

  constructor(private route: ActivatedRoute, public serviceProduit: ProduitService) {}

  ngOnInit(): void {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.productId = idFromRoute ? Number(idFromRoute) : null;

    if (!this.productId) {
      console.error("No valid product ID found in the route.");
      return;
    }

    this.serviceProduit.getAllProduits().subscribe(data => {

      this.products = data;

      const product = this.products.find(p => p.id === this.productId);

      if (!product) {
        console.error("Product not found with id:", this.productId);
        return;
      }

      this.productNom = product.nom;
      this.productPrix = product.prix;
      this.productQuantite = product.quantite;

    });
  }
}

