import instance from '../utils/axios/instance';
import { FolderDto, FolderTreeDto } from './types/mapFolders';

const FOLDERS_URL = '/folders';

const getRootFolders = () => {
  return instance.get<FolderDto[]>(`${FOLDERS_URL}/root`);
};

const getFolder = (id: FolderDto['id']) => {
  return instance.get<FolderDto>(`${FOLDERS_URL}/${id}`);
};

const updateFolder = (folder: Partial<FolderDto>) => {
  return instance.put<FolderDto>(`${FOLDERS_URL}/${folder.id}`, folder);
};

const deleteFolder = (id: FolderDto['id']) => {
  return instance.delete(`${FOLDERS_URL}/${id}`);
};

const addFolder = (folder: Partial<FolderDto>) => {
  return instance.post<FolderDto>(FOLDERS_URL, folder);
};

const getFolderTree = (id: FolderDto['id']) => {
  return instance.get<FolderTreeDto[]>(`${FOLDERS_URL}/${id}/tree`);
};

const getFolderChildren = (id: FolderDto['id']) => {
  return instance.get<FolderDto[]>(`${FOLDERS_URL}/${id}/children`);
};

export const mapFoldersAPI = {
  addFolder,
  deleteFolder,
  getFolder,
  getFolderChildren,
  getFolderTree,
  getRootFolders,
  updateFolder,
};