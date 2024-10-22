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

export const CreateRuleDialog: FC<Props> = ({ geometryType, editData, open, onClose, onSubmit }) => {
  const { t } = useTranslation();

  const createRuleFormFc: Record<GeometryType, JSX.Element> = {
    [GeometryType.POINT]: <PointForm onSubmit={onSubmit} onClose={onClose} editData={editData as PointFormDataType} />,
    [GeometryType.MULTIPOINT]: <PointForm onSubmit={onSubmit} onClose={onClose} />,
    [GeometryType.LINESTRING]: <div>Форма для создания правила для линейного слоя</div>,
    [GeometryType.MULTILINESTRING]: <div>Форма для создания правила для линейного слоя</div>,
    [GeometryType.POLYGON]: <div>Форма для создания правила для полигонального слоя</div>,
    [GeometryType.MULTIPOLYGON]: <div>Форма для создания правила для полигонального слоя</div>,
    [GeometryType.RASTER]: <div>Форма для создания правила для растрового слоя</div>,
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('rulesTable.create')}</DialogTitle>
      {/* <DialogContentText>{t('rulesTable.createDescription')}</DialogContentText> */}
      <DialogContent>{createRuleFormFc[geometryType]}</DialogContent>
    </Dialog>
  );
};