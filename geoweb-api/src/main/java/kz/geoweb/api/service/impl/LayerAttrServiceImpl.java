package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.entity.LayerAttr;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.exception.ForbiddenException;
import kz.geoweb.api.mapper.LayerAttrMapper;
import kz.geoweb.api.repository.LayerAttrRepository;
import kz.geoweb.api.repository.LayerRepository;
import kz.geoweb.api.service.EntityUpdateHistoryService;
import kz.geoweb.api.service.GeoserverService;
import kz.geoweb.api.service.JdbcService;
import kz.geoweb.api.service.LayerAttrService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LayerAttrServiceImpl implements LayerAttrService {
    private final LayerAttrRepository layerAttrRepository;
    private final LayerRepository layerRepository;
    private final LayerAttrMapper layerAttrMapper;
    private final JdbcService jdbcService;
    private final GeoserverService geoserverService;
    private final EntityUpdateHistoryService historyService;

    private LayerAttr getEntityById(UUID id) {
        return layerAttrRepository.findById(id)
                .orElseThrow(() -> new CustomException("layer_attr.by_id.not_found", id.toString()));
    }

    private Layer getLayerEntityById(UUID id) {
        return layerRepository.findById(id)
                .orElseThrow(() -> new CustomException("layer.by_id.not_found", id.toString()));
    }

    @Override
    public LayerAttrDto getLayerAttr(UUID id) {
        return layerAttrMapper.toDto(getEntityById(id));
    }

    @Override
    public Set<LayerAttrDto> getLayerAttrs(UUID layerId) {
        return layerAttrMapper.toDto(layerAttrRepository.findByLayerIdOrderByRank(layerId));
    }

    @Override
    public Set<LayerAttrDto> getLayerAttrsPublic(UUID layerId) {
        Layer layer = getLayerEntityById(layerId);
        if (!layer.getIsPublic()) {
            throw new ForbiddenException("layer.is_not_public", layer.getLayername());
        }
        return getLayerAttrs(layerId);
    }

    @Override
    public LayerAttrDto createLayerAttr(LayerAttrDto layerAttrDto) {
        layerAttrDto.setId(null);
        String attrname = layerAttrDto.getAttrname();
        Optional<LayerAttr> layerAttrEntityOptional = layerAttrRepository
                .findByAttrnameAndLayerId(attrname, layerAttrDto.getLayer().getId());
        if (layerAttrEntityOptional.isPresent()) {
            throw new CustomException("layer_attr.by_attrname_and_layer_id.already_exists",
                    attrname, layerAttrDto.getLayer().getId().toString());
        }
        LayerAttr layerAttr = layerAttrMapper.toEntity(layerAttrDto);
        LayerAttr created = layerAttrRepository.save(layerAttr);
        jdbcService.createAttribute(created.getLayer().getLayername(), created.getAttrname(), created.getAttrType());
        geoserverService.reload();
        historyService.saveLayerAttr(created.getId(), Action.CREATE);
        return layerAttrMapper.toDto(created);
    }

    @Override
    public LayerAttrDto updateLayerAttr(UUID id, LayerAttrDto layerAttrDto) {
        LayerAttr layerAttr = getEntityById(id);
        layerAttr.setNameKk(layerAttrDto.getNameKk());
        layerAttr.setNameRu(layerAttrDto.getNameRu());
        layerAttr.setNameEn(layerAttrDto.getNameEn());
        layerAttr.setShortInfo(layerAttrDto.getShortInfo());
        layerAttr.setFullInfo(layerAttrDto.getFullInfo());
        layerAttr.setDictionaryCode(layerAttrDto.getDictionaryCode());
        layerAttr.setRank(layerAttrDto.getRank());
        LayerAttr updated = layerAttrRepository.save(layerAttr);
        historyService.saveLayerAttr(updated.getId(), Action.UPDATE);
        return layerAttrMapper.toDto(updated);
    }

    @Override
    public void deleteLayerAttr(UUID id) {
        LayerAttr layerAttr = getEntityById(id);
        layerAttrRepository.deleteById(id);
        jdbcService.deleteAttribute(layerAttr.getLayer().getLayername(), layerAttr.getAttrname());
        geoserverService.reload();
        historyService.saveLayerAttr(id, Action.DELETE);
    }

    @Override
    public Set<LayerAttrDto> getLayerAttrsByLayername(String layername) {
        Layer layer = layerRepository.findByLayername(layername).orElseThrow();
        return layerAttrMapper.toDto(layerAttrRepository.findByLayerIdOrderByRank(layer.getId()));
    }
}
