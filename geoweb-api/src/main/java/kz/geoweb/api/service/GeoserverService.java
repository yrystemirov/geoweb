package kz.geoweb.api.service;

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

//    Object wmsRequest(WmsRequestDto wmsRequestDto);
}
