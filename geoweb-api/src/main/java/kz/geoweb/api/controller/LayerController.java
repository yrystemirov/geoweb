package kz.geoweb.api.controller;

import jakarta.validation.Valid;
import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.dto.LayerInfoDto;
import kz.geoweb.api.dto.LayerRequestDto;
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
    public Page<LayerInfoDto> getLayers(@RequestParam(required = false) String search,
                                        Pageable pageable) {
        return layerService.getLayers(search, pageable);
    }

    @PostMapping
    public LayerDto createLayer(@RequestBody @Valid LayerRequestDto layerRequestDto) {
        return layerService.createLayer(layerRequestDto);
    }

    @PutMapping("/{id}")
    public LayerDto updateLayer(@PathVariable UUID id,
                                @RequestBody @Valid LayerRequestDto layerRequestDto) {
        return layerService.updateLayer(id, layerRequestDto);
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
