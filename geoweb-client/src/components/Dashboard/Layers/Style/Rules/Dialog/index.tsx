import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { FC } from 'react';
import { StyleRule } from '../../../../../../api/types/style';
import { GeometryType } from '../../../../../../api/types/mapFolders';
import { PointForm, PointFormDataType } from './PointForm';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (newRule: StyleRule.Dto) => void;
  geometryType: GeometryType;
  editData?: StyleRule.Dto;
};

export const RuleDialog: FC<Props> = ({ geometryType, editData, open, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const isEdit = !!editData;

  const RuleFormComponents: Record<GeometryType, JSX.Element> = {
    [GeometryType.POINT]: <PointForm onSubmit={onSubmit} onClose={onClose} editData={editData as PointFormDataType} />,
    [GeometryType.MULTIPOINT]: <PointForm onSubmit={onSubmit} onClose={onClose} editData={editData as PointFormDataType} />,
    [GeometryType.LINESTRING]: <div>Форма для создания правила для линейного слоя (в разработке)</div>,
    [GeometryType.MULTILINESTRING]: <div>Форма для создания правила для линейного слоя (в разработке)</div>,
    [GeometryType.POLYGON]: <div>Форма для создания правила для полигонального слоя (в разработке)</div>,
    [GeometryType.MULTIPOLYGON]: <div>Форма для создания правила для полигонального слоя (в разработке)</div>,
    [GeometryType.RASTER]: <div>Форма для создания правила для растрового слоя (в разработке)</div>,
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t(isEdit ? 'styleRules.edit' : 'styleRules.create')}</DialogTitle>
      <DialogContent>{RuleFormComponents[geometryType]}</DialogContent>
    </Dialog>
  );
};