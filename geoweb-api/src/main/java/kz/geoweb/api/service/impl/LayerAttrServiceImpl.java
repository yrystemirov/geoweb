package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.entity.LayerAttr;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.LayerAttrMapper;
import kz.geoweb.api.repository.LayerAttrRepository;
import kz.geoweb.api.repository.LayerRepository;
import kz.geoweb.api.service.JdbcService;
import kz.geoweb.api.service.LayerAttrService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    private LayerAttr getEntityById(UUID id) {
        return layerAttrRepository.findById(id)
                .orElseThrow(() -> new CustomException("layer_attr.by_id.not_found", id.toString()));
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
    @Transactional
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
        // TODO: geoserver deploy
        // TODO: update history
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
        // TODO: update history
        return layerAttrMapper.toDto(updated);
    }

    @Override
    public void deleteLayerAttr(UUID id) {
        getEntityById(id);
        layerAttrRepository.deleteById(id);
        // TODO: update history
    }

    @Override
    public Set<LayerAttrDto> getLayerAttrsByLayername(String layername) {
        Layer layer = layerRepository.findByLayername(layername).orElseThrow();
        return layerAttrMapper.toDto(layerAttrRepository.findByLayerIdOrderByRank(layer.getId()));
    }
}
