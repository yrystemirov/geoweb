package kz.geoweb.api.dto;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
public class FolderTreeDto {
    private UUID id;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String descriptionKk;
    private String descriptionRu;
    private String descriptionEn;
    private Boolean isPublic = false;
    private String imgUrl;
    private Integer rank;
    private Set<FolderTreeDto> children = new HashSet<>();
    private Set<LayerDto> layers = new HashSet<>();
}
