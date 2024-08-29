package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.AttrType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class LayerAttr extends IdEntity {
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String attrname;
    @Enumerated(EnumType.STRING)
    private AttrType attrType;
    private Boolean shortInfo;
    private Boolean fullInfo;
    @ManyToOne
    private Layer layer;
    private String dictionaryCode;
    private Integer rank;
}
