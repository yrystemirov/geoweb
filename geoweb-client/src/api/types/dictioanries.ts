export type DictionaryDto = {
  id: string;
  code: string;
  nameKk: string;
  nameRu: string;
  nameEn: string;
};

export type EntryDto = {
  id: string;
  code: string;
  kk: string;
  ru: string;
  en: string;
  rank: number;
};

export type EntryRequestDto = Partial<Pick<EntryDto, 'id' | 'kk' | 'ru' | 'en' | 'rank'>> & Omit<EntryDto, 'code'> & {
    dictionaryId: string;
};