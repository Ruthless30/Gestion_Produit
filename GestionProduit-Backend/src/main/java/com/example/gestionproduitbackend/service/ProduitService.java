package com.example.gestionproduitbackend.service;

import com.example.gestionproduitbackend.entities.Produit;
import com.example.gestionproduitbackend.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final ImageService imageService;

    public List<Produit> getAllProducts() {
        return produitRepository.findAll();
    }

    public Optional<Produit> getProductById(Long id) {
        return produitRepository.findById(id);
    }

    public Produit createProduct(String nom, Double prix, Integer quantite, MultipartFile image) throws IOException {
        Produit produit = new Produit();
        produit.setNom(nom);
        produit.setPrix(prix);
        produit.setQuantite(quantite);

        if (image != null && !image.isEmpty()) {
            String imagePath = imageService.saveImage(image);
            produit.setImage_path(imagePath);
        }

        return produitRepository.save(produit);
    }

    @Transactional
    public Produit updateProduct(Long id, String nom, Double prix, Integer quantite, MultipartFile image) throws IOException {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        produit.setNom(nom);
        produit.setPrix(prix);
        produit.setQuantite(quantite);

        if (image != null && !image.isEmpty()) {
            if (produit.getImage_path() != null) {
                imageService.deleteImage(produit.getImage_path());
            }
            String imagePath = imageService.saveImage(image);
            produit.setImage_path(imagePath);
        }

        return produitRepository.save(produit);
    }

    public void deleteProduct(Long id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        if (produit.getImage_path() != null) {
            imageService.deleteImage(produit.getImage_path());
        }

        produitRepository.deleteById(id);
    }
}
