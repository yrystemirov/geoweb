package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.LayerInfoDto;
import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.dto.LayerRequestDto;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.FolderMapper;
import kz.geoweb.api.mapper.LayerMapper;
import kz.geoweb.api.repository.LayerAttrRepository;
import kz.geoweb.api.repository.LayerRepository;
import kz.geoweb.api.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LayerServiceImpl implements LayerService {
    private final LayerRepository layerRepository;
    private final LayerAttrRepository layerAttrRepository;
    private final LayerMapper layerMapper;
    private final FolderMapper folderMapper;
    private final JdbcService jdbcService;
    private final GeoserverService geoserverService;
    private final EntityUpdateHistoryService historyService;
    private final EntityPermissionService entityPermissionService;

    private Layer getEntityById(UUID id) {
        return layerRepository.findById(id)
                .orElseThrow(() -> new CustomException("layer.by_id.not_found", id.toString()));
    }

    @Override
    public LayerDto getLayer(UUID id) {
        entityPermissionService.checkLayerRead(id);
        return layerMapper.toDto(getEntityById(id));
    }

    @Override
    public LayerInfoDto getLayerByLayername(String layername) {
        return layerMapper.toLayerInfoDto(layerRepository.findByLayername(layername)
                .orElseThrow(() -> new CustomException("layer.by_layername.not_found", layername)));
    }

    @Override
    public Page<LayerInfoDto> getLayers(String search, Pageable pageable) {
        Page<Layer> layerPage;
        if (search != null && !search.isBlank()) {
            layerPage = layerRepository.findByLayernameContainingIgnoreCaseOrNameKkContainingIgnoreCaseOrNameRuContainingIgnoreCaseOrNameEnContainingIgnoreCase(
                    search, search, search, search, pageable);
        } else {
            layerPage = layerRepository.findAll(pageable);
        }
        return layerPage.map(layerMapper::toLayerInfoDto);
    }

    @Override
    public LayerDto createLayer(LayerRequestDto layerRequestDto) {
        if (layerRequestDto.getIsDynamic() && layerRequestDto.getDynamicIdentityColumn() == null) {
            throw new CustomException("layer.dynamic.without_identity_column");
        }
        String layername = layerRequestDto.getLayername();
        Optional<Layer> layerEntityOptional = layerRepository
                .findByLayername(layername.trim());
        if (layerEntityOptional.isPresent()) {
            throw new CustomException("layer.by_layername.already_exists", layername);
        }
        Layer layer = layerMapper.toEntity(layerRequestDto);
        Layer created = layerRepository.save(layer);
        jdbcService.createTable(layername, created.getGeometryType());
        geoserverService.deployLayer(created.getLayername());
        historyService.saveLayer(created.getId(), Action.CREATE);
        return layerMapper.toDto(created);
    }

    @Override
    public LayerDto updateLayer(UUID id, LayerRequestDto layerRequestDto) {
        entityPermissionService.checkLayerWrite(id);
        if (layerRequestDto.getIsDynamic() && layerRequestDto.getDynamicIdentityColumn() == null) {
            throw new CustomException("layer.dynamic.without_identity_column");
        }
        Layer layer = getEntityById(id);
        layer.setNameKk(layerRequestDto.getNameKk());
        layer.setNameRu(layerRequestDto.getNameRu());
        layer.setNameEn(layerRequestDto.getNameEn());
        layer.setDescriptionKk(layerRequestDto.getDescriptionKk());
        layer.setDescriptionRu(layerRequestDto.getDescriptionRu());
        layer.setDescriptionEn(layerRequestDto.getDescriptionEn());
        layer.setUrl(layerRequestDto.getUrl());
        layer.setBaseLayer(layerRequestDto.getBaseLayer());
        layer.setCheckIntersection(layerRequestDto.getCheckIntersection());
        layer.setIsBlockLayer(layerRequestDto.getIsBlockLayer());
        layer.setIsDynamic(layerRequestDto.getIsDynamic());
        layer.setIsPublic(layerRequestDto.getIsPublic());
        layer.setDynamicIdentityColumn(layerRequestDto.getDynamicIdentityColumn());
        layer.setFolders(folderMapper.toEntity(layerRequestDto.getFolders()));
        Layer updated = layerRepository.save(layer);
        historyService.saveLayer(updated.getId(), Action.UPDATE);
        return layerMapper.toDto(updated);
    }

    @Override
    public void deleteLayer(UUID id) {
        entityPermissionService.checkLayerWrite(id);
        Layer layer = getEntityById(id);
        layerAttrRepository.deleteByLayerId(id);
        layerRepository.deleteById(id);
        geoserverService.deleteLayer(layer.getLayername());
        geoserverService.reload();
        jdbcService.deleteTable(layer.getLayername());
        historyService.saveLayer(id, Action.DELETE);
    }
}
