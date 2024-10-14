package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.AttrType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Dictionary extends IdEntity {
    private String code;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    @Enumerated(EnumType.STRING)
    private AttrType type;
}
