package com.example.gestionproduitbackend;

import com.example.gestionproduitbackend.config.UploadConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(UploadConfig.class)
public class GestionProduitBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(GestionProduitBackendApplication.class, args);
    }

}
