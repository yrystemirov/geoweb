package kz.geoweb.api.entity;

import jakarta.persistence.*;
import kz.geoweb.api.entity.base.IdEntity;
import kz.geoweb.api.enums.GeometryType;
import kz.geoweb.api.enums.LayerType;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Entity
public class Layer extends IdEntity {
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String descriptionKk;
    private String descriptionRu;
    private String descriptionEn;
    private String layername;
    @Enumerated(EnumType.STRING)
    private GeometryType geometryType;
    @Enumerated(EnumType.STRING)
    private LayerType layerType;
    private UUID styleId;
    private String url;
    private Boolean baseLayer;
    private Boolean checkIntersection;
    private Boolean isBlockLayer;
    private Boolean isDynamic;
    private Boolean isPublic;
    private String dynamicIdentityColumn;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "folder_layer",
            joinColumns = @JoinColumn(name = "layer_id"),
            inverseJoinColumns = @JoinColumn(name = "folder_id"))
    private Set<Folder> folders;
}
