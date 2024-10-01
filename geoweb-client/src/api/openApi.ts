import instance from '../utils/axios/instance';
import { FolderDto, FolderTreeDto } from './types/mapFolders';

const OPEN_API_URL = '/open-api';

const getOpenApiRootFolders = () => {
  return instance.get<FolderDto[]>(`${OPEN_API_URL}/folders/root`);
};

const getOpenApiRootFoldertreeById = (id:string) => {
  return instance.get<FolderTreeDto[]>(`${OPEN_API_URL}/folders/${id}/tree`);
};



export const mapOpenAPI = {
  getOpenApiRootFolders,
  getOpenApiRootFoldertreeById
};