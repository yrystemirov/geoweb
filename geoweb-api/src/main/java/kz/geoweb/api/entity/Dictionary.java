package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import kz.geoweb.api.entity.base.IdEntity;
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
}
