import instance from '../utils/axios/instance';
import { LayerAttrDto, LayerDto, LayerRequestDto } from './types/mapFolders';
import { Pages, SearchablePaginationRequest } from './types/page';
const LAYERS_URL = '/layers';
const ATTRS_URL = '/layer-attrs';

const getLayers = (pagination?: SearchablePaginationRequest) => {
  return instance.get<Pages<LayerDto>>(LAYERS_URL, {
    params: pagination,
  });
};

const getLayer = (id: string) => {
  return instance.get<LayerDto>(`${LAYERS_URL}/${id}`);
};

const createLayer = (layer: LayerRequestDto) => {
  return instance.post<LayerDto>(LAYERS_URL, layer);
};

const updateLayer = (id: string, layer: LayerRequestDto) => {
  return instance.put<LayerDto>(`${LAYERS_URL}/${id}`, layer);
};

const deleteLayer = (id: string) => {
  return instance.delete<void>(`${LAYERS_URL}/${id}`);
};

const getLayerAttrs = (id: string) => {
  return instance.get<LayerAttrDto[]>(`${LAYERS_URL}/${id}/attrs`);
};

const getLayerAttr = (id: string) => {
  return instance.get<LayerAttrDto>(`${ATTRS_URL}/${id}`);
};

const createLayerAttr = (attr: LayerAttrDto) => {
  return instance.post<LayerAttrDto>(ATTRS_URL, attr);
}

const updateLayerAttr = (id: string, attr: LayerAttrDto) => {
  return instance.put<LayerAttrDto>(`${ATTRS_URL}/${id}`, attr);
}

const deleteLayerAttr = (id: string) => {
  return instance.delete<void>(`${ATTRS_URL}/${id}`);
}

export const layersAPI = {
  getLayerAttr,
  createLayerAttr,
  updateLayerAttr,
  deleteLayerAttr,

  getLayerAttrs,
  getLayers,
  getLayer,
  createLayer,
  updateLayer,
  deleteLayer,
};