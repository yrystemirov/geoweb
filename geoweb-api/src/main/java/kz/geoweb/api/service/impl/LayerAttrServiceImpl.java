package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.LayerAttrCreateDto;
import kz.geoweb.api.dto.LayerAttrDto;
import kz.geoweb.api.entity.LayerAttr;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.LayerAttrMapper;
import kz.geoweb.api.repository.LayerAttrRepository;
import kz.geoweb.api.service.JdbcService;
import kz.geoweb.api.service.LayerAttrService;
import kz.geoweb.api.utils.CommonConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LayerAttrServiceImpl implements LayerAttrService {
    private final LayerAttrRepository layerAttrRepository;
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
        return layerAttrMapper.toDto(layerAttrRepository.findByLayerIdOrderByOrderNumber(layerId));
    }

    @Override
    public LayerAttrDto createLayerAttr(LayerAttrCreateDto layerAttrCreateDto) {
        layerAttrCreateDto.setId(null);
        if (layerAttrCreateDto.isCreateColumn()) {
            if (layerAttrCreateDto.getAttrname() == null) {
                Long seqNumber = jdbcService.getSeqNumber();
                layerAttrCreateDto.setAttrname(CommonConstants.ATTRNAME_PREFIX + seqNumber);
            }
        } else {
            if (layerAttrCreateDto.getAttrname() == null || layerAttrCreateDto.getAttrname().isBlank()) {
                throw new CustomException("layer_attr.attrname.empty");
            }
            Optional<LayerAttr> layerAttrEntityOptional = layerAttrRepository
                    .findByAttrnameAndLayerId(layerAttrCreateDto.getAttrname(), layerAttrCreateDto.getLayer().getId());
            if (layerAttrEntityOptional.isPresent()) {
                throw new CustomException("layer_attr.by_attrname_and_layer_id.already_exists",
                        layerAttrCreateDto.getAttrname(), layerAttrCreateDto.getLayer().getId().toString());
            }
        }
        LayerAttr layerAttr = layerAttrMapper.toEntity(layerAttrCreateDto);
        LayerAttr created = layerAttrRepository.save(layerAttr);
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
        layerAttr.setOrderNumber(layerAttrDto.getOrderNumber());
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
}
