package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.dto.FolderTreeDto;
import kz.geoweb.api.entity.Folder;
import kz.geoweb.api.enums.Action;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.FolderMapper;
import kz.geoweb.api.repository.FolderRepository;
import kz.geoweb.api.service.EntityPermissionService;
import kz.geoweb.api.service.EntityUpdateHistoryService;
import kz.geoweb.api.service.FolderService;
import kz.geoweb.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {
    private final FolderRepository folderRepository;
    private final FolderMapper folderMapper;
    private final EntityUpdateHistoryService historyService;
    private final UserService userService;
    private final EntityPermissionService entityPermissionService;

    private Folder getEntityById(UUID id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new CustomException("folder.by_id.not_found", id.toString()));
    }

    @Override
    public FolderDto getFolder(UUID id) {
        Set<UUID> roleIds = userService.getCurrentUserRoleIds();
        entityPermissionService.checkFolderRead(id, roleIds);
        return folderMapper.toDto(getEntityById(id));
    }

    @Override
    public Set<FolderDto> getFolderChildren(UUID parentId) {
        Set<UUID> roleIds = userService.getCurrentUserRoleIds();
        entityPermissionService.checkFolderRead(parentId, roleIds);
        return folderMapper.toDto(folderRepository.findByParentIdOrderByRank(parentId));
    }

    @Override
    public FolderTreeDto getFolderTree(UUID id) {
        Set<UUID> roleIds = userService.getCurrentUserRoleIds();
        entityPermissionService.checkFolderRead(id, roleIds);
        return folderMapper.toFolderTreeDto(getEntityById(id));
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
        Set<UUID> roleIds = userService.getCurrentUserRoleIds();
        entityPermissionService.checkFolderWrite(id, roleIds);
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
        Set<UUID> roleIds = userService.getCurrentUserRoleIds();
        entityPermissionService.checkFolderWrite(id, roleIds);
        getEntityById(id);
        folderRepository.deleteById(id);
        historyService.saveFolder(id, Action.DELETE);
    }
}
