import instance from '../utils/axios/instance';
import { FolderDto, FolderTreeDto } from './types/mapFolders';
import { IdentifyParams } from './types/openApi';

const OPEN_API_URL = '/open-api';

const getOpenApiRootFolders = () => {
  return instance.get<FolderDto[]>(`${OPEN_API_URL}/folders/root`);
};

const getOpenApiRootFoldertreeById = (id: string) => {
  return instance.get<FolderTreeDto[]>(`${OPEN_API_URL}/folders/${id}/tree`);
};

const getOpenApiIdentify = (params: IdentifyParams) => {
  return instance.post<any>(`${OPEN_API_URL}/features/identify`, params);
};

export const mapOpenAPI = {
  getOpenApiRootFolders,
  getOpenApiRootFoldertreeById,
  getOpenApiIdentify,
};