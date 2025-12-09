package com.example.gestionproduitbackend.service;

import com.example.gestionproduitbackend.config.UploadConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final UploadConfig uploadConfig;

    public String saveImage(MultipartFile file) throws IOException {
        Path uploadDir = Paths.get(uploadConfig.getDirectory());
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = System.currentTimeMillis() + extension;

        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    public void deleteImage(String imagePath) {
        if (imagePath == null || imagePath.isEmpty()) {
            return;
        }

        try {
            Path fileToDelete = Paths.get(uploadConfig.getDirectory(), imagePath);
            Files.deleteIfExists(fileToDelete);
        } catch (IOException e) {
            System.err.println("Error deleting image: " + e.getMessage());
        }
    }

    public byte[] getImageData(String filename) throws IOException {
        Path imagePath = Paths.get(uploadConfig.getDirectory(), filename);
        return Files.readAllBytes(imagePath);
    }

    public String determineContentType(String filename) {
        String extension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream";
        }
    }
}
