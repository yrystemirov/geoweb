package kz.geoweb.api.service;

import kz.geoweb.api.dto.WmsRequestDto;
import kz.geoweb.api.dto.WmsResponseDto;

public interface GeoserverService {
    void reload();

    void deployLayer(String layername);

    void deleteLayer(String layername);

    void createStyle(String styleXml);

//    void createCoverageStore(String tifFilename);

//    void createCoverage(String tifFilename, String layername) throws Exception;

    void updateStyle(String styleName, String styleXml);

    void deleteStyle(String styleName);

    void setStyleToLayer(String layername, String styleName);

    WmsResponseDto wmsRequest(WmsRequestDto wmsRequestDto);
}
