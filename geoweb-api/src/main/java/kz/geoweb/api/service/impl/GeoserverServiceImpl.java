package kz.geoweb.api.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import kz.geoweb.api.config.properties.GeoserverProperties;
import kz.geoweb.api.dto.WmsRequestDto;
import kz.geoweb.api.dto.WmsResponseDto;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.service.GeoserverService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import static kz.geoweb.api.utils.GisConstants.GEOSERVER_SLD_CONTENT_TYPE;

@Service
@Slf4j
public class GeoserverServiceImpl implements GeoserverService {
    private final GeoserverProperties geoserverProperties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    private final String geoserverRestUrl;
    private final String workspace;
    private final String datastore;

    public GeoserverServiceImpl(GeoserverProperties geoserverProperties, RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.geoserverProperties = geoserverProperties;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.geoserverRestUrl = geoserverProperties.getUrl() + "rest/";
        this.workspace = geoserverProperties.getWorkspace();
        this.datastore = geoserverProperties.getDatastore();
    }

    private HttpHeaders getHeaders() {
        String username = geoserverProperties.getUsername();
        String password = geoserverProperties.getPassword();
        String credentials = username + ":" + password;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.setBasicAuth(encodedCredentials);
        requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        return requestHeaders;
    }

    @Override
    public void reload() {
        String url = geoserverRestUrl + "reload";
        HttpEntity httpEntity = new HttpEntity(getHeaders());

        ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.POST, httpEntity, Void.class);
        if (!response.getStatusCode().equals(HttpStatus.OK)) {
            throw new CustomException("geoserver.reload.error");
        }
        log.info("Configurations reloaded successfully!");
    }

    @Override
    public void deployLayer(String layername) {
        String url = geoserverRestUrl + "workspaces/" + workspace + "/datastores/" + datastore + "/featuretypes";
        Map<String, Map<String, Object>> body = new HashMap<>();
        Map<String, Object> featureTypeMap = new HashMap<>();
        featureTypeMap.put("name", layername);
        //Geoserver-de LayerPreview-de korinbeu ushin
        featureTypeMap.put("advertised", false);
        body.put("featureType", featureTypeMap);

        HttpEntity httpEntity = new HttpEntity(body, getHeaders());

        ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.POST, httpEntity, Void.class);
        if (!response.getStatusCode().equals(HttpStatus.CREATED)) {
            throw new CustomException("layer.geoserver.deploy.error", layername);
        }
        log.info("Layer {} deployed to geoserver successfully!", layername);
    }

    @Override
    public void deleteLayer(String layername) {
        String url = geoserverRestUrl + "layers/" + workspace + ":" + layername + ".xml";
        HttpEntity httpEntity = new HttpEntity(getHeaders());

        ResponseEntity<Void> response = null;
        // TODO: catch response status code from geoserver
        try {
            response = restTemplate.exchange(url, HttpMethod.DELETE, httpEntity, Void.class);
            log.info("Layer {} deleted from geoserver successfully!", layername);
        } catch (ResourceAccessException e) {
            e.printStackTrace();
            log.info("Layer {} not deleted", layername);
        }
    }

    @Override
    public void createStyle(String styleXml) {
        String url = geoserverRestUrl + "workspaces/" + workspace + "/styles";
        HttpHeaders headers = getHeaders();
        headers.set("Content-Type", GEOSERVER_SLD_CONTENT_TYPE);
        HttpEntity httpEntity = new HttpEntity(styleXml, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, httpEntity, String.class);
        if (!response.getStatusCode().equals(HttpStatus.CREATED)) {
            throw new CustomException("layer.geoserver.common.error");
        }
    }

    @Override
    public void updateStyle(String styleName, String styleXml) {
        String url = geoserverRestUrl + "workspaces/" + workspace + "/styles/" + styleName;
        HttpHeaders headers = getHeaders();
        headers.set("Content-Type", GEOSERVER_SLD_CONTENT_TYPE);

        HttpEntity httpEntity = new HttpEntity(styleXml, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, httpEntity, String.class);
        if (!response.getStatusCode().equals(HttpStatus.OK)) {
            throw new CustomException("layer.geoserver.common.error");
        }
    }

    @Override
    public void deleteStyle(String styleName) {
        String url = geoserverRestUrl + "workspaces/" + workspace + "/styles/" + styleName;
        HttpEntity httpEntity = new HttpEntity(getHeaders());
        ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.DELETE, httpEntity, Object.class);
        if (!response.getStatusCode().equals(HttpStatus.OK)) {
            throw new CustomException("layer.geoserver.common.error");
        }
    }

    private Object getStyleByName(String styleName) {
        String url = geoserverRestUrl + "workspaces/" + workspace + "/styles/" + styleName + ".json";
        HttpEntity httpEntity = new HttpEntity(getHeaders());
        ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.GET, httpEntity, Object.class);
        if (!response.getStatusCode().equals(HttpStatus.OK)) {
            throw new CustomException("layer.geoserver.common.error");
        }
        return response.getBody();
    }

    private Map<String, Object> getLayerByLayername(String layername) {
        String url = geoserverRestUrl + "workspaces/" + workspace + "/layers/" + layername;
        HttpEntity httpEntity = new HttpEntity(getHeaders());
        ParameterizedTypeReference<Map<String, Object>> responseType = new ParameterizedTypeReference<>() {
        };
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(url, HttpMethod.GET, httpEntity, responseType);
        if (!response.getStatusCode().equals(HttpStatus.OK)) {
            throw new CustomException("layer.geoserver.common.error");
        }
        return response.getBody();
    }

    private void updateLayer(String layername, Map<String, Object> layer) {
        String url = geoserverRestUrl + "workspaces/" + workspace + "/layers/" + layername;
        HttpHeaders headers = getHeaders();
        HttpEntity httpEntity = new HttpEntity(layer, headers);
        ResponseEntity<Object> response = restTemplate.exchange(url, HttpMethod.PUT, httpEntity, Object.class);
        if (!response.getStatusCode().equals(HttpStatus.OK)) {
            throw new CustomException("layer.geoserver.common.error");
        }
    }

    @Override
    public void setStyleToLayer(String layername, String styleName) {
        Map<String, Object> layer = getLayerByLayername(layername);
        getStyleByName(styleName);
        Map<String, Object> layerNested = objectMapper.convertValue(layer.get("layer"), new TypeReference<>() {
        });
        Map<String, Object> defaultStyle = objectMapper.convertValue(layerNested.get("defaultStyle"), new TypeReference<>() {
        });
        defaultStyle.put("name", styleName);
        layerNested.put("defaultStyle", defaultStyle);
        layer.put("layer", layerNested);
        updateLayer(layername, layer);
    }

    @Override
    public WmsResponseDto wmsRequest(WmsRequestDto wmsRequestDto) {
        String url = geoserverProperties.getUrl() + workspace + "/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image/png&TRANSPARENT=true&" +
                "QUERY_LAYERS=" + wmsRequestDto.getLayers() + "&LAYERS=" + wmsRequestDto.getLayers() + "&TILED=true&" +
                "updatedTime=" + wmsRequestDto.getUpdatedTime() + "&INFO_FORMAT=application/json&FEATURE_COUNT=5&propertyName=geom&" +
                "I=" + wmsRequestDto.getI() + "&J=" + wmsRequestDto.getJ() + "&WIDTH=256&HEIGHT=256&CRS=EPSG:3857&STYLES=&" +
                "BBOX=" + wmsRequestDto.getBbox();
        HttpEntity httpEntity = new HttpEntity(getHeaders());
        ResponseEntity<WmsResponseDto> response = restTemplate.exchange(url, HttpMethod.GET, httpEntity, WmsResponseDto.class);
        if (!response.getStatusCode().equals(HttpStatus.OK)) {
            throw new CustomException("layer.geoserver.common.error");
        }
        return response.getBody();
    }
}
