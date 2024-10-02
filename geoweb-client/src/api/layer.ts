import instance from '../utils/axios/instance';
import { LayerDto, LayerRequestDto } from './types/mapFolders';
import { Pages } from './types/page';
const LAYERS_URL = '/layers';

const getLayers = () => {
  return instance.get<Pages<LayerDto>>(LAYERS_URL);
};

const getLayer = (id: string) => {
    return instance.get<LayerDto>(`${LAYERS_URL}/${id}`);
}

const createLayer = (layer: LayerRequestDto) => {
    return instance.post<LayerDto>(LAYERS_URL, layer);
}

const updateLayer = (id: string, layer: LayerRequestDto) => {
    return instance.put<LayerDto>(`${LAYERS_URL}/${id}`, layer);
}

const deleteLayer = (id: string) => {
    return instance.delete<void>(`${LAYERS_URL}/${id}`);
}

export const layersAPI = {
    getLayers,
    getLayer,
    createLayer,
    updateLayer,
    deleteLayer,
};