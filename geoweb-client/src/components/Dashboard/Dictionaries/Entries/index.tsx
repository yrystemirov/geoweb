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
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LinearProgress, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { dictionariesAPI } from '../../../../api/dictioanries';
import { useTranslation } from 'react-i18next';
import { EntryDto, EntryRequestDto } from '../../../../api/types/dictioanries';
import CustomNoRowsOverlay from '../../../common/nodata/DataGrid';

export type EntryDtoRow = EntryDto & { isNew?: boolean };

export const DictionaryEntries = () => {
  const { t } = useTranslation();
  const { id: dictionaryId } = useParams() as { id: string };
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const [rows, setRows] = useState<EntryDtoRow[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['dictionaryEntries', dictionaryId],
    queryFn: () =>
      dictionariesAPI
        .getEntries(dictionaryId, { page: pagination.page, size: pagination.pageSize })
        .then((res) => res.data),
    enabled: !!dictionaryId,
  });

  const addMutation = useMutation({
    mutationFn: (newEntry: EntryRequestDto) => dictionariesAPI.addEntry(newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dictionaryEntries', dictionaryId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updatedEntry: EntryRequestDto) => dictionariesAPI.updateEntry(updatedEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dictionaryEntries', dictionaryId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dictionariesAPI.deleteEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dictionaryEntries', dictionaryId] });
    },
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
    deleteMutation.mutate(id as string);
    setRows(rows.filter((row) => row.id !== id));
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

  const processRowUpdate = (newRow: EntryDtoRow) => {
    const entryData = {
      ...newRow,
      dictionaryId,
    };
    if (newRow.isNew) {
      delete (entryData as any).id;
      addMutation.mutate(entryData);
    } else {
      updateMutation.mutate(entryData);
    }
    setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)));
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
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'ru' },
    }));
  };

  const columns: GridColDef[] = [
    { field: 'rank', headerName: '№', width: 100 },
    { field: 'ru', headerName: t('nameRu'), width: 300, editable: true },
    { field: 'kk', headerName: t('nameKk'), width: 300, editable: true },
    { field: 'en', headerName: t('nameEn'), width: 300, editable: true },
    { field: 'code', headerName: t('code'), width: 300, editable: true },
    {
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
    },
  ];

  useEffect(() => {
    if (data) {
      setRows(data.content.map((entry) => ({ ...entry, isNew: false })));
    }
  }, [data]);

  return (
    <div>
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
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
          loadingOverlay: () => <LinearProgress />,
          toolbar: () => (
            <GridToolbarContainer>
              <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
                {t('addRecord')}
              </Button>
            </GridToolbarContainer>
          ),
        }}
      />
    </div>
  );
};
