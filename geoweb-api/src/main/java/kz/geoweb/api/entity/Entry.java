package kz.geoweb.api.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import kz.geoweb.api.entity.base.IdEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Entry extends IdEntity {
    private String code;
    private String kk;
    private String ru;
    private String en;
    @ManyToOne
    private Dictionary dictionary;
    private Integer rank;
}
