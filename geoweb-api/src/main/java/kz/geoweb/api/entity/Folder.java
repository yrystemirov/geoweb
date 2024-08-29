package kz.geoweb.api.entity;

import jakarta.persistence.*;
import kz.geoweb.api.entity.base.IdEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@Entity
public class Folder extends IdEntity {
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String descriptionKk;
    private String descriptionRu;
    private String descriptionEn;
    @ManyToOne
    private Folder parent;
    @OneToMany(mappedBy = "parent", fetch = FetchType.EAGER)
    @OrderBy("nameRu ASC")
    private Set<Folder> children;
    private Boolean isPublic;
    private String imgUrl;
    private Integer rank;
}
