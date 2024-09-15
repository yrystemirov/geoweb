package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.*;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.entity.Style;
import kz.geoweb.api.enums.GeometryType;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.StyleMapper;
import kz.geoweb.api.repository.LayerRepository;
import kz.geoweb.api.repository.StyleRepository;
import kz.geoweb.api.service.GeoserverService;
import kz.geoweb.api.service.StyleService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StyleServiceImpl implements StyleService {
    private final GeoserverService geoserverService;
    private final StyleRepository styleRepository;
    private final LayerRepository layerRepository;
    private final StyleMapper styleMapper;


    private Style getEntityById(UUID id) {
        return styleRepository.findById(id)
                .orElseThrow(() -> new CustomException("style.by_id.not_found.error", id.toString()));
    }

    private Layer getLayerEntityById(UUID id) {
        return layerRepository.findById(id)
                .orElseThrow(() -> new CustomException("layer.by_id.not_found.error", id.toString()));
    }

    private Layer getLayerByStyleId(UUID styleId) {
        return layerRepository.findByStyleId(styleId)
                .orElseThrow(() -> new CustomException("layer.by_style_id.not_found.error", styleId.toString()));
    }

    @Override
    public Page<StyleResponseDto> getStyles(Pageable pageable) {
        Page<Style> stylePage = styleRepository.findAllByOrderByStyleName(pageable);
        return styleMapper.entityToResponse(stylePage);
    }

    @Override
    public StyleResponseFullDto getStyleById(UUID id) throws CustomException {
        Style style = getEntityById(id);
        return styleMapper.entityToResponseFull(style);
    }

    @Override
    public StyleResponseDto createStyle(StyleRequestDto styleRequestDto, UUID layerId) {
        String xml = generateStyleXml(styleRequestDto);
        geoserverService.createStyle(xml);
        Style style = styleMapper.requestToEntity(styleRequestDto);
        Style created = styleRepository.save(style);
        setStyleToLayer(created.getId(), layerId);
        return styleMapper.entityToResponse(created);
    }

    @Override
    public StyleResponseDto updateStyle(UUID styleId, StyleRequestDto styleRequestDto) {
        String xml = generateStyleXml(styleRequestDto);
        geoserverService.updateStyle(styleRequestDto.getName(), xml);
        Style requeststyle = styleMapper.requestToEntity(styleRequestDto);
        Style dbstyle = getEntityById(styleId);
        dbstyle.setStyleName(requeststyle.getStyleName());
        dbstyle.setStyleJson(requeststyle.getStyleJson());
        Style updated = styleRepository.save(dbstyle);
        return styleMapper.entityToResponse(updated);
    }

    @Override
    public void deleteStyle(UUID id) {
        Style style = getEntityById(id);
        geoserverService.deleteStyle(style.getStyleName());
        styleRepository.deleteById(id);
        Layer layerEntity = getLayerByStyleId(id);
        layerEntity.setStyleId(null);
        layerRepository.save(layerEntity);
    }

    public void setStyleToLayer(UUID styleId, UUID layerId) {
        Style style = getEntityById(styleId);
        Layer layerEntity = getLayerEntityById(layerId);
        geoserverService.setStyleToLayer(layerEntity.getLayername(), style.getStyleName());
        layerEntity.setStyleId(style.getId());
        layerRepository.save(layerEntity);
    }

    @Override
    public String generateStyleXml(StyleRequestDto styleRequestDto) throws CustomException {
        String xml = """
                <?xml version="1.0" encoding="ISO-8859-1"?>
                <StyledLayerDescriptor version="1.0.0"
                    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
                    xmlns="http://www.opengis.net/sld"
                    xmlns:ogc="http://www.opengis.net/ogc"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                  <NamedLayer>
                    <Name>""" + styleRequestDto.getName() + """
                </Name>
                <UserStyle>
                  <Name>""" + styleRequestDto.getName() + """
                </Name>
                <Title>""" + styleRequestDto.getName() + """
                      </Title>
                      <Abstract> Style for Clustered Stacked Points </Abstract>
                      <FeatureTypeStyle>
                """;

        if (styleRequestDto.getRules().stream().anyMatch(StyleRuleDto::isCluster)) {
            xml += "<Transformation>";
            xml += "<Function name=\"vec:PointStacker\">";
            xml += "<Function name=\"parameter\">";
            xml += "<Literal>data</Literal>";
            xml += "</Function>";
            xml += "<Function name=\"parameter\">";
            xml += "<Literal>cellSize</Literal>";
            xml += "<Literal>30</Literal>";
            xml += "</Function>";
            xml += "<Function name=\"parameter\">";
            xml += "<Literal>outputBBOX</Literal>";
            xml += "<Function name=\"env\">";
            xml += "<Literal>wms_bbox</Literal>";
            xml += "</Function>";
            xml += "</Function>";
            xml += "<Function name=\"parameter\">";
            xml += "<Literal>outputWidth</Literal>";
            xml += "<Function name=\"env\">";
            xml += "<Literal>wms_width</Literal>";
            xml += "</Function>";
            xml += "</Function>";
            xml += "<Function name=\"parameter\">";
            xml += "<Literal>outputHeight</Literal>";
            xml += "<Function name=\"env\">";
            xml += "<Literal>wms_height</Literal>";
            xml += "</Function>";
            xml += "</Function>";
            xml += "</Function>";
            xml += "</Transformation>";

        }

        if (styleRequestDto.getGeomType().equals(GeometryType.POINT) || styleRequestDto.getGeomType().equals(GeometryType.MULTIPOINT)) {
            for (StyleRuleDto rule : styleRequestDto.getRules()) {
                validateRule(rule, styleRequestDto.getGeomType());
                xml += "<Rule>";
                xml += "<Name>" + rule.getName() + "</Name>";

                if (rule.getScaleMin() != null) {
                    xml += "<MinScaleDenominator>" + rule.getScaleMin() + "</MinScaleDenominator>";
                }
                if (rule.getScaleMax() != null) {
                    xml += "<MaxScaleDenominator>" + rule.getScaleMax() + "</MaxScaleDenominator>";
                }
                xml += "<PointSymbolizer><Graphic>";
                if (rule.getImgSrc() == null || rule.getImgSrc().isBlank()) {
                    xml += "<Mark>";
                    xml += "<WellKnownName>" + rule.getPointShape() + "</WellKnownName>";
                    xml += "<Fill><CssParameter name=\"fill\">" + rule.getFillColor() + "</CssParameter></Fill>";
                    xml += "</Mark>";
                } else {
                    xml += "<ExternalGraphic>";
                    xml += "<OnlineResource xlink:type=\"simple\" xlink:href=\"" + rule.getImgSrc() + "\" />";
                    xml += "<Format>" + rule.getImgFormat() + "</Format>";
                    xml += "</ExternalGraphic>";
                }
                xml += "<Size>" + rule.getPointRadius() + "</Size>";
                xml += "</Graphic></PointSymbolizer>";

                if (rule.isCluster()) {
                    xml += "<Name>" + rule.getName() + "</Name>";
                    xml += "<Title>" + rule.getClusterTitle() + "</Title>";
                    xml += "<Filter>";
                    xml += "<PropertyIsBetween>";
                    xml += "<PropertyName>count</PropertyName>";
                    xml += "<LowerBoundary>";
                    xml += "<Literal>" + rule.getClusterGreaterThanOrEqual() + "</Literal>";
                    xml += "</LowerBoundary>";
                    xml += "<UpperBoundary>";
                    xml += "<Literal>" + rule.getClusterLessThanOrEqual() + "</Literal>";
                    xml += "</UpperBoundary>";
                    xml += "</PropertyIsBetween>";
                    xml += "</Filter>";
                    xml += "<PointSymbolizer>";
                    xml += "<Graphic>";
                    xml += "<Mark>";
                    xml += "<WellKnownName>circle</WellKnownName>";
                    xml += "<Fill>";
                    xml += "<CssParameter name = \"fill\" >" + rule.getFillColor() + "</CssParameter>";
                    xml += "</Fill>";
                    xml += "</Mark>";
                    xml += "<Size>" + rule.getClusterPointSize() + "</Size>";
                    xml += "</Graphic>";
                    xml += "</PointSymbolizer>";
                    xml += "<TextSymbolizer>";
                    xml += "<Label><PropertyName>count</PropertyName></Label>";
                    xml += "<Font>";
                    xml += "<CssParameter name=\"font-family\">" + rule.getClusterTextType() + "</CssParameter>";
                    xml += "<CssParameter name=\"font-size\"> " + rule.getClusterTextSize() + " </CssParameter>";
                    xml += "<CssParameter name=\"font-weight\">" + rule.getClusterTextWeight() + "</CssParameter>";
                    xml += "</Font>";
                    xml += "<LabelPlacement>";
                    xml += "<PointPlacement>";
                    xml += "<AnchorPoint>";
                    xml += "<AnchorPointX>" + rule.getClusterAnchorPointX() + "</AnchorPointX>";
                    xml += "<AnchorPointY>" + rule.getClusterAnchorPointY() + "</AnchorPointY>";
                    xml += "</AnchorPoint>";
                    xml += "</PointPlacement>";
                    xml += "</LabelPlacement>";
                    xml += "<Halo>";
                    xml += "<Radius>" + rule.getClusterTextHaloRadius() + "</Radius>";
                    xml += "<Fill>";
                    xml += "<CssParameter name=\"fill\">" + rule.getClusterTextHaloFillColor() + "</CssParameter>";
                    xml += "<CssParameter name=\"fill-opacity\"> " + rule.getClusterTextHaloFillOpacityWeight() + " </CssParameter>";
                    xml += "</Fill>";
                    xml += "</Halo>";
                    xml += "<Fill>";
                    xml += "<CssParameter name=\"fill\">" + rule.getClusterTextColor() + "</CssParameter>";
                    xml += "<CssParameter name=\"fill-opacity\">" + rule.getClusterTextColorOpacity() + "</CssParameter>";
                    xml += "</Fill>";
                    xml += "</TextSymbolizer>";
                }

                if (rule.isHasTextSymbolizer()) {
                    xml += getTextSymbolizerXml(rule);
                }

                xml += generateRuleFilterXml(rule);
                xml += "</Rule>";
            }
        } else if (styleRequestDto.getGeomType().equals(GeometryType.LINESTRING) || styleRequestDto.getGeomType().equals(GeometryType.MULTILINESTRING)) {
            for (StyleRuleDto rule : styleRequestDto.getRules()) {
                validateRule(rule, styleRequestDto.getGeomType());
                xml += "<Rule>";
                xml += "<Name>" + rule.getName() + "</Name>";
                if (rule.getScaleMin() != null) {
                    xml += "<MinScaleDenominator>" + rule.getScaleMin() + "</MinScaleDenominator>";
                }
                if (rule.getScaleMax() != null) {
                    xml += "<MaxScaleDenominator>" + rule.getScaleMax() + "</MaxScaleDenominator>";
                }
                xml += "<LineSymbolizer><Stroke>";
                xml += "<CssParameter name=\"stroke\">" + rule.getStrokeColor() + "</CssParameter>";
                xml += "<CssParameter name=\"stroke-width\">" + rule.getStrokeWidth() + "</CssParameter>";
                if (rule.getStrokeColorOpacity() != null) {
                    xml += "<CssParameter name=\"stroke-opacity\">" + rule.getStrokeColorOpacity() + "</CssParameter>";
                }
                if (rule.isDashed()) {
                    xml += "<CssParameter name=\"stroke-dasharray\">" + rule.getStrokeDashLength() + " " + rule.getStrokeSpaceLength() + "</CssParameter>";
                }
                xml += "</Stroke></LineSymbolizer>";

                if (rule.isHasTextSymbolizer()) {
                    xml += getTextSymbolizerXml(rule);
                }

                xml += generateRuleFilterXml(rule);
                xml += "</Rule>";
            }
        } else if (styleRequestDto.getGeomType().equals(GeometryType.POLYGON) || styleRequestDto.getGeomType().equals(GeometryType.MULTIPOLYGON)) {
            for (StyleRuleDto rule : styleRequestDto.getRules()) {
                validateRule(rule, styleRequestDto.getGeomType());
                xml += "<Rule>";
                xml += "<Name>" + rule.getName() + "</Name>";
                if (rule.getScaleMin() != null) {
                    xml += "<MinScaleDenominator>" + rule.getScaleMin() + "</MinScaleDenominator>";
                }
                if (rule.getScaleMax() != null) {
                    xml += "<MaxScaleDenominator>" + rule.getScaleMax() + "</MaxScaleDenominator>";
                }
                xml += "<PolygonSymbolizer>";
                xml += "<Fill>";
                if (rule.getFillColor() != null) {
                    xml += "<CssParameter name=\"fill\">" + rule.getFillColor() + "</CssParameter>";
                }
                if (rule.getFillColorOpacity() != null) {
                    xml += "<CssParameter name=\"fill-opacity\">" + rule.getFillColorOpacity() + "</CssParameter>";
                }
                xml += "</Fill>";
                xml += "<Stroke>";
                xml += "<CssParameter name=\"stroke\">" + rule.getStrokeColor() + "</CssParameter>";
                xml += "<CssParameter name=\"stroke-width\">" + rule.getStrokeWidth() + "</CssParameter>";
                if (rule.getStrokeColorOpacity() != null) {
                    xml += "<CssParameter name=\"stroke-opacity\">" + rule.getStrokeColorOpacity() + "</CssParameter>";
                }
                if (rule.isDashed()) {
                    xml += "<CssParameter name=\"stroke-dasharray\">" + rule.getStrokeDashLength() + " " + rule.getStrokeSpaceLength() + "</CssParameter>";
                }
                xml += "</Stroke>";
                xml += "</PolygonSymbolizer>";

                if (rule.isHasTextSymbolizer()) {
                    xml += getTextSymbolizerXml(rule);
                }

                xml += generateRuleFilterXml(rule);
                xml += "</Rule>";
            }
        } else if (styleRequestDto.getGeomType().equals(GeometryType.RASTER)) {
            for (StyleRuleDto rule : styleRequestDto.getRules()) {
                xml += "<Rule>";
                xml += "<RasterSymbolizer><ColorMap type=\"intervals\">";

                for (StyleRasterColorDto rasterColor : rule.getRasterColors()) {
                    xml += "<ColorMapEntry color=\"" + rasterColor.getColor() + "\" quantity=\"" + rasterColor.getQuantity() + "\" " +
                            "label=\"" + rasterColor.getLabel() + "\" opacity=\"" + rasterColor.getOpacity() + "\" />";
                }

                xml += "</ColorMap></RasterSymbolizer>";
                xml += "</Rule>";
            }
        }
        xml += """
                      </FeatureTypeStyle>
                    </UserStyle>
                  </NamedLayer>
                </StyledLayerDescriptor>
                """;
        return xml;
    }

    private String getTextSymbolizerXml(StyleRuleDto rule) {
        String xml = "";
        xml += "<TextSymbolizer>";
        xml += "<Label><PropertyName>" + rule.getTextSymbolizerAttrName() + "</PropertyName></Label>";
        xml += "<Font>";
        xml += "<CssParameter name=\"font-family\">" + rule.getFontFamily() + "</CssParameter>";
        xml += "<CssParameter name=\"font-size\">" + rule.getFontSize() + "</CssParameter>";
        xml += "<CssParameter name=\"font-style\">" + rule.getFontStyle() + "</CssParameter>";
        xml += "<CssParameter name=\"font-weight\">" + rule.getFontWeight() + "</CssParameter>";
        xml += "</Font>";
        xml += "<LabelPlacement>";
        xml += "<PointPlacement>";
        xml += "<AnchorPoint>";
        xml += "<AnchorPointX>" + rule.getAnchorpointX() + "</AnchorPointX>";
        xml += "<AnchorPointY>" + rule.getAnchorpointY() + "</AnchorPointY>";
        xml += "</AnchorPoint>";
        xml += "<Displacement>";
        xml += "<DisplacementX>" + rule.getTextSymbolizerDisplacementX() + "</DisplacementX>";
        xml += "<DisplacementY>" + rule.getTextSymbolizerDisplacementY() + "</DisplacementY>";
        xml += "</Displacement>";
        xml += "<Rotation>" + rule.getTextSymbolizerRotation() + "</Rotation>";
        xml += "</PointPlacement>";
        xml += "</LabelPlacement>";
        xml += "<Fill>";
        xml += "<CssParameter name=\"fill\">" + rule.getTextSymbolizerFillColor() + "</CssParameter>";
        xml += "<CssParameter name=\"fill-opacity\">" + rule.getTextSymbolizerFillColorOpacity() + "</CssParameter>";
        xml += "</Fill>";
        xml += "<VendorOption name=\"maxDisplacement\">200</VendorOption>" +
                "<VendorOption name=\"group\">true</VendorOption></TextSymbolizer>";
        return xml;
    }

    private String generateRuleFilterXml(StyleRuleDto rule) throws CustomException {
        if (rule.getFilter() == null) return "";
        if (rule.getFilter().getOperator() == null)
            throw new CustomException("style.rule.filter.operator.is_null.error");
        if (rule.getFilter().getValue() == null) throw new CustomException("style.rule.filter.value.is_null.error");
        if (rule.getFilter().getColumn() == null) throw new CustomException("style.rule.filter.column.is_null.error");
        if (rule.getFilter().getColumn().getAttrname() == null)
            throw new CustomException("style.rule.filter.attrname.is_null.error");
        if (rule.getFilter().getColumn().getAttrtype() == null)
            throw new CustomException("style.rule.filter.attrtype.is_null.error");

        StyleFilterDto filterDto = rule.getFilter();
        String operatorTagName = getFilterOperatorTagName(filterDto);
        String xml = "<Filter xmlns=\"http://www.opengis.net/ogc\">";
        xml += "<" + operatorTagName + ">";
        xml += "<PropertyName>" + filterDto.getColumn().getAttrname() + "</PropertyName>";
        xml += "<Literal>" + filterDto.getValue() + "</Literal>\n";
        xml += "</" + operatorTagName + ">";
        xml += "</Filter>";
        return xml;
    }

    private String getFilterOperatorTagName(StyleFilterDto filterDto) throws CustomException {
        if (filterDto.getOperator().equals("==")) {
            return "PropertyIsEqualTo";
        } else if (filterDto.getOperator().equals("!=")) {
            return "PropertyIsNotEqualTo";
//        } else if (filterDto.getColumn().getAttrtype().equals(AttrType.VARCHAR) && filterDto.getOperator().equals("*=")) {
//            return "PropertyIsLike";
        } else {
            throw new CustomException("style.rule.filter.operator.not_valid.error", filterDto.getOperator());
        }
    }

    private void validateRule(StyleRuleDto rule, GeometryType geometryType) throws CustomException {
        if (rule.getName() == null || rule.getName().isBlank())
            throw new CustomException("style.rule.name.is_empty.error");
        if (geometryType == GeometryType.POINT || geometryType == GeometryType.MULTIPOINT) {
            if (rule.getImgSrc() == null) {
                if (rule.getFillColor() == null) throw new CustomException("style.rule.fill_color.is_null.error");
            } else {
                if (rule.getImgFormat() == null) throw new CustomException("style.rule.img_format.is_null.error");
            }
            if (rule.getPointRadius() == null) throw new CustomException("style.rule.point_radius.is_null.error");
        } else {
            if (rule.getStrokeColor() == null) throw new CustomException("style.rule.stroke_color.is_null.error");
            if (rule.getStrokeWidth() == null) throw new CustomException("style.rule.stroke_width.is_null.error");
        }
    }
}