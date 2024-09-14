package kz.geoweb.api.dto;

import lombok.Data;

@Data
public class FeatureFileDto {
    private String id;
    private String layername;
    private Integer gid;
    private String filename;
    private String contentType;
    private Integer size;
    private String minioBucket;
    private String minioObject;
}
