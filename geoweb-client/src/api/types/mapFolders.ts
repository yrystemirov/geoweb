export type FolderDto = {
  id: string;
  nameKk: string;
  nameRu: string;
  nameEn: string;
  descriptionKk: string;
  descriptionRu: string;
  descriptionEn: string;
  parent: FolderDto | null;
  isPublic: boolean;
  imgUrl: string;
  rank: number;
};

export type LayerDto = {
  id: string;
  nameKk: string;
  nameRu: string;
  nameEn: string;
  descriptionKk: string;
  descriptionRu: string;
  descriptionEn: string;
  layername: string;
  geometryType: GeometryType;
  layerType: LayerType;
  styleId?: string;
  url: string;
  isPublic: boolean;
  folders: FolderDto[];
};

export type LayerRequestDto = NullableFields<
  Partial<Omit<LayerDto, 'id'>>,
  'nameEn' | 'descriptionRu' | 'descriptionKk' | 'descriptionEn' | 'url'
> & {
  nameKk: string;
  nameRu: string;
  layerType: LayerType;
  layername: string;
  geometryType: GeometryType;
  folders: { id: string }[];
};

export enum GeometryType {
  POINT = 'POINT',
  LINESTRING = 'LINESTRING',
  POLYGON = 'POLYGON',
  MULTIPOINT = 'MULTIPOINT',
  MULTILINESTRING = 'MULTILINESTRING',
  MULTIPOLYGON = 'MULTIPOLYGON',
  RASTER = 'RASTER',
}

export enum LayerType {
  SIMPLE = 'SIMPLE',
  WMS = 'WMS',
  MAP_SERVER = 'MAP_SERVER',
  GEOJSON = 'GEOJSON',
  RASTER = 'RASTER',
}

export type FolderTreeDto = {
  id: string;
  nameKk: string;
  nameRu: string;
  nameEn: string;
  descriptionKk: string;
  descriptionRu: string;
  descriptionEn: string;
  isPublic: boolean;
  imgUrl: string;
  rank: number;
  children: FolderTreeDto[]; // or FolderDto[]?
  layers: LayerDto[];
};

export type LayerAttrDto = {
  id?: string;
  nameKk?: string;
  nameRu?: string;
  nameEn?: string;
  attrname: string;
  attrType?: AttrType;
  layer?: LayerDto;
  dictionaryCode?: string;
  rank?: number;
};

export enum AttrType {
  TEXT = 'TEXT',
  BIGINT = 'BIGINT',
  NUMERIC = 'NUMERIC',
  TIMESTAMP = 'TIMESTAMP',
  BOOLEAN = 'BOOLEAN',
  DICTIONARY = 'DICTIONARY',
}

type NullableFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | null;
};
