import { AttrType, GeometryType } from './mapFolders';

export type StyleResponseFullDto = {
  id?: string;
  name?: string;
  geomType?: GeometryType;
  rules?: StyleRule.Dto[];
  sld?: string | null;
  isSld?: boolean;
};

export type StyleRequestDto = Omit<StyleResponseFullDto, 'id'>;
export type StyleResponseDto = Pick<StyleResponseFullDto, 'id' | 'name'>;

export namespace StyleRule {
  // Общие свойства
  export type Common = {
    name: string;
    scaleMin: number;
    scaleMax: number;
    id?: string; // NOTE: на бэке поля нет, только для фронта, для редактирования существующих правил
    isDeleted?: boolean; // NOTE: на бэке поля нет, только для фронта, для помечания правил на удаление
  };

  // Свойства для точек
  export type Point = {
    fillColor: string;
    fillColorOpacity: number;
    pointShape: PointShape;
    pointRadius: number;
    imgFormat: string;
    imgSrc: string;
  };
  export enum PointShape {
    CIRCLE = 'circle',
    SQUARE = 'square',
    TRIANGLE = 'triangle',
    STAR = 'star',
    CROSS = 'cross',
    X = 'x',
  }

  // Свойства для линий
  export type Line = {
    strokeWidth: number;
    strokeColor: string;
    strokeColorOpacity: number;
  };

  // Свойства для полигонов
  export type Polygon = {
    strokeWidth: number;
    strokeColor: string;
    strokeColorOpacity: number;
    fillColor: string;
    fillColorOpacity: number;
  };

  // Свойства для растровых данных
  type Raster = {
    rasterColors: StyleRasterColorDto[];
  };

  // Свойства для текста. Применимы для точек, линий и полигонов. Если hasTextSymbolizer = true, то группа свойств присутствует
  export type TextSymbolizer = {
    hasTextSymbolizer: boolean;
    // if hasTextSymbolizer = true
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
  };

  // Свойства для фильтрации. Применимы для точек, линий и полигонов
  export type Filter = {
    filter: StyleFilterDto | null;
  };

  // Свойства для кластеризации. Применимы для точек. Если cluster = true, то группа свойств присутствует
  export type Cluster = {
    cluster: boolean;
    // if cluster = true
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
    clusterTextHaloFillOpacityWeight: number; // в сваггере неправильно?
  };

  // Свойства для пунктирных линий. Применимы для линий и полигонов. Если dashed = true, то группа свойств присутствует
  export type Dashed = {
    dashed: boolean; // true
    // if dashed = true
    strokeDashLength: number;
    strokeSpaceLength: number;
  };

  export type Dto = Partial<Common & Point & Line & Polygon & Raster & TextSymbolizer & Filter & Cluster & Dashed>;
}

export type StyleFilterDto = {
  column: StyleFilterColumnDto;
  operator: OperatorType;
  value: string | boolean | number;
};

export enum OperatorType {
  EQUAL = '==',
  NOT_EQUAL = '!=',
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