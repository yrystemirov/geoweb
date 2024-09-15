package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.ConfigType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Config extends IdEntity {
    @Enumerated(EnumType.STRING)
    private ConfigType configType;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String configData;
}
