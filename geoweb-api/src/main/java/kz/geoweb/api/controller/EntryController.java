package kz.geoweb.api.controller;

import jakarta.validation.Valid;
import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.dto.EntryCreateDto;
import kz.geoweb.api.dto.EntryUpdateDto;
import kz.geoweb.api.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/entries")
@RequiredArgsConstructor
public class EntryController {
    private final EntryService entryService;

    @GetMapping("/{id}")
    public EntryDto getEntry(@PathVariable UUID id) {
        return entryService.getEntry(id);
    }

    @PostMapping
    public EntryDto createEntry(@RequestBody @Valid EntryCreateDto entryCreateDto) {
        return entryService.createEntry(entryCreateDto);
    }

    @PutMapping("/{id}")
    public EntryDto updateEntry(@PathVariable UUID id,
                                @RequestBody @Valid EntryUpdateDto entryUpdateDto) {
        return entryService.updateEntry(id, entryUpdateDto);
    }

    @DeleteMapping("/{id}")
    public void deleteEntry(@PathVariable UUID id) {
        entryService.deleteEntry(id);
    }
}
