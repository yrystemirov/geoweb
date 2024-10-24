import { useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowModesModel,
  GridRowModes,
  GridEventListener,
  GridRowId,
  GridActionsCellItem,
  GridToolbarContainer
} from '@mui/x-data-grid';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, CardHeader, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { dictionariesAPI } from '../../../../api/dictioanries';
import { useTranslation } from 'react-i18next';
import { EntryDto, EntryRequestDto } from '../../../../api/types/dictioanries';
import CustomNoRowsOverlay from '../../../common/NoRows/DataGrid';
import { fieldIsRequiredProps } from './utils';
import { useNotify } from '../../../../hooks/useNotify';
import { useMuiLocalization } from '../../../../hooks/useMuiLocalization';
import { GoBackButton } from '../../../common/GoBackButton';
import ConfirmDialog from '../../../common/Confirm';
import { useTranslatedProp } from '../../../../hooks/useTranslatedProp';
import { dashboardUrl } from '../../routes';

export type EntryDtoRow = EntryDto & { isNew?: boolean };

export const DictionaryEntries = () => {
  const translatedNameProp = useTranslatedProp('name');
  const { showError } = useNotify();
  const { t } = useTranslation();
  const { id: dictionaryId } = useParams() as { id: string };
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [rows, setRows] = useState<EntryDtoRow[]>([]);
  const [deleteOpen, setDeleteOpen] = useState<{ id: string | null; open: boolean }>({ id: null, open: false });
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const queryClient = useQueryClient();
  const { dataGridLocale } = useMuiLocalization();
  const navigate = useNavigate();

  const { data: dictionary } = useQuery({
    queryKey: ['dictionary', dictionaryId],
    queryFn: () => dictionariesAPI.getDictionary(dictionaryId).then((res) => res.data),
    enabled: !!dictionaryId,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['dictionaryEntries', dictionaryId, pagination],
    queryFn: () =>
      dictionariesAPI
        .getEntries(dictionaryId, { page: pagination.page, size: pagination.pageSize })
        .then((res) => res.data),
    enabled: !!dictionaryId,
  });

  const onError = (error: any) => {
    showError({ error });
  };

  const addMutation = useMutation({
    mutationFn: (newEntry: EntryRequestDto) => dictionariesAPI.addEntry(newEntry).then((res) => res.data),
    onSuccess: (newRow) => {
      setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
      queryClient.invalidateQueries({ queryKey: ['dictionaryEntries', dictionaryId] });
    },
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ newRow, oldRow }: { newRow: EntryRequestDto; oldRow: EntryDtoRow }) =>
      dictionariesAPI.updateEntry(newRow).then((res) => res.data),
    onSuccess: (newRow) => {
      setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
      queryClient.invalidateQueries({ queryKey: ['dictionaryEntries', dictionaryId] });
    },
    onError: (e, { oldRow }) => {
      onError(e);
      setRows(rows.map((row) => (row.id === oldRow.id ? oldRow : row)));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dictionariesAPI.deleteEntry(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dictionaryEntries', dictionaryId] });
      setRows(rows.filter((row) => row.id !== id));
    },
    onError,
  });

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === 'rowFocusOut') {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setDeleteOpen({ id: id as string, open: true });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: EntryDtoRow, oldRow: EntryDtoRow) => {
    const entryData = {
      ...newRow,
      dictionaryId,
    };
    if (newRow.isNew) {
      delete (entryData as any).id;
      addMutation.mutate(entryData);
    } else {
      updateMutation.mutate({ newRow: entryData, oldRow });
    }
    return entryData;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleAddClick = () => {
    const id = Date.now().toString(); // временный идентификатор
    setRows((oldRows) => [...oldRows, { id, ru: '', kk: '', en: '', code: '', isNew: true } as EntryDtoRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'code' },
    }));
  };

  const actionsColumn: GridColDef<EntryDtoRow> = {
    field: 'actions',
    headerName: t('actions'),
    type: 'actions',
    width: 100,
    getActions: ({ id }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            sx={{
              color: 'primary.main',
            }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(id)} />,
        ];
      }

      return [
        <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />,
        <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={handleDeleteClick(id)} />,
      ];
    },
  };

  const columns: GridColDef<EntryDtoRow>[] = [
    { field: 'rank', headerName: '№', width: 100, editable: true },
    { field: 'code', headerName: t('code'), width: 150, editable: true, ...fieldIsRequiredProps(t('requiredField')) },
    { field: 'ru', headerName: t('nameRu'), width: 300, editable: true, ...fieldIsRequiredProps(t('requiredField')) },
    { field: 'kk', headerName: t('nameKk'), width: 300, editable: true },
    { field: 'en', headerName: t('nameEn'), width: 300, editable: true },
    actionsColumn,
  ];

  useEffect(() => {
    if (data) {
      setRows(data.content.map((entry) => ({ ...entry, isNew: false })));
    }
  }, [data]);

  const dicName = dictionary?.[translatedNameProp];

  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
        <GoBackButton text={t('backToList')} onClick={() => navigate(`${dashboardUrl}/dictionaries`)} />
        <CardHeader title={t('dictionaryEntries', { dicName })} sx={{ textAlign: 'center', flex: 1 }} />
      </Box>
      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationModel={pagination}
          paginationMode="server"
          rowCount={data?.totalElements || 0}
          onPaginationModelChange={(newPagination) => setPagination(newPagination)}
          loading={isLoading}
          rowSelection={false}
          disableColumnMenu
          disableColumnSorting
          editMode="row"
          localeText={dataGridLocale}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            toolbar: () => (
              <GridToolbarContainer>
                <Button
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddClick}
                  disabled={rows.some((row) => row.isNew)}
                >
                  {t('addRecord')}
                </Button>
              </GridToolbarContainer>
            ),
          }}
          slotProps={{
            loadingOverlay: {
              variant: 'linear-progress',
              noRowsVariant: 'linear-progress',
            },
          }}
          sx={{
            '& .Mui-error': {
              backgroundColor: 'rgb(126,10,15, 0.1)',
              color: '#750f0f',
            },
            '& .MuiDataGrid-row--editing .MuiDataGrid-cell': {
              backgroundColor: 'rgb(24, 118, 210, 0.1)',
            },
            minHeight: 200,
          }}
        />
        <ConfirmDialog
          open={deleteOpen.open}
          onClose={() => setDeleteOpen({ id: null, open: false })}
          onSubmit={() => {
            deleteMutation.mutate(deleteOpen.id as string);
            setDeleteOpen({ id: null, open: false });
          }}
          isLoading={deleteMutation.isPending}
          title={t('deleteConfirm')}
        >
          {t('deleteConfirmDescription')}
        </ConfirmDialog>
      </Box>
    </>
  );
};