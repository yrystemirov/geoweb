package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.dto.FolderTreeDto;
import kz.geoweb.api.entity.Folder;
import kz.geoweb.api.entity.Layer;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.exception.ForbiddenException;
import kz.geoweb.api.mapper.FolderMapper;
import kz.geoweb.api.repository.FolderRepository;
import kz.geoweb.api.service.EntityPermissionService;
import kz.geoweb.api.service.EntityUpdateHistoryService;
import kz.geoweb.api.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {
    private final FolderRepository folderRepository;
    private final FolderMapper folderMapper;
    private final EntityUpdateHistoryService historyService;
    private final EntityPermissionService entityPermissionService;

    private Folder getEntityById(UUID id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new CustomException("folder.by_id.not_found", id.toString()));
    }

    @Override
    public FolderDto getFolder(UUID id) {
        entityPermissionService.checkFolderRead(id);
        return folderMapper.toDto(getEntityById(id));
    }

    @Override
    public Set<FolderDto> getRootFolders() {
        Set<Folder> folders = folderRepository.findByParentIdIsNullOrderByRank();
        Set<Folder> foldersToRemove = new HashSet<>();
        for (Folder folder : folders) {
            try {
                entityPermissionService.checkFolderRead(folder.getId());
            } catch (ForbiddenException e) {
                foldersToRemove.add(folder);
            }
        }
        folders.removeAll(foldersToRemove);
        return folderMapper.toDto(folders);
    }

    @Override
    public Set<FolderDto> getPublicRootFolders() {
        Set<Folder> folders = folderRepository.findByIsPublicIsTrueAndParentIdIsNullOrderByRank();
        return folderMapper.toDto(folders);
    }

    @Override
    public FolderTreeDto getFolderTree(UUID id) {
        entityPermissionService.checkFolderRead(id);
        Folder folder = getEntityById(id);
        removeForbidden(folder);
        return folderMapper.toFolderTreeDto(folder);
    }

    private void removeForbidden(Folder folder) {
        Set<Folder> children = folder.getChildren();
        Set<Folder> childrenToRemove = new HashSet<>();
        for (Folder child : children) {
            try {
                entityPermissionService.checkFolderRead(child.getId());
                removeForbidden(child);
                Set<Layer> layersToRemove = new HashSet<>();
                for (Layer layer : child.getLayers()) {
                    try {
                        entityPermissionService.checkLayerRead(layer.getId());
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
                Set<Layer> layersToRemove = new HashSet<>();
                for (Layer layer : child.getLayers()) {
                    if (!layer.getIsPublic()) {
                        layersToRemove.add(layer);
                    }
                }
                child.getLayers().removeAll(layersToRemove);
            }
        }
        children.removeAll(childrenToRemove);
    }

    @Override
    public FolderDto createFolder(FolderDto folderDto) {
        folderDto.setId(null);
        Folder folder = folderMapper.toEntity(folderDto);
        Folder created = folderRepository.save(folder);
        historyService.saveFolder(created.getId(), Action.CREATE);
        return folderMapper.toDto(created);
    }

    @Override
    public FolderDto updateFolder(UUID id, FolderDto folderDto) {
        entityPermissionService.checkFolderWrite(id);
        Folder folder = getEntityById(id);
        folder.setNameKk(folderDto.getNameKk());
        folder.setNameRu(folderDto.getNameRu());
        folder.setNameEn(folderDto.getNameEn());
        folder.setImgUrl(folderDto.getImgUrl());
        folder.setDescriptionKk(folderDto.getDescriptionKk());
        folder.setDescriptionRu(folderDto.getDescriptionRu());
        folder.setDescriptionEn(folderDto.getDescriptionEn());
        folder.setIsPublic(folderDto.getIsPublic());
        folder.setRank(folderDto.getRank());
        Folder updated = folderRepository.save(folder);
        historyService.saveFolder(updated.getId(), Action.UPDATE);
        return folderMapper.toDto(updated);
    }

    @Override
    public void deleteFolder(UUID id) {
        entityPermissionService.checkFolderWrite(id);
        getEntityById(id);
        folderRepository.deleteById(id);
        historyService.saveFolder(id, Action.DELETE);
    }
}
