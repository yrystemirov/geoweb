package kz.geoweb.api.controller;

import jakarta.validation.Valid;
import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.service.LayerAttrService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/layer-attrs")
@RequiredArgsConstructor
public class LayerAttrController {
    private final LayerAttrService layerAttrService;

    @GetMapping("/{id}")
    public LayerAttrDto getLayerAttr(@PathVariable UUID id) {
        return layerAttrService.getLayerAttr(id);
    }

    @PostMapping
    public LayerAttrDto createLayerAttr(@RequestBody @Valid LayerAttrDto layerAttrDto) {
        return layerAttrService.createLayerAttr(layerAttrDto);
    }

    @PutMapping("/{id}")
    public LayerAttrDto updateLayerAttr(@PathVariable UUID id, @RequestBody LayerAttrDto layerAttrDto) {
        return layerAttrService.updateLayerAttr(id, layerAttrDto);
    }

    @DeleteMapping("/{id}")
    public void deleteLayerAttr(@PathVariable UUID id) {
        layerAttrService.deleteLayerAttr(id);
    }
}
