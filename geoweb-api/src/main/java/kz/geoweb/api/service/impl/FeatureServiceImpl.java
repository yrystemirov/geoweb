package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.*;
import kz.geoweb.api.entity.FeatureFile;
import kz.geoweb.api.entity.FeatureUpdateHistory;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.enums.AttrType;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.exception.ForbiddenException;
import kz.geoweb.api.mapper.FeatureFileMapper;
import kz.geoweb.api.repository.FeatureFileRepository;
import kz.geoweb.api.repository.FeatureUpdateHistoryRepository;
import kz.geoweb.api.repository.LayerRepository;
import kz.geoweb.api.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLConnection;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static kz.geoweb.api.utils.CommonConstants.MINIO_BUCKET_FEATURE_FILES;
import static kz.geoweb.api.utils.GisConstants.*;
import static kz.geoweb.api.utils.LanguageUtils.LOCALE_EN;
import static kz.geoweb.api.utils.LanguageUtils.LOCALE_KK;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeatureServiceImpl implements FeatureService {
    private final JdbcClient jdbcClient;
    private final LayerService layerService;
    private final LayerAttrService layerAttrService;
    private final FeatureUpdateHistoryRepository featureUpdateHistoryRepository;
    private final FeatureFileRepository featureFileRepository;
    private final FeatureFileMapper featureFileMapper;
    private final UserService userService;
    private final DictionaryService dictionaryService;
    private final EntryService entryService;
    private final GeoserverService geoserverService;
    private final MinioService minioService;
    private final JdbcService jdbcService;
    private final LayerRepository layerRepository;

    private Map<String, Object> getFeatureByGid(String layername, Integer gid) {
        String tableName = LAYERS_SCHEMA + "." + layername;
        List<LayerAttrDto> layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);
        String fields = layerAttrs.stream()
                .map(LayerAttrDto::getAttrname)
                .collect(Collectors.joining(", "));

        String sql = "SELECT gid,ST_AsText(geom) AS geom," + fields + " FROM " + tableName + " WHERE gid = :gid";
        return jdbcClient.sql(sql)
                .param(GID, gid)
                .query(mapRowMapper())
                .single();
    }

    @Override
    public Page<Map<String, Object>> getFeatures(String layername, Pageable pageable) {
        String tableName = LAYERS_SCHEMA + "." + layername;
        List<LayerAttrDto> layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);
        String fields = layerAttrs.stream()
                .map(LayerAttrDto::getAttrname)
                .collect(Collectors.joining(", "));
        String sortClause = getSortClause(pageable.getSort());

        String sql = "SELECT gid,ST_AsText(geom) AS geom," + fields + " FROM " + tableName +
                sortClause + " LIMIT :limit OFFSET :offset";

        int limit = pageable.getPageSize();
        int offset = pageable.getPageNumber() * pageable.getPageSize();

        List<Map<String, Object>> results = jdbcClient.sql(sql)
                .param("limit", limit)
                .param("offset", offset)
                .query(mapRowMapper())
                .list();

        String countSql = "SELECT COUNT(*) FROM " + tableName;
        int total = jdbcClient.sql(countSql).query(Integer.class).single();
        fillDictionaryValues(results, layerAttrs);
        return new PageImpl<>(results, pageable, total);
    }

    @Override
    public Page<Map<String, Object>> getFeaturesPublic(String layername, Pageable pageable) {
        LayerInfoDto layerInfoDto = layerService.getLayerByLayername(layername);
        if (!layerInfoDto.getIsPublic()) {
            throw new ForbiddenException("layer.is_not_public", layername);
        }
        return getFeatures(layername, pageable);
    }

    private RowMapper<Map<String, Object>> mapRowMapper() {
        return (rs, rowNum) -> {
            Map<String, Object> row = new HashMap<>();
            for (int i = 1; i <= rs.getMetaData().getColumnCount(); i++) {
                row.put(rs.getMetaData().getColumnName(i), rs.getObject(i));
            }
            return row;
        };
    }

    private String getSortClause(Sort sort) {
        if (sort.isUnsorted()) {
            return "";
        }
        String orderBy = sort.stream()
                .map(order -> order.getProperty() + " " + order.getDirection().name())
                .collect(Collectors.joining(", "));
        return " ORDER BY " + orderBy;
    }

    private void fillDictionaryValues(List<Map<String, Object>> features, List<LayerAttrDto> layerAttrs) {
        String language = LocaleContextHolder.getLocale().getLanguage();
        if (features.isEmpty()) return;
        List<LayerAttrDto> dictionaryLayerAttrs = layerAttrs.stream().filter(attr -> attr.getAttrType() == AttrType.DICTIONARY).toList();
        if (dictionaryLayerAttrs.isEmpty()) return;
        for (Map<String, Object> feature : features) {
            for (LayerAttrDto attr : dictionaryLayerAttrs) {
                fillDictionaryValue(feature, attr, language);
            }
        }
    }

    private void fillDictionaryValue(Map<String, Object> feature, LayerAttrDto attr, String language) {
        try {
            String attrname = attr.getAttrname();
            Object value = feature.get(attrname);
            if (value != null) {
                String valueString = value.toString();
                String[] entryValues = valueString.split(";");
                DictionaryDto dictionaryDto = dictionaryService.getDictionaryByCode(attr.getDictionaryCode());
                List<EntryDto> entries = entryService.getEntries(dictionaryDto.getId(), null);
                List<String> values = new ArrayList<>();
                for (String entryValue : entryValues) {
                    Optional<EntryDto> entry = entries.stream().filter(e -> e.getCode().equals(entryValue.trim())).findFirst();
                    entry.ifPresent(e -> {
                        switch (language) {
                            case LOCALE_KK:
                                values.add(e.getKk());
                                break;
                            case LOCALE_EN:
                                values.add(e.getEn());
                                break;
                            default:
                                values.add(e.getRu());
                        }
                    });
                }
                if (!values.isEmpty()) {
                    feature.put(attrname, String.join(", ", values));
                }
            }
        } catch (Exception e) {
            log.error("Error filling dictionary values: {}", e.getMessage());
        }
    }

    @Override
    public void save(String layername, List<FeatureSaveDto> featureSaveDtoList) {
        String tableName = LAYERS_SCHEMA + "." + layername;
        List<LayerAttrDto> layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);

        for (FeatureSaveDto feature : featureSaveDtoList) {
            convertStringDatesToLocalDateTime(feature.getAttributes(), layerAttrs);
            switch (feature.getAction()) {
                case CREATE:
                    Integer gid = insertFeature(tableName, feature);
                    saveHistory(layername, gid, Action.CREATE);
                    break;
                case UPDATE:
                    updateFeature(tableName, feature);
                    saveHistory(layername, feature.getGid(), Action.UPDATE);
                    break;
                case DELETE:
                    deleteFeature(tableName, feature.getGid());
                    saveHistory(layername, feature.getGid(), Action.DELETE);
                    break;
            }
        }
    }

    private Integer insertFeature(String tableName, FeatureSaveDto feature) {
        StringBuilder columns = new StringBuilder("(geom");
        StringBuilder values = new StringBuilder("(ST_GeomFromText(:geom)");

        for (String key : feature.getAttributes().keySet()) {
            columns.append(", ").append(key);
            values.append(", :").append(key);
        }
        columns.append(")");
        values.append(")");

        String sql = "INSERT INTO " + tableName + " " + columns + " VALUES " + values + " RETURNING gid";
        return jdbcClient.sql(sql)
                .param(GEOM, feature.getWkt())
                .params(feature.getAttributes())
                .query(Integer.class).single();
    }

    private void updateFeature(String tableName, FeatureSaveDto feature) {
        StringBuilder setClause = new StringBuilder("geom = ST_GeomFromText(:geom)");

        for (String key : feature.getAttributes().keySet()) {
            setClause.append(", ").append(key).append(" = :").append(key);
        }

        String sql = "UPDATE " + tableName + " SET " + setClause + " WHERE gid = :gid";
        jdbcClient.sql(sql)
                .param(GEOM, feature.getWkt())
                .params(feature.getAttributes())
                .param(GID, feature.getGid())
                .update();
    }

    private void deleteFeature(String tableName, Integer gid) {
        String sql = "DELETE FROM " + tableName + " WHERE gid = :gid";
        jdbcClient.sql(sql)
                .param(GID, gid)
                .update();
    }

    private void convertStringDatesToLocalDateTime(Map<String, Object> attributes, List<LayerAttrDto> layerAttrs) {
        for (Map.Entry<String, Object> entry : attributes.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            layerAttrs.stream()
                    .filter(attr -> attr.getAttrname().equals(key) && attr.getAttrType() == AttrType.TIMESTAMP)
                    .findFirst()
                    .ifPresent(attr -> {
                        if (value instanceof String) {
                            LocalDateTime dateTime = LocalDateTime.parse((String) value);
                            attributes.put(key, dateTime);
                        }
                    });
        }
    }

    private void saveHistory(String layername, Integer gid, Action action) {
        try {
            UserDto currentUser = userService.getCurrentUser();
            FeatureUpdateHistory featureUpdateHistory = new FeatureUpdateHistory();
            featureUpdateHistory.setLayername(layername);
            featureUpdateHistory.setGid(gid);
            featureUpdateHistory.setAction(action);
            featureUpdateHistory.setDate(LocalDateTime.now());
            featureUpdateHistory.setUserId(currentUser.getId());
            featureUpdateHistoryRepository.save(featureUpdateHistory);
        } catch (Exception e) {
            log.error("Error saving FeatureUpdateHistory: {}", e.getMessage());
        }
    }

    @Override
    public List<IdentifyResponseDto> identify(WmsRequestDto wmsRequestDto) {
        String language = LocaleContextHolder.getLocale().getLanguage();
        WmsResponseDto wmsResponseDto = geoserverService.wmsRequest(wmsRequestDto);
        List<IdentifyResponseDto> identifyResponseDtoList = new ArrayList<>();
        List<LayerLayerAttrsDto> layerAttrsList = new ArrayList<>();
        for (GeoserverFeatureDto geoserverFeature : wmsResponseDto.getFeatures()) {
            try {
                String[] layerGid = geoserverFeature.getId().split("\\.");
                if (layerGid.length != 2) continue;
                String layername = layerGid[0];
                LayerInfoDto layer = layerService.getLayerByLayername(layername);
                Integer gid = Integer.parseInt(layerGid[1]);
                Map<String, Object> feature = getFeatureByGid(layername, gid);
                List<LayerAttrDto> layerAttrs = layerAttrsList.stream().filter(la -> la.getLayername().equals(layername))
                        .findFirst().map(LayerLayerAttrsDto::getLayerAttrs).orElse(null);
                if (layerAttrs == null) {
                    layerAttrs = layerAttrService.getLayerAttrsByLayername(layername);
                    layerAttrsList.add(new LayerLayerAttrsDto(layername, layer, layerAttrs));
                }
                IdentifyResponseDto identifyResponseDto = new IdentifyResponseDto();
                List<IdentifyAttrDto> identifyAttrDtoList = new ArrayList<>();
                for (Map.Entry<String, Object> entry : feature.entrySet()) {
                    String key = entry.getKey();
                    if (key.equals(GID) || key.equals(GEOM)) continue;
                    Object value = entry.getValue();
                    layerAttrs.stream()
                            .filter(attr -> attr.getAttrname().equals(key))
                            .findFirst()
                            .ifPresent(layerAttr -> {
                                IdentifyAttrDto identifyAttrDto = new IdentifyAttrDto();
                                identifyAttrDto.setAttr(layerAttr);
                                if (layerAttr.getAttrType() == AttrType.DICTIONARY) {
                                    fillDictionaryValue(feature, layerAttr, language);
                                    identifyAttrDto.setValue(feature.get(key));
                                } else {
                                    identifyAttrDto.setValue(value);
                                }
                                identifyAttrDtoList.add(identifyAttrDto);
                            });
                }
                identifyAttrDtoList.sort(Comparator.comparingInt(e -> e.getAttr().getRank()));
                String geom = feature.get(GEOM).toString();
                identifyResponseDto.setGid(gid);
                identifyResponseDto.setGeom(geom);
                identifyResponseDto.setLayer(layer);
                identifyResponseDto.setAttributes(identifyAttrDtoList);
                identifyResponseDtoList.add(identifyResponseDto);
            } catch (Exception e) {
                log.error("Error identifying feature: {}", e.getMessage());
            }
        }
        return identifyResponseDtoList;
    }

    @Override
    public List<IdentifyResponseDto> identifyPublic(WmsRequestDto wmsRequestDto) {
        String[] layers = wmsRequestDto.getLayers().split(",");
        List<String> publicLayers = new ArrayList<>();
        for (String layer : layers) {
            String layername = layer;
            if (layer.contains(":")) {
                layername = layer.split(":")[1];
            }
            LayerInfoDto layerInfoDto = layerService.getLayerByLayername(layername);
            if (layerInfoDto.getIsPublic()) {
                publicLayers.add(layer);
            }
        }
        wmsRequestDto.setLayers(String.join(",", publicLayers));
        return identify(wmsRequestDto);
    }

    private FeatureFile getFeatureFileEntityById(UUID id) {
        return featureFileRepository.findById(id)
                .orElseThrow(() -> new CustomException("feature_files.by_id.not_found", id.toString()));
    }

    @Override
    public List<FeatureFileDto> getFeatureFiles(String layername, Integer gid) {
        List<FeatureFile> featureFiles = featureFileRepository.findByLayernameAndGid(layername, gid);
        return featureFileMapper.toDto(featureFiles);
    }

    @Override
    public List<FeatureFileDto> getFeatureFilesPublic(String layername, Integer gid) {
        LayerInfoDto layerInfoDto = layerService.getLayerByLayername(layername);
        if (!layerInfoDto.getIsPublic()) {
            throw new ForbiddenException("layer.is_not_public", layername);
        }
        return getFeatureFiles(layername, gid);
    }

    @Override
    @Transactional
    public FeatureFileDto uploadFeatureFile(byte[] file, String filename, String layername, Integer gid) {
        String contentType = URLConnection.guessContentTypeFromName(filename);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        String minioObject = generateMinioObject(filename);
        FeatureFile featureFile = new FeatureFile();
        featureFile.setLayername(layername);
        featureFile.setGid(gid);
        featureFile.setFilename(filename);
        featureFile.setContentType(contentType);
        featureFile.setSize(file.length);
        featureFile.setMinioBucket(MINIO_BUCKET_FEATURE_FILES);
        featureFile.setMinioObject(minioObject);
        FeatureFile created = featureFileRepository.save(featureFile);
        minioService.upload(file, filename, MINIO_BUCKET_FEATURE_FILES, minioObject);
        return featureFileMapper.toDto(created);
    }

    private String generateMinioObject(String fileName) {
        String uuid = UUID.randomUUID().toString();
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return uuid;
        } else {
            return uuid + "." + fileName.substring(fileName.lastIndexOf(".") + 1);
        }
    }

    @Override
    public FeatureFileResponseDto downloadFeatureFile(UUID id) {
        FeatureFile featureFile = getFeatureFileEntityById(id);
        FeatureFileResponseDto featureFileResponseDto = featureFileMapper.toFeatureFileResponseDto(featureFile);
        byte[] file = minioService.download(featureFile.getMinioObject(), featureFile.getMinioBucket());
        featureFileResponseDto.setFile(file);
        return featureFileResponseDto;
    }

    @Override
    public FeatureFileResponseDto downloadFeatureFilePublic(UUID id) {
        FeatureFile featureFile = getFeatureFileEntityById(id);
        LayerInfoDto layerInfoDto = layerService.getLayerByLayername(featureFile.getLayername());
        if (!layerInfoDto.getIsPublic()) {
            throw new ForbiddenException("layer.is_not_public", layerInfoDto.getLayername());
        }
        return downloadFeatureFile(id);
    }

    public ExtentDto getLayerExtent(UUID layerId) {
        Layer layer = layerRepository.findById(layerId)
                .orElseThrow(() -> new CustomException("layer.by_id.not_found", layerId.toString()));
        String wkt = jdbcService.getTableExtent(layer.getLayername());
        return new ExtentDto(wkt);
    }
}
