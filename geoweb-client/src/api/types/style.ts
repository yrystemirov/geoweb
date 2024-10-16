import { AttrType, GeometryType } from './mapFolders';

export type StyleRequestDto = {
  name: string;
  geomType: GeometryType;
  rules: StyleRuleDto[];
  sld: string;
};

export type StyleRuleDto = {
  name: string; // common
  strokeWidth: number; // for line, polygon
  strokeColor: string; // for line, polygon
  strokeColorOpacity: number; // for line, polygon
  fillColor: string; // for point, polygon
  fillColorOpacity: number; // for point, polygon
  pointShape: string; // for point
  pointRadius: number; // for point
  scaleMin: number; // common
  scaleMax: number; // common
  imgFormat: string; // for point
  imgSrc: string; // for point
  dashedLine: boolean; // for line
  dashLineLength: number; // for line
  dashLinePoint: number; // for line
  filter: StyleFilterDto; // for point, line, polygon
  rasterColors: StyleRasterColorDto[]; // for raster

  hasTextSymbolizer: boolean; // for point, line, polygon
  // if hasTextSymbolizer is true group start
  textSymbolizerAttrName: string;
  textSymbolizerDisplacementX: number;
  textSymbolizerDisplacementY: number;
  textSymbolizerRotation: number;
  textSymbolizerFillColor: string;
  textSymbolizerFillColorOpacity: number;
  anchorpointX: number;
  anchorpointY: number;
  fontFamily: string;
  fontSize: number;
  fontStyle: string;
  fontWeight: string;
  // if hasTextSymbolizer is true group end

  cluster: boolean; // for point only
  // if cluster is true group start
  clusterTitle: string;
  clusterGreaterThanOrEqual: number;
  clusterLessThanOrEqual: number;
  clusterPointSize: number;
  clusterTextType: string;
  clusterTextSize: number;
  clusterTextWeight: string;
  clusterTextColor: string;
  clusterTextColorOpacity: number;
  clusterAnchorPointX: number;
  clusterAnchorPointY: number;
  clusterTextHaloRadius: number;
  clusterTextHaloFillColor: string;
  clusterTextHaloFillOpacityWeight: string;
  // if cluster is true group end

  dashed: boolean; // for line, polygon
  // if dashed is true group start
  strokeDashLength: number;
  strokeSpaceLength: number;
  // if dashed is true group end
};

export type StyleFilterDto = {
  column: StyleFilterColumnDto;
  operator: OperatorType;
  value: any;
};

export enum OperatorType {
  EQUAL = 'EQUAL', // ==
  NOT_EQUAL = 'NOT_EQUAL', // !=
  CONTAINS = 'CONTAINS', // *=
}

export type StyleFilterColumnDto = {
  nameKk: string;
  nameRu: string;
  nameEn: string;
  attrname: string;
  attrtype: AttrType;
  dictionaryCode: string;
};

export type StyleRasterColorDto = {
  color: string;
  quantity: string;
  label: string;
  opacity: string;
};