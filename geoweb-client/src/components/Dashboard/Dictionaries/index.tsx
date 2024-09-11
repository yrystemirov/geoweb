import { FC, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridRowModesModel,
  GridRowModes,
  GridEventListener,
  GridRowId,
  GridActionsCellItem,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { LinearProgress, Button, CardHeader, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { dictionariesAPI } from '../../../api/dictioanries';
import CustomNoRowsOverlay from '../../common/nodata/DataGrid';
import { fieldIsRequiredProps } from './Entries/utils';
import { useNotifications } from '@toolpad/core';
import i18n from '../../../i18n';
import { constants } from '../../../constants';

export type DictionaryRow = {
  id: string;
  nameRu: string;
  nameKk: string;
  nameEn: string;
  code: string;
  isNew?: boolean;
};

export const Dictionaries: FC = () => {
  const notifications = useNotifications();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [rows, setRows] = useState<DictionaryRow[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['dictionaries', pagination],
    queryFn: () => dictionariesAPI.getDictionaries({ page: pagination.page, size: pagination.pageSize }).then((res) => res.data),
  });

  const onEditError = (error: any) => {
    const hasTranslation = i18n.exists(error?.response?.data?.message);
    const message = hasTranslation ? t(error.response.data.message) : t('errorOccurred');
    notifications.show(message, { severity: 'error', autoHideDuration: constants.ntfHideDelay });
  };

  const addMutation = useMutation({
    mutationFn: async (newDictionary: DictionaryRow) => dictionariesAPI.addDictionary(newDictionary).then((res) => res.data),
    onSuccess: (newRow) => {
      queryClient.invalidateQueries({ queryKey: ['dictionaries', pagination] });
      setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
    },
    onError: onEditError,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ newRow, oldRow }: { newRow: DictionaryRow; oldRow: DictionaryRow }) =>
      dictionariesAPI.updateDictionary(newRow).then((res) => res.data),
    onSuccess: (updatedRow) => {
      queryClient.invalidateQueries({ queryKey: ['dictionaries', pagination] });
      setRows(rows.map((row) => (row.id === updatedRow.id ? updatedRow : row)));
    },
    onError: (e, { oldRow }) => {
      onEditError(e);
      setRows(rows.map((row) => (row.id === oldRow.id ? oldRow : row)));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dictionariesAPI.deleteDictionary(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['dictionaries', pagination] });
      setRows(rows.filter((row) => row.id !== id));
    },
    onError: onEditError,
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
    // TODO: add confirmation dialog
    deleteMutation.mutate(id as string);
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

  const processRowUpdate = (newRow: DictionaryRow, oldRow: DictionaryRow) => {
    if (newRow.isNew) {
      delete (newRow as any).id;
      addMutation.mutate(newRow);
    } else {
      updateMutation.mutate({ newRow, oldRow });
    }
    return newRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleAddClick = () => {
    const id = Date.now().toString(); // временный идентификатор
    setRows((oldRows) => [...oldRows, { id, nameRu: '', nameKk: '', nameEn: '', code: '', isNew: true } as DictionaryRow]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'code' },
    }));
  };

  const actionsColumn: GridColDef<DictionaryRow> = {
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
            sx={{ color: 'primary.main' }}
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            onClick={handleCancelClick(id)}
          />,
        ];
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={handleEditClick(id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
        />,
      ];
    },
  };

  const columns: GridColDef<DictionaryRow>[] = [
    { field: 'code', headerName: t('code'), width: 150, editable: true, ...fieldIsRequiredProps(t('requiredField')) },
    {
      field: 'nameRu',
      headerName: t('nameRu'),
      width: 300,
      renderCell: (params) => <Link to={`/dashboard/dictionaries/${params.row.id}`}>{params.value}</Link>,
      editable: true,
      ...fieldIsRequiredProps(t('requiredField')),
    },
    { field: 'nameKk', headerName: t('nameKk'), width: 300, editable: true },
    { field: 'nameEn', headerName: t('nameEn'), width: 300, editable: true },
    actionsColumn,
  ];

  useEffect(() => {
    if (data) {
      setRows(data.content.map((dictionary) => ({ ...dictionary, isNew: false })));
    }
  }, [data]);

  return (
    <>
      <CardHeader title={t('dictionaries')} />
      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          pagination
          paginationModel={pagination}
          rowCount={data?.totalElements || 0}
          paginationMode="server"
          onPaginationModelChange={(newPagination) => setPagination(newPagination)}
          loading={isLoading}
          rowSelection={false}
          disableColumnMenu
          disableColumnSorting
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            loadingOverlay: () => <LinearProgress />,
            toolbar: () => (
              <GridToolbarContainer>
                <Button
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddClick}
                  disabled={rows.some((row) => row.isNew)}
                >
                  {t('addDictionary')}
                </Button>
              </GridToolbarContainer>
            ),
          }}
          sx={{
            '& .Mui-error': {
              backgroundColor: 'rgb(126,10,15, 0.1)',
              color: '#750f0f',
            },
            '& .MuiDataGrid-row--editing .MuiDataGrid-cell': {
              backgroundColor: 'rgb(24, 118, 210, 0.1)',
            },
          }}
        />
      </Box>
    </>
  );
};
