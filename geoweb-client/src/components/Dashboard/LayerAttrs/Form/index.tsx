import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField, MenuItem } from '@mui/material';
import { object, string, number } from 'yup';
import { useNotify } from '../../../../hooks/useNotify';
import { layersAPI } from '../../../../api/layer';
import { AttrType as LayerAttrType, LayerAttrDto, LayerDto, AttrType } from '../../../../api/types/mapFolders';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader } from '../../../common/Loader';
import { InfiniteScrollSelect } from '../../../common/InfiniteScrollSelect';
import { dictionariesAPI } from '../../../../api/dictioanries';
import { useTranslatedProp } from '../../../../hooks/useTranslatedProp';
import { dashboardUrl } from '../../routes';

const INITIAL_VALUES: LayerAttrDto = {
  nameKk: '',
  nameRu: '',
  nameEn: '',
  attrname: '',
  attrType: '' as LayerAttrType,
  dictionaryCode: '',
  rank: 0,
};

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
  shouldGoBackToList?: boolean;
};
export const LayerAttrForm: FC<Props> = ({ onCancel, onSuccess, shouldGoBackToList }) => {
  const { layerId, attrId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotify();
  const nameProp = useTranslatedProp('name');

  const { data: editData, isLoading } = useQuery({
    queryKey: ['layerAttr', attrId],
    queryFn: () => layersAPI.getLayerAttr(attrId!).then((res) => res.data),
    enabled: !!attrId,
  });
  const isEditing = !!editData;

  const createMutation = useMutation<LayerAttrDto, any, LayerAttrDto>({
    mutationFn: (attr) =>
      layersAPI
        .createLayerAttr({
          ...attr,
          layer: layerId ? ({ id: layerId } as LayerDto) : undefined,
        })
        .then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
      shouldGoBackToList && navigate(`${dashboardUrl}/layers/${layerId}/attrs`);
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const updateMutation = useMutation<LayerAttrDto, any, LayerAttrDto>({
    mutationFn: (attr) => layersAPI.updateLayerAttr(editData?.id!, attr).then((res) => res.data),
    onSuccess: () => {
      onSuccess?.();
      showSuccess();
      shouldGoBackToList && navigate(`${dashboardUrl}/layers/${layerId}/attrs`);
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const schema = object({
    nameKk: string().required(t('requiredField')),
    nameRu: string().required(t('requiredField')),
    nameEn: string(),
    attrname: string().required(t('requiredField')),
    attrType: string().required(t('requiredField')),
    dictionaryCode: string().test('requiredIfDictionary', t('requiredField'), function (value) {
      return this.parent.attrType === LayerAttrType.DICTIONARY ? !!value : true;
    }),
    rank: number(),
  });

  const methods = useForm<LayerAttrDto>({
    defaultValues: editData || INITIAL_VALUES,
    // @ts-ignore
    resolver: yupResolver(schema),
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = (data: LayerAttrDto) => {
    if (editData) {
      updateMutation.mutate(data);
      return;
    }
    createMutation.mutate(data);
  };

  useEffect(() => {
    if (editData) {
      methods.reset(editData);
    }
  }, [editData]);

  if (!editData && isLoading) {
    return <Loader />;
  }

  return (
    <Box onSubmit={handleSubmit(onSubmit)} noValidate component={'form'} sx={{ pt: 1 }} minWidth={'min(100%, 550px)'}>
      <FormProvider {...methods}>
        <Box display="flex" gap={2} flexWrap={'wrap'} mb={2} flexDirection="column" width={{ xs: '100%', md: '70%' }}>
          <TextField
            {...methods.register('nameKk')}
            label={t('nameKk')}
            variant="outlined"
            fullWidth
            error={!!errors.nameKk}
            helperText={errors.nameKk?.message}
            required
          />
          <TextField
            {...methods.register('nameRu')}
            label={t('nameRu')}
            variant="outlined"
            fullWidth
            error={!!errors.nameRu}
            helperText={errors.nameRu?.message}
            required
          />
          <TextField
            {...methods.register('nameEn')}
            label={t('nameEn')}
            variant="outlined"
            fullWidth
            error={!!errors.nameEn}
            helperText={errors.nameEn?.message}
          />
          <TextField
            {...methods.register('attrname')}
            label={t('attrs.attrname')}
            variant="outlined"
            fullWidth
            error={!!errors.attrname}
            helperText={errors.attrname?.message}
            disabled={isEditing}
            required
          />
          <TextField
            {...methods.register('attrType')}
            select
            label={t('attrs.attrType')}
            variant="outlined"
            fullWidth
            error={!!errors.attrType}
            helperText={errors.attrType?.message}
            value={methods.watch('attrType')}
            disabled={isEditing && editData?.attrType === AttrType.DICTIONARY}
            required
          >
            <MenuItem value="">
              <em>--</em>
            </MenuItem>
            {Object.values(LayerAttrType).map((value) => (
              <MenuItem
                key={value}
                value={value}
                disabled={isEditing && value !== AttrType.DICTIONARY && editData?.attrType !== value}
              >
                {value}
              </MenuItem>
            ))}
          </TextField>
          {methods.watch('attrType') === LayerAttrType.DICTIONARY && (
            <InfiniteScrollSelect
              name="dictionaryCode"
              label={t('attrs.dictionaryCode')}
              fetchFn={dictionariesAPI.getDictionaries}
              getOptionLabel={(option) => option[nameProp]}
              getOptionValue={(option) => option.code}
              searchIsEnabled
              pageSize={1000}
              fullWidth
              required
            />
          )}

          <TextField
            {...methods.register('rank')}
            label={t('attrs.rank')}
            variant="outlined"
            fullWidth
            error={!!errors.rank}
            helperText={errors.rank?.message}
            type="number"
          />
        </Box>

        <Button
          type="submit"
          size="large"
          sx={{ float: 'right' }}
          variant="contained"
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {editData ? t('save') : t('create')}
        </Button>
        <Button
          type="button"
          size="large"
          sx={{ float: 'right', mr: 2 }}
          variant="text"
          onClick={() => {
            onCancel?.();
            methods.reset();
            shouldGoBackToList && navigate(`${dashboardUrl}/layers/${layerId}/attrs`);
          }}
        >
          {t('cancel')}
        </Button>
      </FormProvider>
    </Box>
  );
};
