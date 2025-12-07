import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit';

  @Injectable({
    providedIn: 'root'
  })
  export class ProduitService {

    URL="http://localhost:8080/api/products"

    public constructor(private http:HttpClient){}

    public getAllProduits():Observable<Produit[]>{
      return this.http.get<Produit[]>(this.URL+"/all")
    }

    public addProduit(formData: FormData): Observable<Produit> {
      return this.http.post<Produit>(this.URL + "/add", formData);
    }
    public deleteProduit(produitId: number) {
      return this.http.delete(this.URL + "/delete/" + produitId, {
        responseType: 'text'
      });}

    public updateProduit(formData: FormData):Observable<Produit>{
      return this.http.put<Produit>(this.URL+"/update",formData)
    }

  }
