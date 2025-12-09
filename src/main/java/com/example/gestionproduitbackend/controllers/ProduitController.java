package com.example.gestionproduitbackend.controllers;
import com.example.gestionproduitbackend.entities.Produit;
import com.example.gestionproduitbackend.service.ImageService;
import com.example.gestionproduitbackend.service.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/api/products")
public class ProduitController {

    private final ProduitService produitService;
    private final ImageService imageService;

    @GetMapping("/all")
    public ResponseEntity<List<Produit>> getAllProducts() {
        return ResponseEntity.ok(produitService.getAllProducts());
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(
            @RequestParam("nom") String nom,
            @RequestParam("prix") Double prix,
            @RequestParam("quantite") Integer quantite,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Produit savedProduit = produitService.createProduct(nom, prix, quantite, image);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedProduit);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving product: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProduct(
            @RequestParam("id") Long id,
            @RequestParam("nom") String nom,
            @RequestParam("prix") Double prix,
            @RequestParam("quantite") Integer quantite,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Produit updatedProduit = produitService.updateProduct(id, nom, prix, quantite, image);
            return ResponseEntity.ok(updatedProduit);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating product: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            produitService.deleteProduct(id);
            return ResponseEntity.ok("Product deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting product: " + e.getMessage());
        }
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageData = imageService.getImageData(filename);
            String contentType = imageService.determineContentType(filename);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageData);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}