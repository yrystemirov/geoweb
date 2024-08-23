package kz.geoweb.api.controller;

import kz.geoweb.api.dto.FolderDto;
import kz.geoweb.api.dto.FolderTreeDto;
import kz.geoweb.api.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/folders")
@RequiredArgsConstructor
public class FolderController {
    private final FolderService folderService;

    @GetMapping("/{id}")
    public FolderDto getFolder(@PathVariable UUID id) {
        return folderService.getFolder(id);
    }

    @GetMapping("/root")
    public Set<FolderDto> getRoot() {
        return folderService.getFolderChildren(null);
    }

    @GetMapping("/{id}/children")
    public Set<FolderDto> getRoot(@PathVariable UUID id) {
        return folderService.getFolderChildren(id);
    }

    @GetMapping("/{id}/tree")
    public FolderTreeDto getFolderTree(@PathVariable UUID id) {
        return folderService.getFolderTree(id);
    }

    @PostMapping
    public FolderDto createFolder(@RequestBody FolderDto folderDto) {
        return folderService.createFolder(folderDto);
    }

    @PutMapping("/{id}")
    public FolderDto updateFolder(@PathVariable UUID id,
                                  @RequestBody FolderDto folderDto) {
        return folderService.updateFolder(id, folderDto);
    }

    @DeleteMapping("/{id}")
    public void deleteFolder(@PathVariable UUID id) {
        folderService.deleteFolder(id);
    }
}
