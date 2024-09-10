import { useState } from 'react';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LinearProgress } from '@mui/material';
import { dictionariesAPI } from '../../../../api/dictioanries';
import { useTranslation } from 'react-i18next';
import { EntryDto } from '../../../../api/types/dictioanries';
import CustomNoRowsOverlay from '../../../common/nodata/DataGrid';

export const DictionaryEntries = () => {
  const { t } = useTranslation();
  const { id: dictionaryId } = useParams();
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });

  const { data, isLoading } = useQuery({
    queryKey: ['dictionaryEntries', dictionaryId],
    queryFn: () => dictionariesAPI.getEntries(dictionaryId!, { page: pagination.page, size: pagination.pageSize }).then((res) => res.data),
    enabled: !!dictionaryId,
  });

  const columns: GridColDef<EntryDto>[] = [
    { field: 'rank', headerName: '№', width: 100 },
    { field: 'ru', headerName: t('nameRu'), width: 300 },
    { field: 'kk', headerName: t('nameKk'), width: 300 },
    { field: 'en', headerName: t('nameEn'), width: 300 },
    { field: 'code', headerName: t('code'), width: 300 },
  ];

  return (
    <DataGrid<EntryDto>
      rows={data?.content || []}
      columns={columns}
      pagination
      paginationModel={pagination}
      paginationMode="server"
      rowCount={data?.totalElements || 0}
      onPaginationModelChange={(newPagination) => setPagination(newPagination)}
      loading={isLoading}
      slots={{
        noRowsOverlay: CustomNoRowsOverlay,
        loadingOverlay: () => <LinearProgress />,
      }}
      rowSelection={false}
      disableColumnMenu
      disableColumnSorting
    />
  );
};
