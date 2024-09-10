import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dictionariesAPI } from '../../../api/dictioanries';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CustomNoRowsOverlay from '../../common/nodata/DataGrid';

export const Dictionaries: FC = () => {
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 25 });
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['dictionaries', pagination],
    queryFn: () => dictionariesAPI.getDictionaries({ page: pagination.page, size: pagination.pageSize }).then((res) => res.data),
  });

  const columns: GridColDef[] = [
    {
      field: 'nameRu',
      headerName: t('nameRu'),
      width: 300,
      renderCell: (params) => <Link to={`/dashboard/dictionaries/${params.row.id}`}>{params.value}</Link>,
    },
    { field: 'nameKk', headerName: t('nameKk'), width: 300 },
    { field: 'nameEn', headerName: t('nameEn'), width: 300 },
    { field: 'code', headerName: t('code'), width: 150 },
  ];

  const dictionaries = data?.content || [];
  const rowCount = data?.totalElements || 0;

  return (
    <DataGrid
      rows={dictionaries}
      columns={columns}
      pagination
      paginationModel={pagination}
      rowCount={rowCount}
      paginationMode="server"
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
