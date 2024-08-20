package kz.geoweb.api.controller;

import kz.geoweb.api.dto.LayerCreateDto;
import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.service.LayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/layers")
@RequiredArgsConstructor
public class LayerController {
    private final LayerService layerService;

    @GetMapping("/{id}")
    public LayerDto getLayer(@PathVariable UUID id) {
        return layerService.getLayer(id);
    }

    @GetMapping
    public Page<LayerDto> getLayers(Pageable pageable) {
        return layerService.getLayers(pageable);
    }

    @PostMapping
    public LayerDto createLayer(@RequestBody LayerCreateDto layerCreateDto) {
        return layerService.createLayer(layerCreateDto);
    }

    @PutMapping("/{id}")
    public LayerDto updateLayer(@PathVariable UUID id,
                                @RequestBody LayerDto layerDto) {
        return layerService.updateLayer(id, layerDto);
    }

    @DeleteMapping("/{id}")
    public void deleteLayer(@PathVariable UUID id) {
        layerService.deleteLayer(id);
    }
}
