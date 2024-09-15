package kz.geoweb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StyleRuleDto {
    private String name;
    private Double strokeWidth;
    private String strokeColor;
    private Double strokeColorOpacity;
    private String fillColor;
    private Double fillColorOpacity;
    private String pointShape = "circle";
    private Double pointRadius;
    private Double scaleMin;
    private Double scaleMax;
    private String imgFormat;
    private String imgSrc;
    private boolean dashedLine;
    private Integer dashLineLength;
    private Integer dashLinePoint;
    private StyleFilterDto filter;
    private List<StyleRasterColorDto> rasterColors = new ArrayList<>();

    private boolean hasTextSymbolizer;
    private String textSymbolizerAttrName;
    private Integer textSymbolizerDisplacementX;
    private Integer textSymbolizerDisplacementY;
    private Integer textSymbolizerRotation;
    private String textSymbolizerFillColor;
    private Integer textSymbolizerFillColorOpacity;
    private double anchorpointX;
    private double anchorpointY;
    private String fontFamily;
    private Integer fontSize;
    private String fontStyle;
    private String fontWeight;

    private boolean cluster;
    private String clusterTitle;
    private Integer clusterGreaterThanOrEqual = 0;
    private Integer clusterLessThanOrEqual = Integer.MAX_VALUE;
    private Integer clusterPointSize;
    private String clusterTextType;
    private Integer clusterTextSize;
    private String clusterTextWeight;
    private String clusterTextColor;
    private double clusterTextColorOpacity;
    private Double clusterAnchorPointX;
    private Double clusterAnchorPointY;
    private Integer clusterTextHaloRadius;
    private String clusterTextHaloFillColor;
    private String clusterTextHaloFillOpacityWeight;

    private boolean dashed;
    private Integer strokeDashLength;
    private Integer strokeSpaceLength;
}
