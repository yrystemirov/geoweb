package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.FolderRequestDto;
import kz.geoweb.api.dto.FolderInfoDto;
import kz.geoweb.api.dto.FolderTreeDto;
import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.entity.Folder;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.enums.EntityType;
import kz.geoweb.api.enums.Permission;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.exception.ForbiddenException;
import kz.geoweb.api.mapper.FolderMapper;
import kz.geoweb.api.mapper.LayerMapper;
import kz.geoweb.api.repository.FolderRepository;
import kz.geoweb.api.service.EntityPermissionService;
import kz.geoweb.api.service.EntityUpdateHistoryService;
import kz.geoweb.api.service.FolderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FolderServiceImpl implements FolderService {
    private final FolderRepository folderRepository;
    private final FolderMapper folderMapper;
    private final LayerMapper layerMapper;
    private final EntityUpdateHistoryService historyService;
    private final EntityPermissionService entityPermissionService;

    private Folder getEntityById(UUID id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new CustomException("folder.by_id.not_found", id.toString()));
    }

    @Override
    public FolderDto getFolder(UUID id) {
        boolean hasPermission = entityPermissionService.hasPermission(EntityType.FOLDER, id, Permission.READ);
        if (!hasPermission) {
            throw new ForbiddenException("folder.read.forbidden");
        }
        return folderMapper.toFolderWithLayersDto(getEntityById(id));
    }

    @Override
    public Set<FolderInfoDto> getRootFolders() {
        Set<Folder> folders = folderRepository.findByParentIdIsNullOrderByRank();
        Set<Folder> foldersToRemove = new HashSet<>();
        for (Folder folder : folders) {
            try {
                boolean hasPermission = entityPermissionService.hasPermission(EntityType.FOLDER, folder.getId(), Permission.READ);
                if (!hasPermission) {
                    throw new ForbiddenException("folder.read.forbidden");
                }
            } catch (ForbiddenException e) {
                foldersToRemove.add(folder);
            }
        }
        folders.removeAll(foldersToRemove);
        return folderMapper.toFolderInfoDto(folders);
    }

    @Override
    public Set<FolderInfoDto> getPublicRootFolders() {
        Set<Folder> folders = folderRepository.findByIsPublicIsTrueAndParentIdIsNullOrderByRank();
        return folderMapper.toFolderInfoDto(folders);
    }

    @Override
    public FolderTreeDto getFolderTree(UUID id) {
        boolean hasPermission = entityPermissionService.hasPermission(EntityType.FOLDER, id, Permission.READ);
        if (!hasPermission) {
            throw new ForbiddenException("folder.read.forbidden");
        }
        Folder folder = getEntityById(id);
        removeForbidden(folder);
        return folderMapper.toFolderTreeDto(folder);
    }

    private void removeForbidden(Folder folder) {
        Set<Folder> children = folder.getChildren();
        Set<Folder> childrenToRemove = new HashSet<>();
        for (Folder child : children) {
            try {
                boolean hasPermission = entityPermissionService.hasPermission(EntityType.FOLDER, child.getId(), Permission.READ);
                if (!hasPermission) {
                    throw new ForbiddenException("folder.read.forbidden");
                }
                removeForbidden(child);
                Set<Layer> layersToRemove = new HashSet<>();
                for (Layer layer : child.getLayers()) {
                    try {
                        boolean hasPermissionLayer = entityPermissionService.hasPermission(EntityType.LAYER, layer.getId(), Permission.READ);
                        if (!hasPermissionLayer) {
                            throw new ForbiddenException("layer.read.forbidden");
                        }
                    } catch (ForbiddenException e) {
                        layersToRemove.add(layer);
                    }
                }
                child.getLayers().removeAll(layersToRemove);
            } catch (ForbiddenException e) {
                childrenToRemove.add(child);
            }
        }
        children.removeAll(childrenToRemove);
    }

    @Override
    public FolderTreeDto getPublicFolderTree(UUID id) {
        Folder folder = getEntityById(id);
        if (!folder.getIsPublic()) {
            throw new ForbiddenException("folder.is_not_public");
        }
        removeNotPublic(folder);
        return folderMapper.toFolderTreeDto(folder);
    }

    private void removeNotPublic(Folder folder) {
        Set<Folder> children = folder.getChildren();
        Set<Folder> childrenToRemove = new HashSet<>();
        for (Folder child : children) {
            if (!child.getIsPublic()) {
                childrenToRemove.add(child);
            } else {
                removeNotPublic(child);
            }
        }
        children.removeAll(childrenToRemove);
        Set<Layer> layersToRemove = new HashSet<>();
        for (Layer layer : folder.getLayers()) {
            if (!layer.getIsPublic()) {
                layersToRemove.add(layer);
            }
        }
        folder.getLayers().removeAll(layersToRemove);
    }

    @Override
    public FolderDto createFolder(FolderRequestDto folderRequestDto) {
        folderRequestDto.setId(null);
        Folder folder = folderMapper.toEntity(folderRequestDto);
        Folder created = folderRepository.save(folder);
        historyService.saveFolder(created.getId(), Action.CREATE);
        return folderMapper.toFolderWithLayersDto(created);
    }

    @Override
    public FolderDto updateFolder(UUID id, FolderRequestDto folderRequestDto) {
        boolean hasPermission = entityPermissionService.hasPermission(EntityType.FOLDER, id, Permission.WRITE);
        if (!hasPermission) {
            throw new ForbiddenException("folder.update.forbidden");
        }
        Folder folder = getEntityById(id);
        folder.setNameKk(folderRequestDto.getNameKk());
        folder.setNameRu(folderRequestDto.getNameRu());
        folder.setNameEn(folderRequestDto.getNameEn());
        folder.setImgUrl(folderRequestDto.getImgUrl());
        folder.setDescriptionKk(folderRequestDto.getDescriptionKk());
        folder.setDescriptionRu(folderRequestDto.getDescriptionRu());
        folder.setDescriptionEn(folderRequestDto.getDescriptionEn());
        folder.setIsPublic(folderRequestDto.getIsPublic());
        folder.setRank(folderRequestDto.getRank());
        folder.setLayers(layerMapper.toEntity(folderRequestDto.getLayers()));
        Folder updated = folderRepository.save(folder);
        historyService.saveFolder(updated.getId(), Action.UPDATE);
        return folderMapper.toFolderWithLayersDto(updated);
    }

    @Override
    public void deleteFolder(UUID id) {
        boolean hasPermission = entityPermissionService.hasPermission(EntityType.FOLDER, id, Permission.WRITE);
        if (!hasPermission) {
            throw new ForbiddenException("folder.delete.forbidden");
        }
        getEntityById(id);
        folderRepository.deleteById(id);
        historyService.saveFolder(id, Action.DELETE);
    }
}
