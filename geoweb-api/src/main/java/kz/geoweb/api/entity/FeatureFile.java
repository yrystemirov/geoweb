package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import kz.geoweb.api.entity.base.IdEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class FeatureFile extends IdEntity {
    private String layername;
    private Integer gid;
    private String filename;
    private String contentType;
    private Integer size;
    private String minioBucket;
    private String minioObject;
}
