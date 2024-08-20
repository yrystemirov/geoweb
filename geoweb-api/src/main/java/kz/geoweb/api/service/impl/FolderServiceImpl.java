package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.entity.Folder;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.FolderMapper;
import kz.geoweb.api.repository.FolderRepository;
import kz.geoweb.api.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FolderServiceImpl implements FolderService {
    private final FolderRepository folderRepository;
    private final FolderMapper folderMapper;

    private Folder getEntityById(UUID id) {
        return folderRepository.findById(id)
                .orElseThrow(() -> new CustomException("folder.by_id.not_found", id.toString()));
    }

    @Override
    public FolderDto getFolder(UUID id) {
        return folderMapper.toDto(getEntityById(id));
    }

    @Override
    public Set<FolderDto> getFolderChildren(UUID parentId) {
        return folderMapper.toDto(folderRepository.findByParentId(parentId));
    }

    @Override
    public FolderDto createFolder(FolderDto folderDto) {
        folderDto.setId(null);
        Folder folder = folderMapper.toEntity(folderDto);
        // TODO: update history
        return folderMapper.toDto(folderRepository.save(folder));
    }

    @Override
    public FolderDto updateFolder(UUID id, FolderDto folderDto) {
        Folder dbFolder = getEntityById(id);
        dbFolder.setNameKk(folderDto.getNameKk());
        dbFolder.setNameRu(folderDto.getNameRu());
        dbFolder.setNameEn(folderDto.getNameEn());
        dbFolder.setImgUrl(folderDto.getImgUrl());
        dbFolder.setDescriptionKk(folderDto.getDescriptionKk());
        dbFolder.setDescriptionRu(folderDto.getDescriptionRu());
        dbFolder.setDescriptionEn(folderDto.getDescriptionEn());
        dbFolder.setIsPublic(folderDto.getIsPublic());
        dbFolder.setOrderNumber(folderDto.getOrderNumber());
        // TODO: update history
        return folderMapper.toDto(folderRepository.save(dbFolder));
    }

    @Override
    public void deleteFolder(UUID id) {
        getEntityById(id);
        folderRepository.deleteById(id);
        // TODO: update history
    }
}
