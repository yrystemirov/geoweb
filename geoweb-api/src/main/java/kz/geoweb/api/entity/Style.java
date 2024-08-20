package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import kz.geoweb.api.entity.base.IdEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Style extends IdEntity {
    private String styleName;
    private String styleJson;
}
