package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class FeatureFileResponseDto {
    private String id;
    private String layername;
    private Integer gid;
    private String filename;
    private String contentType;
    private Integer size;
    private String minioBucket;
    private String minioObject;
    private byte[] file;
}
