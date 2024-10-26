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
import { AttrType } from '../../../../../../api/types/mapFolders';
import { dictionariesAPI } from '../../../../../../api/dictioanries';

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
  const entryNameProp = useTranslatedProp('', true);

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = methods;

  const formValues = watch();

  const selectedAttr = useMemo(() => attrs.find((attr) => attr.attrname === formValues.column), [formValues.column]);

  const { data: entries, isLoading: isEntriesLoading } = useQuery({
    queryKey: ['dictionaryEntries', selectedAttr?.dictionaryCode],
    queryFn: () => dictionariesAPI.getAllEntriesByDicCode(selectedAttr?.dictionaryCode!).then((res) => res.data),
    enabled: selectedAttr?.attrType === AttrType.DICTIONARY,
  });

  const onSubmitHandler = handleSubmit((data) => {
    onSubmit({
      ...data,
      column: {
        nameKk: selectedAttr?.nameKk,
        nameRu: selectedAttr?.nameRu,
        nameEn: selectedAttr?.nameEn,
        attrname: selectedAttr?.attrname,
        attrtype: selectedAttr?.attrType,
        dictionaryCode: selectedAttr?.dictionaryCode,
      },
    } as StyleFilterDto);
    onClose();
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  useEffect(() => {
    // TODO: move logic to separate component with processing all types of attributes
    if (selectedAttr?.dictionaryCode !== attrs.find((attr) => attr.attrname === formValues.column)?.dictionaryCode) {
      // если дикшнари код сменился, то нужно сбросить значение
      reset({ ...formValues, value: '' });
    }
  }, [entries]);

  return (
    <Dialog open={!!open} onClose={onClose}>
      <DialogTitle>{t(isEdit ? 'styleRules.editFilter' : 'styleRules.addFilter')}</DialogTitle>
      <form onSubmit={onSubmitHandler} noValidate id="filterForm">
        <DialogContent>
          <Box>
            <TextField
              {...register('column')}
              label={t('styleRules.filterName')}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!errors.column}
              helperText={errors.column?.message}
              select
              value={formValues.column}
              required
              disabled={isAttrsLoading}
            >
              {attrs.map((attr) => (
                <MenuItem key={attr.id} value={attr.attrname}>
                  {attr[nameProp]}
                </MenuItem>
              ))}
              {attrs.length === 0 && <MenuItem disabled>{t('noData')}</MenuItem>}
            </TextField>
            <TextField
              {...register('operator')}
              label={t('styleRules.operator')}
              fullWidth
              margin="dense"
              variant="outlined"
              error={!!errors.operator}
              helperText={errors.operator?.message}
              select
              value={formValues.operator}
              required
            >
              {Object.values(OperatorType).map((operator) => (
                <MenuItem key={operator} value={operator}>
                  {t(`styleRules.filterOperators.${operator}`)}
                </MenuItem>
              ))}
            </TextField>
            {selectedAttr?.attrType === AttrType.DICTIONARY ? (
              // TODO: move logic to separate component with processing all types of attributes
              <TextField
                {...register('value')}
                label={t('styleRules.value')}
                fullWidth
                margin="dense"
                variant="outlined"
                error={!!errors.value}
                helperText={errors.value?.message}
                select
                value={formValues.value}
                disabled={isEntriesLoading}
              >
                {entries?.map((entry) => (
                  <MenuItem key={entry.id} value={entry.code}>
                    {entry[entryNameProp]}
                  </MenuItem>
                ))}
                {entries?.length === 0 && <MenuItem disabled>{t('noData')}</MenuItem>}
              </TextField>
            ) : (
              <TextField
                {...register('value')}
                label={t('styleRules.value')}
                fullWidth
                margin="dense"
                variant="outlined"
                error={!!errors.value}
                helperText={errors.value?.message}
              />
            )}
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