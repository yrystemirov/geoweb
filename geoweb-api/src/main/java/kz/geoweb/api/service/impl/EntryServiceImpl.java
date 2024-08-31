package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.dto.EntryRequestDto;
import kz.geoweb.api.entity.Dictionary;
import kz.geoweb.api.entity.Entry;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.EntryMapper;
import kz.geoweb.api.repository.DictionaryRepository;
import kz.geoweb.api.repository.EntryRepository;
import kz.geoweb.api.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EntryServiceImpl implements EntryService {
    private final EntryRepository entryRepository;
    private final EntryMapper entryMapper;
    private final DictionaryRepository dictionaryRepository;

    private Entry getEntityById(UUID id) {
        return entryRepository.findById(id)
                .orElseThrow(() -> new CustomException("entry.by_id.not_found", id.toString()));
    }

    private Dictionary getDictionaryEntityById(UUID id) {
        return dictionaryRepository.findById(id)
                .orElseThrow(() -> new CustomException("dictionary.by_id.not_found", id.toString()));
    }

    @Override
    public List<EntryDto> getEntries(UUID dictionaryId) {
        List<Entry> entries = entryRepository.findByDictionaryIdOrderByRank(dictionaryId);
        return entryMapper.toDto(entries);
    }

    @Override
    public Page<EntryDto> getEntries(UUID dictionaryId, Pageable pageable) {
        return entryRepository.findByDictionaryIdOrderByRank(dictionaryId, pageable).map(entryMapper::toDto);
    }

    @Override
    public EntryDto getEntry(UUID id) {
        return entryMapper.toDto(getEntityById(id));
    }

    @Override
    public EntryDto createEntry(EntryRequestDto entryRequestDto) {
        Entry entry = entryMapper.toEntity(entryRequestDto);
        Entry created = entryRepository.save(entry);
        return entryMapper.toDto(created);
    }

    @Override
    public EntryDto updateEntry(UUID id, EntryRequestDto entryRequestDto) {
        Entry entry = getEntityById(id);
        entry.setCode(entryRequestDto.getCode());
        entry.setKk(entryRequestDto.getKk());
        entry.setRu(entryRequestDto.getRu());
        entry.setEn(entryRequestDto.getEn());
        entry.setRank(entryRequestDto.getRank());
        Entry updated = entryRepository.save(entry);
        return entryMapper.toDto(updated);
    }

    @Override
    public void deleteEntry(UUID id) {
        getEntityById(id);
        entryRepository.deleteById(id);
    }
}
