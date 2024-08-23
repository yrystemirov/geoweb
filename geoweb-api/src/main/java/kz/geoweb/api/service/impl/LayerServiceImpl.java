package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.LayerCreateDto;
import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.LayerMapper;
import kz.geoweb.api.repository.LayerRepository;
import kz.geoweb.api.service.EntityUpdateHistoryService;
import kz.geoweb.api.service.JdbcService;
import kz.geoweb.api.service.LayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

import static kz.geoweb.api.utils.CommonConstants.LAYERNAME_PREFIX;

@Service
@RequiredArgsConstructor
public class LayerServiceImpl implements LayerService {
    private final LayerRepository layerRepository;
    private final LayerMapper layerMapper;
    private final JdbcService jdbcService;
    private final EntityUpdateHistoryService historyService;

    private Layer getEntityById(UUID id) {
        return layerRepository.findById(id)
                .orElseThrow(() -> new CustomException("layer.by_id.not_found", id.toString()));
    }

    @Override
    public LayerDto getLayer(UUID id) {
        return layerMapper.toDto(getEntityById(id));
    }

    @Override
    public Page<LayerDto> getLayers(Pageable pageable) {
        return layerRepository.findAll(pageable).map(layerMapper::toDto);
    }

    @Override
    public LayerDto createLayer(LayerCreateDto layerCreateDto) {
        if (layerCreateDto.getIsDynamic() && layerCreateDto.getDynamicIdentityColumn() == null) {
            throw new CustomException("layer.dynamic.without_identity_column");
        }
        layerCreateDto.setId(null);
        Long seqNumber = null;
        if (layerCreateDto.isCreateTable()) {
            seqNumber = jdbcService.getSeqNumber();
            layerCreateDto.setLayername(LAYERNAME_PREFIX + seqNumber);
        } else {
            if (layerCreateDto.getLayername() == null || layerCreateDto.getLayername().isBlank()) {
                throw new CustomException("layer.layername.empty");
            }
            Optional<Layer> layerEntityOptional = layerRepository
                    .findByLayername(layerCreateDto.getLayername().trim());
            if (layerEntityOptional.isPresent()) {
                throw new CustomException("layer.by_layername.already_exists", layerCreateDto.getLayername());
            }
        }
        Layer layer = layerMapper.toEntity(layerCreateDto);
        Layer created = layerRepository.save(layer);
        if (layerCreateDto.isCreateTable()) {
            jdbcService.createSequence(seqNumber);
            jdbcService.createTable(seqNumber, created.getGeometryType());
        }
        // TODO: geoserver deploy
        historyService.saveLayer(created.getId(), Action.CREATE);
        return layerMapper.toDto(created);
    }

    @Override
    public LayerDto updateLayer(UUID id, LayerDto layerDto) {
        if (layerDto.getIsDynamic() && layerDto.getDynamicIdentityColumn() == null) {
            throw new CustomException("layer.dynamic.without_identity_column");
        }
        Layer layer = getEntityById(id);
        layer.setNameKk(layerDto.getNameKk());
        layer.setNameRu(layerDto.getNameRu());
        layer.setNameEn(layerDto.getNameEn());
        layer.setDescriptionKk(layerDto.getDescriptionKk());
        layer.setDescriptionRu(layerDto.getDescriptionRu());
        layer.setDescriptionEn(layerDto.getDescriptionEn());
        layer.setUrl(layerDto.getUrl());
        layer.setBaseLayer(layerDto.getBaseLayer());
        layer.setCheckIntersection(layerDto.getCheckIntersection());
        layer.setIsBlockLayer(layerDto.getIsBlockLayer());
        layer.setIsDynamic(layerDto.getIsDynamic());
        layer.setIsPublic(layerDto.getIsPublic());
        layer.setDynamicIdentityColumn(layerDto.getDynamicIdentityColumn());
        Layer updated = layerRepository.save(layer);
        historyService.saveLayer(updated.getId(), Action.UPDATE);
        return layerMapper.toDto(updated);
    }

    @Override
    public void deleteLayer(UUID id) {
        getEntityById(id);
        layerRepository.deleteById(id);
        // TODO: geoserver delete
        historyService.saveLayer(id, Action.DELETE);
    }
}
