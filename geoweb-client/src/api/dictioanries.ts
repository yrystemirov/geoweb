import instance from '../utils/axios/instance';
import { DictionaryDto, EntryDto } from './types/dictioanries';
import { Pages, PaginationRequest } from './types/page';

const getDictionaries = (pagination?: PaginationRequest) => {
  return instance.get<Pages<DictionaryDto>>('/dictionaries', {
    data: pagination,
  });
};

const getEntries = (dictionaryId: string, params?: PaginationRequest) => {
  return instance.get<Pages<EntryDto>>(`/dictionaries/${dictionaryId}/entries/page`, {
    params,
  });
};

export const dictionariesAPI = {
  getDictionaries,
  getEntries,
};
