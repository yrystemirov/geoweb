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
  dictionary: DictionaryDto;
  rank: number;
};
