package kz.geoweb.api.controller;

import jakarta.validation.Valid;
import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.service.LayerAttrService;
import kz.geoweb.api.service.LayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/layers")
@RequiredArgsConstructor
public class LayerController {
    private final LayerService layerService;
    private final LayerAttrService layerAttrService;

    @GetMapping("/{id}")
    public LayerDto getLayer(@PathVariable UUID id) {
        return layerService.getLayer(id);
    }

    @GetMapping
    public Page<LayerDto> getLayers(Pageable pageable) {
        return layerService.getLayers(pageable);
    }

    @PostMapping
    public LayerDto createLayer(@RequestBody @Valid LayerDto layerDto) {
        return layerService.createLayer(layerDto);
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

    @GetMapping("/{id}/attrs")
    public Set<LayerAttrDto> getLayerAttrs(@PathVariable UUID id) {
        return layerAttrService.getLayerAttrs(id);
    }
}
