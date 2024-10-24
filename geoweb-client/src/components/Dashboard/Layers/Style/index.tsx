import { useMutation, useQuery } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { layersAPI } from '../../../../api/layer';
import { styleAPI } from '../../../../api/style';
import { ChildPageLayout, dashboardUrl } from '../../routes';
import { useTranslatedProp } from '../../../../hooks/useTranslatedProp';
import { Box, Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { StyleRequestDto, StyleResponseFullDto, StyleRule } from '../../../../api/types/style';
import { useNotify } from '../../../../hooks/useNotify';
import { RulesTable } from './Rules/Table';
import { useTranslation } from 'react-i18next';
import { RuleDialog } from './Rules/Dialog';
import { uuidv4 } from '../../../../utils/uidv4';

const DEFAULT_VALUES: StyleRequestDto = {
  sld: '',
  rules: [],
};

export const LayerStyleEditor: FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotify();
  const navigate = useNavigate();
  const nameProp = useTranslatedProp('name');
  const { layerId } = useParams();
  const { data: layerData, isLoading: isLayerLoading } = useQuery({
    queryKey: ['layer', layerId],
    queryFn: () => layersAPI.getLayer(layerId!).then((res) => res.data),
    enabled: !!layerId,
  });
  const layerDisplayName = layerData?.[nameProp] ? `"${layerData?.[nameProp]}"` : '';
  const [isSldStyle, setIsSldStyle] = useState<boolean>(false);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [editDialog, setEditDialog] = useState<{ open: boolean; rule?: StyleRule.Dto }>();

  const { data: styleData, isLoading } = useQuery({
    queryKey: ['style', layerId],
    queryFn: () => styleAPI.getStyle(layerData!.styleId!).then((res) => res.data),
    enabled: !!layerData?.styleId,
  });

  const methods = useForm<StyleRequestDto>({
    defaultValues: DEFAULT_VALUES,
  });

  const createMutation = useMutation<StyleRequestDto, any, StyleRequestDto>({
    mutationFn: (style) => {
      return styleAPI.createStyle(style, layerId!).then((res) => res.data);
    },
    onSuccess: () => {
      showSuccess();
      setAddDialogOpen(false);
      navigate(`${dashboardUrl}/layers`);
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const updateMutation = useMutation<StyleRequestDto, any, StyleRequestDto>({
    mutationFn: (style) => styleAPI.updateStyle(styleData!.id!, style).then((res) => res.data),
    onSuccess: () => {
      showSuccess();
      setAddDialogOpen(false);
      navigate(`${dashboardUrl}/layers`);
    },
    onError: (error) => {
      showError({ error });
    },
  });

  const onSubmit = (data: StyleRequestDto) => {
    const requestData: StyleResponseFullDto = {
      ...data,
      name: layerData!.layername,
      geomType: layerData!.geometryType,
      isSld: isSldStyle,
      sld: isSldStyle ? data.sld : null,
      rules: isSldStyle ? [] : data.rules?.filter((r) => !r.isDeleted) || [],
    };
    if (styleData) {
      const { id, ...rest } = requestData;
      updateMutation.mutate(rest);
    } else {
      createMutation.mutate(requestData);
    }
  };

  useEffect(() => {
    if (styleData) {
      const dataWithUuid = {
        ...styleData,
        rules: styleData.rules?.map((r) => ({ ...r, id: uuidv4() })),
      };
      methods.reset(dataWithUuid);
      setIsSldStyle(!!styleData!.isSld);
    }
  }, [styleData]);

  return (
    <ChildPageLayout
      title={'styles.title'}
      titleParams={{ name: layerDisplayName }}
      goBackPath={`${dashboardUrl}/layers`}
    >
      <Box display={'flex'} justifyContent={'space-between'} gap={2} mb={2} alignItems={'center'}>
        <FormControlLabel
          control={<Switch checked={isSldStyle} onChange={() => setIsSldStyle(!isSldStyle)} />}
          label={t('styles.useSld')}
        />
        <Typography variant={'body1'} color={'secondary'}>
          {t('styles.geometryType', { type: layerData?.geometryType })}
        </Typography>
      </Box>
      <FormProvider {...methods}>
        <Box component="form" noValidate onSubmit={methods.handleSubmit(onSubmit)}>
          {isSldStyle ? (
            <TextField
              {...methods.register('sld')}
              multiline
              fullWidth
              rows={10}
              placeholder={t('styles.sldPlaceholder')}
              error={!!methods.formState.errors.sld}
              helperText={methods.formState.errors.sld?.message}
            />
          ) : (
            <RulesTable
              rules={methods.watch('rules')}
              onAdd={() => setAddDialogOpen(true)}
              onEdit={(rule) => setEditDialog({ open: true, rule })}
              onDelete={(rule) => {
                methods.setValue(
                  'rules',
                  methods.watch('rules')!.map((r: StyleRule.Dto) => (r.id === rule.id ? { ...r, isDeleted: true } : r)),
                );
              }}
              onCancelDeletion={(rule) => {
                methods.setValue(
                  'rules',
                  methods
                    .watch('rules')!
                    .map((r: StyleRule.Dto) => (r.id === rule.id ? { ...r, isDeleted: false } : r)),
                );
              }}
            />
          )}
          <Box display={'flex'} justifyContent={'flex-end'} mt={2}>
            <Button
              variant={'text'}
              onClick={() => {
                methods.reset(DEFAULT_VALUES);
                navigate(`${dashboardUrl}/layers`);
              }}
              size="large"
            >
              {t('cancel')}
            </Button>
            <Button type={'submit'} variant={'contained'} color={'primary'} size="large">
              {t('save')}
            </Button>
          </Box>
        </Box>
        <RuleDialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          geometryType={layerData?.geometryType!}
          onSubmit={(rule) => {
            console.log({ rule });
            methods.setValue('rules', [...(methods.watch('rules') || []), rule]);
            setAddDialogOpen(false);
          }}
        />
        <RuleDialog
          open={!!editDialog?.open}
          editData={editDialog?.rule}
          onClose={() => setEditDialog({ open: false })}
          geometryType={layerData?.geometryType!}
          onSubmit={(rule) => {
            console.log({ rule });
            methods.setValue(
              'rules',
              methods.watch('rules')!.map((r: StyleRule.Dto) => (r.id === rule.id ? rule : r)),
            );
            setEditDialog({ open: false });
          }}
        />
      </FormProvider>
    </ChildPageLayout>
  );
};