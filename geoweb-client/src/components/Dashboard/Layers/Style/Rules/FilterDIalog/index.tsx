import { FC, useEffect, useMemo } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { OperatorType, StyleFilterDto, StyleRule } from '../../../../../../api/types/style';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { layersAPI } from '../../../../../../api/layer';
import { useTranslation } from 'react-i18next';
import { useTranslatedProp } from '../../../../../../hooks/useTranslatedProp';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: (filter: StyleFilterDto) => void;
  rule?: StyleRule.Dto;
};

type StyleFilterForm = {
  column: StyleFilterDto['column']['attrname'];
  operator: OperatorType;
  value?: string;
};

const INITIAL_VALUES: StyleFilterForm = {
  column: '',
  operator: '' as OperatorType,
  value: '',
};

export const FilterDialog: FC<Props> = ({ open, onClose, onSubmit, rule }) => {
  const nameProp = useTranslatedProp('name');
  const { t } = useTranslation();
  const { layerId } = useParams();
  const editData = rule?.filter;
  const isEdit = !!editData;

  const { data: attrs = [], isLoading: isAttrsLoading } = useQuery({
    queryKey: ['layerAttrs', layerId],
    queryFn: () => layersAPI.getLayerAttrs(layerId!).then((res) => res.data),
    enabled: !!layerId,
  });

  const defaultValues = useMemo(() => {
    return editData
      ? {
          ...editData,
          column: editData.column.attrname,
        }
      : INITIAL_VALUES;
  }, [editData]);

  const schema = object<StyleFilterForm>().shape({
    column: string().required(t('requiredField')),
    operator: string<OperatorType>().required(t('requiredField')),
    value: string(),
  });

  const methods = useForm<StyleFilterForm>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues]);

  const onSubmitHandler = methods.handleSubmit((data) => {
    const attr = attrs.find((attr) => attr.attrname === data.column);

    onSubmit({
      ...data,
      column: {
        nameKk: attr!.nameKk,
        nameRu: attr!.nameRu,
        nameEn: attr!.nameEn,
        attrname: attr!.attrname,
        attrtype: attr!.attrType,
        dictionaryCode: attr!.dictionaryCode,
      },
    } as StyleFilterDto);
    onClose();
  });

  return (
    <Dialog open={!!open} onClose={onClose}>
      <DialogTitle>{t(isEdit ? 'styleRules.editFilter' : 'styleRules.addFilter')}</DialogTitle>
      <form onSubmit={onSubmitHandler} noValidate id="filterForm">
        <DialogContent>
          <Box>
            <TextField
              {...methods.register('column')}
              label={t('styleRules.filterName')}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!methods.formState.errors.column}
              helperText={methods.formState.errors.column?.message}
              select
              value={methods.watch('column')}
              required
            >
              {attrs.map((attr) => (
                <MenuItem key={attr.id} value={attr.attrname}>
                  {attr[nameProp]}
                </MenuItem>
              ))}
              {attrs.length === 0 && <MenuItem disabled>{t('noData')}</MenuItem>}
            </TextField>
            <TextField
              {...methods.register('operator')}
              label={t('styleRules.operator')}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!methods.formState.errors.operator}
              helperText={methods.formState.errors.operator?.message}
              select
              value={methods.watch('operator')}
              required
            >
              {Object.values(OperatorType).map((operator) => (
                <MenuItem key={operator} value={operator}>
                  {t(`styleRules.filterOperators.${operator}`)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              {...methods.register('value')}
              label={t('styleRules.value')}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!methods.formState.errors.value}
              helperText={methods.formState.errors.value?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <Button
            type="submit"
            form="filterForm"
            color="primary"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onSubmitHandler();
            }}
          >
            {t('save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};