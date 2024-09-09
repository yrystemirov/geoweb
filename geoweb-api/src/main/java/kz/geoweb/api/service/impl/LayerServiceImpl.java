package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.LayerDto;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.LayerMapper;
import kz.geoweb.api.repository.LayerAttrRepository;
import kz.geoweb.api.repository.LayerRepository;
import kz.geoweb.api.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LayerServiceImpl implements LayerService {
    private final LayerRepository layerRepository;
    private final LayerAttrRepository layerAttrRepository;
    private final LayerMapper layerMapper;
    private final JdbcService jdbcService;
    private final GeoserverService geoserverService;
    private final EntityUpdateHistoryService historyService;
    private final UserService userService;
    private final EntityPermissionService entityPermissionService;

    private Layer getEntityById(UUID id) {
        return layerRepository.findById(id)
                .orElseThrow(() -> new CustomException("layer.by_id.not_found", id.toString()));
    }

    @Override
    public LayerDto getLayer(UUID id) {
        Set<UUID> roleIds = userService.getCurrentUserRoleIds();
        entityPermissionService.checkLayerRead(id, roleIds);
        return layerMapper.toDto(getEntityById(id));
    }

    @Override
    public Page<LayerDto> getLayers(Pageable pageable) {
        return layerRepository.findAll(pageable).map(layerMapper::toDto);
    }

    @Override
    public LayerDto createLayer(LayerDto layerDto) {
        if (layerDto.getIsDynamic() && layerDto.getDynamicIdentityColumn() == null) {
            throw new CustomException("layer.dynamic.without_identity_column");
        }
        layerDto.setId(null);
        String layername = layerDto.getLayername();
        Optional<Layer> layerEntityOptional = layerRepository
                .findByLayername(layername.trim());
        if (layerEntityOptional.isPresent()) {
            throw new CustomException("layer.by_layername.already_exists", layername);
        }
        Layer layer = layerMapper.toEntity(layerDto);
        Layer created = layerRepository.save(layer);
        jdbcService.createTable(layername, created.getGeometryType());
        geoserverService.deployLayer(created.getLayername());
        historyService.saveLayer(created.getId(), Action.CREATE);
        return layerMapper.toDto(created);
    }

    @Override
    public LayerDto updateLayer(UUID id, LayerDto layerDto) {
        Set<UUID> roleIds = userService.getCurrentUserRoleIds();
        entityPermissionService.checkLayerWrite(id, roleIds);
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
        Set<UUID> roleIds = userService.getCurrentUserRoleIds();
        entityPermissionService.checkLayerWrite(id, roleIds);
        Layer layer = getEntityById(id);
        layerAttrRepository.deleteByLayerId(id);
        layerRepository.deleteById(id);
        geoserverService.deleteLayer(layer.getLayername());
        geoserverService.reload();
        jdbcService.deleteTable(layer.getLayername());
        historyService.saveLayer(id, Action.DELETE);
    }
}
