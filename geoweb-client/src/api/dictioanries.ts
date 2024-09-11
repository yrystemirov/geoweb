import instance from '../utils/axios/instance';
import { DictionaryDto, EntryDto, EntryRequestDto } from './types/dictioanries';
import { Pages, PaginationRequest } from './types/page';

const DICTS_URL = '/dictionaries';
const ENTRIES_URL = '/entries';

const getDictionary = (dictionaryId: string) => {
  return instance.get<DictionaryDto>(`${DICTS_URL}/${dictionaryId}`);
};

const getDictionaries = (pagination?: PaginationRequest) => {
  return instance.get<Pages<DictionaryDto>>(DICTS_URL, {
    data: pagination,
  });
};

const addDictionary = (dictionary: Partial<DictionaryDto>) => {
  return instance.post<DictionaryDto>(DICTS_URL, dictionary);
};

const updateDictionary = (dictionary: DictionaryDto) => {
  return instance.put<DictionaryDto>(`${DICTS_URL}/${dictionary.id}`, dictionary);
};

const deleteDictionary = (dictionaryId: string) => {
  return instance.delete(`${DICTS_URL}/${dictionaryId}`);
};

const getEntries = (dictionaryId: string, params?: PaginationRequest) => {
  return instance.get<Pages<EntryDto>>(`${DICTS_URL}/${dictionaryId}/entries/page`, { params });
};

const addEntry = (entry: Partial<EntryRequestDto>) => {
  return instance.post<EntryDto>(ENTRIES_URL, entry);
};

const updateEntry = (entry: EntryRequestDto) => {
  return instance.put<EntryDto>(`${ENTRIES_URL}/${entry.id}`, entry);
};

const deleteEntry = (entryId: string) => {
  return instance.delete(`${ENTRIES_URL}/${entryId}`);
};

export const dictionariesAPI = {
  addDictionary,
  addEntry,
  deleteDictionary,
  deleteEntry,
  getDictionaries,
  getDictionary,
  getEntries,
  updateDictionary,
  updateEntry,
};
