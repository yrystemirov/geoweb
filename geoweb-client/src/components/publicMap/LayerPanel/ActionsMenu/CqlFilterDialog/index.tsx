import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { FC, useEffect, useState } from 'react';
import { useAuth } from '../../../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { mapOpenAPI } from '../../../../../api/openApi';
import { layersAPI } from '../../../../../api/layer';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { Loader } from '../../../../common/Loader';
import { FormProvider, useForm } from 'react-hook-form';
import { FormSelect } from '../../../../common/FormSelect';
import { useTranslatedProp } from '../../../../../hooks/useTranslatedProp';
import { useTranslation } from 'react-i18next';
import { AttrType } from '../../../../../api/types/mapFolders';
import { ValueField } from '../../../../Dashboard/Layers/Style/Rules/FilterDIalog/ValueField';
import { object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';
import dayjs from 'dayjs';

type Props = {
  layer: TileLayer<TileWMS>;
  onClose: () => void;
};

const likeDisabledTypes = [
  AttrType.BIGINT,
  AttrType.NUMERIC,
  AttrType.BOOLEAN,
  AttrType.DICTIONARY,
  AttrType.TIMESTAMP,
];
const relativeOperatorsDisabledTypes = [AttrType.TEXT, AttrType.BOOLEAN, AttrType.TIMESTAMP, AttrType.DICTIONARY]; // "<" and ">" operators
const unsupportedSymbols = ["'"];

enum OperatorType {
  EQUAL = '=',
  NOT_EQUAL = '<>',
  LIKE = ' ILIKE ',
  LESS = '<',
  GREATER = '>',
}

export const CqlFilterDialog: FC<Props> = ({ layer, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const cqlFilterString: string = layer.getSource()?.getParams().CQL_FILTER;
  const [cqlFilter, setCqlFilter] = useState<{ [attrname: string]: { operator: string; value: string } }>(() => {
    if (!cqlFilterString) return {};
    const filterParts = cqlFilterString.split(' AND ');
    return filterParts.reduce((acc, part) => {
      const [attrname, operator, value] = part.split(/(=|<>| ILIKE |<|>)/);
      return {
        ...acc,
        [attrname]: { operator, value: value.replace(/'/g, '') },
      };
    }, {});
  });
  const cqlFilterRows = Object.entries(cqlFilter).map(([attrname, { operator, value }]) => ({
    attrname,
    operator,
    value,
  }));
  const nameProp = useTranslatedProp('name');
  const layerName = layer.getProperties().systemLayerProps?.[nameProp]
    ? `"${layer.getProperties().systemLayerProps?.[nameProp]}"`
    : '';
  const { t } = useTranslation();
  const layerId = layer.getProperties().systemLayerProps?.id;
  const { isAuthorized } = useAuth();
  const { data: attrs, isLoading } = useQuery({
    queryKey: ['layerAttributes', layerId],
    queryFn: () =>
      (isAuthorized ? mapOpenAPI.getOpenApiLayerAttributes : layersAPI.getLayerAttrs)(layerId).then((res) => res.data),
    enabled: !!layerId,
  });

  const schema = object({
    attrname: string().required(t('requiredField')),
    operator: string().required(t('requiredField')),
    value: string()
      .required(t('requiredField'))
      .test(
        'unsupportedSymbol',
        t('unsupportedSymbols', {
          symbols: "'",
        }),
        (value) => !unsupportedSymbols.some((symbol) => value?.includes(symbol)),
      ),
  });

  const methods = useForm({
    defaultValues: {
      attrname: '',
      operator: '',
      value: '',
    },
    resolver: yupResolver(schema),
  });
  const selectedAttr = attrs?.find((a) => a.attrname === methods.watch('attrname'));

  const { handleSubmit } = methods;

  const columns: GridColDef[] = [
    {
      field: 'attrname',
      headerName: t('cqlFilter.attr'),
      flex: 1,
      minWidth: 200,
      valueGetter: (value: string) => attrs?.find((a) => a.attrname === value)?.[nameProp],
    },
    {
      field: 'operator',
      headerName: t('cqlFilter.operator'),
      flex: 1,
      minWidth: 120,
      valueGetter: (value: string) => t(`cqlFilter.operators.${value}`).toLowerCase(),
    },
    {
      field: 'value',
      headerName: t('cqlFilter.value'),
      flex: 1,
      minWidth: 200,
      valueGetter: (value: string, row) => {
        const attr = attrs?.find((a) => a.attrname === row.attrname);
        const dicPrefix = attr?.attrType === AttrType.DICTIONARY && row.value ? ` (${t('attrs.dictionaryCode')})` : '';
        return `${value}${dicPrefix}`;
      },
    },
    {
      field: '...',
      headerName: t('delete'),
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={t('cqlFilter.delete')}>
          <IconButton
            onClick={() => {
              setCqlFilter((prev) => {
                const { [params.row.attrname]: _, ...rest } = prev;
                return rest;
              });
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const correctValueByType = (value: any, type?: AttrType) => {
    switch (type) {
      case AttrType.TIMESTAMP:
        // converting date to java timestamp format
        return value ? dayjs(value).format('YYYY-MM-DDTHH:mm:ss') : value;
      case AttrType.BOOLEAN:
        return value === 'true' ? true : value === 'false' ? false : '';
      default:
        return value;
    }
  };

  console.log({ cqlFilterString });

  useEffect(() => {
    if (!mounted) return;

    const cqlFilterAsString = Object.entries(cqlFilter)
      .map(([attrname, { operator, value }]) => {
        const attr = attrs?.find((a) => a.attrname === attrname);
        const isString = attr?.attrType === AttrType.TEXT;
        return `${attrname}${operator}${isString ? `${value}` : value}`;
      })
      .join(' AND ');

    layer.getSource()?.updateParams({ CQL_FILTER: cqlFilterAsString });
  }, [cqlFilter]);

  useEffect(() => {
    // сбросить значение operator если тип атрибута не поддерживает его
    const disabledByLike =
      methods.watch('operator') === OperatorType.LIKE && likeDisabledTypes.includes(selectedAttr?.attrType!);
    const disabledByRelativeOperators =
      ['<', '>'].includes(methods.watch('operator')) &&
      relativeOperatorsDisabledTypes.includes(selectedAttr?.attrType!);

    if (disabledByLike || disabledByRelativeOperators) {
      methods.setValue('operator', '');
      methods.resetField('operator');
    }
  }, [selectedAttr]);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
  }, []);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: 800,
        },
      }}
    >
      {isLoading && <Loader />}
      <DialogTitle>{t('cqlFilter.title', { name: layerName })}</DialogTitle>
      <DialogContent>
        <DataGrid
          rows={cqlFilterRows}
          sx={{
            mb: 4,
            display: cqlFilterRows.length === 0 ? 'none' : 'block',
          }}
          columns={columns}
          hideFooter
          hideFooterPagination
          rowSelection={false}
          disableColumnMenu
          getRowId={(row) => row.attrname}
        />
        <FormProvider {...methods}>
          <Box display="flex" flexDirection="row" gap={2} component="form" noValidate>
            <FormSelect
              margin="dense"
              name="attrname"
              options={attrs}
              getOptionLabel={(option) => option[nameProp]}
              getOptionValue={(option) => option.attrname}
              label={t('cqlFilter.attr')}
              sx={{ flex: 1 / 3 }}
              value={methods.watch('attrname')}
              required
            >
              <MenuItem value="">
                <em>
                  <i>{t('isNotSelected')}</i>
                </em>
              </MenuItem>
            </FormSelect>

            <FormSelect
              margin="dense"
              name="operator"
              options={Object.values(OperatorType).map((operator) => ({
                label: t(`cqlFilter.operators.${operator}`),
                value: operator,
              }))}
              getOptionLabel={(option) => t(option.label)}
              getOptionValue={(option) => option.value}
              disabledFn={(option) => {
                const disabledByLike =
                  option.value === OperatorType.LIKE && likeDisabledTypes.includes(selectedAttr?.attrType!);
                const disabledByRelativeOperators =
                  ['<', '>'].includes(option.value) && relativeOperatorsDisabledTypes.includes(selectedAttr?.attrType!);

                return disabledByLike || disabledByRelativeOperators;
              }}
              label={t('cqlFilter.operator')}
              value={methods.watch('operator')}
              sx={{ flex: 1 / 3 }}
              required
            />

            <Box flex={1 / 3}>
              <ValueField selectedAttr={selectedAttr} required />
            </Box>
          </Box>
          <FormHelperText>{t('cqlFilter.disclaimer')}</FormHelperText>
        </FormProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
        <Button
          onClick={handleSubmit(({ attrname, operator, value }) => {
            setCqlFilter((prev) => ({
              ...prev,
              [attrname]: { operator, value: correctValueByType(value, selectedAttr?.attrType) },
            }));
            methods.reset();
          })}
          type="submit"
          color="primary"
          variant="contained"
        >
          {t('cqlFilter.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
