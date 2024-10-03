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
  // styleId: string; // пока не используется
  url: string;
  baseLayer: boolean;
  checkIntersection: boolean;
  isBlockLayer: boolean;
  isDynamic: boolean;
  isPublic: boolean;
  folders: FolderDto[];
  // dynamicIdentityColumn: string; // пока не используется
};

export type LayerRequestDto = Partial<Omit<LayerDto, 'id'>> & {
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
    id: string,
    nameKk: string,
    nameRu: string,
    nameEn: string,
    attrname: string,
    attrType: string,
    shortInfo: true,
    fullInfo: true,
    layer: LayerDto,
    dictionaryCode: string,
    rank: number
  }