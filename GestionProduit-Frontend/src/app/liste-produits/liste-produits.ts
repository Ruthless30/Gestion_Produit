import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Produit} from '../models/produit';
import { RouterModule } from '@angular/router';
import { ProduitService } from '../services/produit-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-liste-produits',
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './liste-produits.html',
  styleUrl: './liste-produits.css'
})
export class ListeProduitComponent implements OnInit {

  public constructor(private serviceProduit:ProduitService){}

  ngOnInit(): void {
    this.getAllProduits()

  }

  //empty list to contain the data
  products:Produit[] =[];

  //to retrieve all the db's data
  getAllProduits():void{
    this.serviceProduit.getAllProduits().subscribe(data=>{
      this.products=data;
    })
  }

  //add produit to db
  addProduit(formData: FormData){
    this.serviceProduit.addProduit(formData).subscribe({
      next: (newProduct) => {
        console.log('Product added successfully', newProduct);
        Swal.fire({
          icon: 'success',
          title: 'Ajouté!',
          text: 'Le produit a été ajouté avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
        // Refresh products list
        this.getAllProduits();
      },
      error: (err) => {
        console.error('Error adding product:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: 'Erreur lors de l\'ajout du produit.',
        });
      }
    });
  }

  //delete a product by his id from db
  deleteProduct(id: number) {
    this.serviceProduit.deleteProduit(id).subscribe({
      next: () => {
        console.log('Product deleted successfully');
        this.products = this.products.filter(
          p => Number(p.id) !== Number(id));
      },
      error: (err) => {
        console.error('Error deleting product:', err);
      }
    });

  }

  //update the product values in db
  onUpdateProduct(formdata:FormData){
    this.serviceProduit.updateProduit(formdata).subscribe({
      next: (updatedProduct) => {
        console.log('Product updated successfully', updatedProduct);
        Swal.fire({
          icon: 'success',
          title: 'Mis à jour!',
          text: 'Le produit a été mis à jour avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
        // Refresh your products list
        this.getAllProduits(); // or whatever method you use to reload
      },
      error: (err) => {
        console.error('Error updating product:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur!',
          text: 'Erreur lors de la mise à jour du produit.',
        });
      }
    })
  }

  //Display and hide the images
  state:boolean=true;
  handleClick(state:boolean): void{
    this.state = !state;
  }
  //Search for products
  searchText:string='';
  get filteredData() {
    if (!this.searchText) {
      return this.products;
    }
    return this.products.filter(item =>
      item.nom.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  //Custon confim dialog for delete
  showConfirmDeleteDialog(id: number) {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer ce produit?',
      text: "Cette action est irréversible!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteProduct(id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé!',
          text: 'Le produit a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        })
      }

    });
  }

  //FROM BUILDER FOR BOTH ADD AND UPDATE
  selectedProductId! :number;
  formBuilder(productId?: number) {
    let formTitle = "Add Product";
    let isUpdate = false;

    let product: any = null;

    // --- UPDATE MODE ---
    if (productId) {
      const found = this.products.find(p => p.id === productId);

      if (!found) {
        console.error("Product not found for ID:", productId);
        return;
      }

      isUpdate = true;
      this.selectedProductId = productId;
      formTitle = "Update Product";
      product = found; // now we have the product for update
    }

    let nomProduitInput!: HTMLInputElement;
    let prixProduitInput!: HTMLInputElement;
    let quantiteProduitInput!: HTMLInputElement;
    let imageInput!: HTMLInputElement;

    Swal.fire({
      title: formTitle,
      html: `
      <div class="container-fluid">

        <!-- NOM INPUT -->
        <div class="mb-3">
          <label class="form-label fw-semibold">Product Name</label>
          <input type="text" id="nomProduit" class="form-control"
            value="${isUpdate ? product.nom : ''}"
            placeholder="${isUpdate ? '' : 'Enter product name'}">
        </div>

        <div class="row">

          <!-- PRICE INPUT -->
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold">Price</label>
            <div class="input-group">
              <span class="input-group-text">$</span>
              <input type="number" id="prixProduit" class="form-control"
                value="${isUpdate ? product.prix : ''}"
                placeholder="${isUpdate ? '' : '0.00'}"
                step="0.01" min="0">
            </div>
          </div>

          <!-- QUANTITY INPUT -->
          <div class="col-md-6 mb-3">
            <label class="form-label fw-semibold">Quantity</label>
            <input type="number" id="quantiteProduit" class="form-control"
              value="${isUpdate ? product.quantite : ''}"
              placeholder="${isUpdate ? '' : '1'}"
              min="0">
          </div>

        </div>

        <!-- IMAGE INPUT -->
        <div class="mb-3">
            <label class="form-label fw-semibold">Product Image</label>
            <input type="file" id="imageInput" class="form-control" accept="image/*">
            ${isUpdate
        ? `<div class="form-text">Current: ${product.image_path}</div>`
        : `<div class="form-text">Upload product image</div>`
      }
        </div>

      </div>
    `,
      showCancelButton: true,
      confirmButtonText: isUpdate ? "Update" : "Add",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "btn btn-primary mx-1",
        cancelButton: "btn btn-secondary mx-1"
      },
      buttonsStyling: false,
      width: "600px",

      didOpen: () => {
        const popup = Swal.getPopup()!;
        nomProduitInput = popup.querySelector('#nomProduit')!;
        prixProduitInput = popup.querySelector('#prixProduit')!;
        quantiteProduitInput = popup.querySelector('#quantiteProduit')!;
        imageInput = popup.querySelector('#imageInput')!;
      },

      preConfirm: () => {
        const nom = nomProduitInput.value.trim();
        const prix = prixProduitInput.value;
        const quantite = quantiteProduitInput.value;
        const image = imageInput.files?.[0];

        if (!nom || !prix || !quantite) {
          Swal.showValidationMessage("Please fill all required fields");
          return;
        }

        return {
          nom,
          prix: parseFloat(prix),
          quantite: parseInt(quantite),
          image
        };
      }
    })
      .then((result) => {
        if (!result.isConfirmed || !result.value) return;

        const formData = new FormData();

        if (isUpdate) {
          formData.append("id", this.selectedProductId.toString());
        }

        formData.append("nom", result.value.nom);
        formData.append("prix", result.value.prix.toString());
        formData.append("quantite", result.value.quantite.toString());

        if (result.value.image) {
          formData.append("image", result.value.image);
        }

        // Call the right method
        if (isUpdate) this.onUpdateProduct(formData);
        else this.addProduit(formData);
      });
  }




}

