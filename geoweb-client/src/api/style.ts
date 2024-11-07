import instance from '../utils/axios/instance';
import { StyleRequestDto, StyleResponseDto, StyleResponseFullDto } from './types/style';
const STYLE_URL = '/styles';

const getStyle = (id: string) => {
  return instance.get<StyleResponseFullDto>(`${STYLE_URL}/${id}`);
};

const updateStyle = (id: string, style: StyleRequestDto) => {
  return instance.put<StyleResponseDto>(`${STYLE_URL}/${id}`, style);
};

const deleteStyle = (id: string) => {
  return instance.delete<void>(`${STYLE_URL}/${id}`);
};

const getStyles = () => {
  return instance.get<StyleResponseDto[]>(STYLE_URL);
};

const createStyle = (style: StyleRequestDto, layerId: string) => {
  return instance.post<StyleResponseDto>(STYLE_URL, style, {
    params: { layerId },
  });
};

const uploadIcon = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return instance.post<{ imgSrc: string; imgFormat: string }>(`${STYLE_URL}/icons/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const styleAPI = {
  createStyle,
  deleteStyle,
  getStyle,
  getStyles,
  updateStyle,
  uploadIcon,
};