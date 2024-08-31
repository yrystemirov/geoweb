package kz.geoweb.api.service.impl;

import kz.geoweb.api.dto.DictionaryDto;
import kz.geoweb.api.entity.Dictionary;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.DictionaryMapper;
import kz.geoweb.api.repository.DictionaryRepository;
import kz.geoweb.api.service.DictionaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DictionaryServiceImpl implements DictionaryService {
    private final DictionaryRepository dictionaryRepository;
    private final DictionaryMapper dictionaryMapper;

    private Dictionary getEntityById(UUID id) {
        return dictionaryRepository.findById(id)
                .orElseThrow(() -> new CustomException("dictionary.by_id.not_found", id.toString()));
    }

    @Override
    public Page<DictionaryDto> getDictionaries(Pageable pageable) {
        return dictionaryRepository.findAll(pageable).map(dictionaryMapper::toDto);
    }

    @Override
    public DictionaryDto getDictionary(UUID id) {
        return dictionaryMapper.toDto(getEntityById(id));
    }

    @Override
    public DictionaryDto createDictionary(DictionaryDto dictionaryDto) {
        Dictionary dictionary = dictionaryMapper.toEntity(dictionaryDto);
        Dictionary created = dictionaryRepository.save(dictionary);
        return dictionaryMapper.toDto(created);
    }

    @Override
    public DictionaryDto updateDictionary(UUID id, DictionaryDto dictionaryDto) {
        Dictionary dictionary = getEntityById(id);
        dictionary.setCode(dictionaryDto.getCode());
        dictionary.setNameKk(dictionaryDto.getNameKk());
        dictionary.setNameRu(dictionaryDto.getNameRu());
        dictionary.setNameEn(dictionaryDto.getNameEn());
        Dictionary updated = dictionaryRepository.save(dictionary);
        return dictionaryMapper.toDto(updated);
    }

    @Override
    public void deleteDictionary(UUID id) {
        getEntityById(id);
        dictionaryRepository.deleteById(id);
    }
}
