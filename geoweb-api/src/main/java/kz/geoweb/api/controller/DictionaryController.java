package kz.geoweb.api.controller;

import kz.geoweb.api.dto.DictionaryDto;
import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.service.DictionaryService;
import kz.geoweb.api.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dictionaries")
@RequiredArgsConstructor
public class DictionaryController {
    private final DictionaryService dictionaryService;
    private final EntryService entryService;

    @GetMapping
    public Page<DictionaryDto> getDictionaries(Pageable pageable) {
        return dictionaryService.getDictionaries(pageable);
    }

    @GetMapping("/{id}")
    public DictionaryDto getDictionary(@PathVariable UUID id) {
        return dictionaryService.getDictionary(id);
    }

    @PostMapping
    public DictionaryDto createDictionary(@RequestBody DictionaryDto dictionaryDto) {
        return dictionaryService.createDictionary(dictionaryDto);
    }

    @PutMapping("/{id}")
    public DictionaryDto updateDictionary(@PathVariable UUID id,
                                          @RequestBody DictionaryDto dictionaryDto) {
        return dictionaryService.updateDictionary(id, dictionaryDto);
    }

    @DeleteMapping("/{id}")
    public void deleteDictionary(@PathVariable UUID id) {
        dictionaryService.deleteDictionary(id);
    }

    @GetMapping("/{id}/entries")
    public List<EntryDto> getEntries(@PathVariable UUID id) {
        return entryService.getEntries(id);
    }

    @GetMapping("/{id}/entries/page")
    public Page<EntryDto> getEntries(@PathVariable UUID id,
                                     Pageable pageable) {
        return entryService.getEntries(id, pageable);
    }
}
