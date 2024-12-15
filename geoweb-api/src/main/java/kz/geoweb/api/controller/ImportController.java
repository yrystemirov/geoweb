package kz.geoweb.api.controller;

import kz.geoweb.api.enums.LayerFormat;
import kz.geoweb.api.service.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/import")
@RequiredArgsConstructor
public class ImportController {
    private final ImportService importService;

    @PostMapping("/layers")
    public ResponseEntity<?> importLayersFile(@RequestParam MultipartFile file,
                                              @RequestParam LayerFormat layerFormat,
                                              @RequestParam(required = false) UUID folderId) {
        importService.importLayersFile(file, layerFormat, folderId);
        return ResponseEntity.ok().build();
    }
}
