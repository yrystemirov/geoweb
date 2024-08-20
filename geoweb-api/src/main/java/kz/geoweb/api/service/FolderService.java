package kz.geoweb.api.service;

import kz.geoweb.api.dto.FolderDto;

import java.util.Set;
import java.util.UUID;

public interface FolderService {
    FolderDto getFolderById(UUID id);
    Set<FolderDto> getFoldersByParentId(UUID parentId);
    FolderDto createFolder(FolderDto folderDto);
    FolderDto updateFolder(UUID id, FolderDto folderDto);
    void deleteFolder(UUID id);
}
