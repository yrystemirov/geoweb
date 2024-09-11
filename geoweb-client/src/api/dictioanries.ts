import instance from "../utils/axios/instance";
import { DictionaryDto, EntryDto, EntryRequestDto } from "./types/dictioanries";
import { Pages, PaginationRequest } from "./types/page";

const getDictionaries = (pagination?: PaginationRequest) => {
  return instance.get<Pages<DictionaryDto>>("/dictionaries", {
    data: pagination,
  });
};

const getEntries = (dictionaryId: string, params?: PaginationRequest) => {
    return instance.get<Pages<EntryDto>>(`/dictionaries/${dictionaryId}/entries/page`, { params });
};

const addEntry = (entry: Partial<EntryRequestDto>) => {
  return instance.post<EntryDto>('/entries', entry);
};

const updateEntry = (entry: EntryRequestDto) => {
    return instance.put<EntryDto>(`/entries/${entry.id}`, entry);
};

const deleteEntry = (entryId: string) => {
    return instance.delete(`/entries/${entryId}`);
}

export const dictionariesAPI = {
  addEntry,
  deleteEntry,
  getDictionaries,
  getEntries,
  updateEntry,
};
