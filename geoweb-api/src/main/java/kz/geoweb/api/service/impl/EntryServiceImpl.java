package kz.geoweb.api.service.impl;

import jakarta.persistence.criteria.Predicate;
import kz.geoweb.api.dto.EntryCreateDto;
import kz.geoweb.api.dto.EntryDto;
import kz.geoweb.api.dto.EntryUpdateDto;
import kz.geoweb.api.entity.Dictionary;
import kz.geoweb.api.entity.Entry;
import kz.geoweb.api.exception.CustomException;
import kz.geoweb.api.mapper.EntryMapper;
import kz.geoweb.api.repository.DictionaryRepository;
import kz.geoweb.api.repository.EntryRepository;
import kz.geoweb.api.service.EntryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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
    public List<EntryDto> getEntries(UUID dictionaryId, String search) {
        Specification<Entry> specification = getSearchSpecification(dictionaryId, search);
        Sort sort = Sort.by(Sort.Direction.ASC, "rank");
        List<Entry> entries = entryRepository.findAll(specification, sort);
        return entryMapper.toDto(entries);
    }

    @Override
    public Page<EntryDto> getEntries(UUID dictionaryId, String search, Pageable pageable) {
        Specification<Entry> specification = getSearchSpecification(dictionaryId, search);
        Sort sort = Sort.by(Sort.Direction.ASC, "rank");
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort().and(sort));
        return entryRepository.findAll(specification, sortedPageable).map(entryMapper::toDto);
    }

    @Override
    public EntryDto getEntry(UUID id) {
        return entryMapper.toDto(getEntityById(id));
    }

    @Override
    public EntryDto createEntry(EntryCreateDto entryCreateDto) {
        checkUniqueCode(entryCreateDto.getDictionaryId(), entryCreateDto.getCode());
        Entry entry = entryMapper.toEntity(entryCreateDto);
        Dictionary dictionary = getDictionaryEntityById(entryCreateDto.getDictionaryId());
        entry.setDictionary(dictionary);
        Entry created = entryRepository.save(entry);
        return entryMapper.toDto(created);
    }

    @Override
    public EntryDto updateEntry(UUID id, EntryUpdateDto entryUpdateDto) {
        Entry entry = getEntityById(id);
        boolean isCodeChanged = !entry.getCode().equals(entryUpdateDto.getCode());
        if (isCodeChanged) {
            checkUniqueCode(entry.getDictionary().getId(), entryUpdateDto.getCode());
        }
        entry.setCode(entryUpdateDto.getCode());
        entry.setKk(entryUpdateDto.getKk());
        entry.setRu(entryUpdateDto.getRu());
        entry.setEn(entryUpdateDto.getEn());
        entry.setRank(entryUpdateDto.getRank());
        Entry updated = entryRepository.save(entry);
        return entryMapper.toDto(updated);
    }

    @Override
    public void deleteEntry(UUID id) {
        getEntityById(id);
        entryRepository.deleteById(id);
    }

    private void checkUniqueCode(UUID dictionaryId, String code) {
        entryRepository.findFirstByDictionaryIdAndCode(dictionaryId, code)
                .ifPresent(entry -> {
                    throw new CustomException("entry.by_code.already_exists", code);
                });
    }

    private Specification<Entry> getSearchSpecification(UUID dictionaryId, String search) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(criteriaBuilder.equal(root.get("dictionary").get("id"), dictionaryId));

            if (search != null && !search.isBlank()) {
                String searchPattern = "%" + search.toLowerCase() + "%";
                Predicate codePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("code")), searchPattern);
                Predicate kkPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("kk")), searchPattern);
                Predicate ruPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("ru")), searchPattern);
                Predicate enPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("en")), searchPattern);
                Predicate searchPredicate = criteriaBuilder.or(codePredicate, kkPredicate, ruPredicate, enPredicate);
                predicates.add(searchPredicate);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
