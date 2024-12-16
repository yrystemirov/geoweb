import instance from '../utils/axios/instance';
import { FolderDto, FolderTreeDto, LayerAttrDto } from './types/mapFolders';
import { IdentifyParams } from './types/openApi';

const OPEN_API_URL = '/open-api';

const getOpenApiRootFolders = () => {
  return instance.get<FolderDto[]>(`${OPEN_API_URL}/folders/root`);
};

const getOpenApiRootFoldertreeById = (id: string) => {
  return instance.get<FolderTreeDto>(`${OPEN_API_URL}/folders/${id}/tree`);
};

const getOpenApiIdentify = (params: IdentifyParams) => {
  return instance.post<any>(`${OPEN_API_URL}/features/identify`, params);
};

const getOpenApiLayerAttributes = (layerId: string) => {
  return instance.get<LayerAttrDto[]>(`${OPEN_API_URL}/layers/${layerId}/attrs`);
};

const getOpenApiLayerFeatures = (layerName: string, page: number, size: number) => {
  return instance.get<any>(`${OPEN_API_URL}/features?layername=${layerName}&page=${page}&size=${size}`);
};

const getExtentByLayerId = (id: string) => {
  return instance.get<{ extent: string }>(`${OPEN_API_URL}/layers/${id}/extent`);
};

export const mapOpenAPI = {
  getExtentByLayerId,
  getOpenApiIdentify,
  getOpenApiLayerAttributes,
  getOpenApiLayerFeatures,
  getOpenApiRootFolders,
  getOpenApiRootFoldertreeById,
};