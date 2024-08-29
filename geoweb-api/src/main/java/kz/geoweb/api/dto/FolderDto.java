package kz.geoweb.api.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class FolderDto {
    private UUID id;
    private String nameKk;
    private String nameRu;
    private String nameEn;
    private String descriptionKk;
    private String descriptionRu;
    private String descriptionEn;
    private FolderDto parent;
    private Boolean isPublic = false;
    private String imgUrl;
    private Integer rank;
}
