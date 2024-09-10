package kz.geoweb.api.service;

import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.dto.EntryCreateDto;
import kz.geoweb.api.dto.EntryUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface EntryService {
    List<EntryDto> getEntries(UUID dictionaryId, String search);

    Page<EntryDto> getEntries(UUID dictionaryId, String search, Pageable pageable);

    EntryDto getEntry(UUID id);

    EntryDto createEntry(EntryCreateDto entryCreateDto);

    EntryDto updateEntry(UUID id, EntryUpdateDto entryUpdateDto);

    void deleteEntry(UUID id);
}
