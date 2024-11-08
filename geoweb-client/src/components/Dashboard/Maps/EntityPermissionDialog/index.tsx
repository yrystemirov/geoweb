import { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { EntityPermissionDto, EntityType, Permission } from '../../../../api/types/entityPermission';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { entityPermissionAPI } from '../../../../api/entityPermission';
import { useQuery } from '@tanstack/react-query';
import { array, boolean, object, string } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { RoleDto } from '../../../../api/types/role';
import CustomNoRowsOverlay from '../../../common/NoRows/DataGrid';
import { InfiniteScrollSelect } from '../../../common/InfiniteScrollSelect';
import { roleAPI } from '../../../../api/roles';
import { Add, DeleteOutline } from '@mui/icons-material';

type EntityPermissionForm = {
  selectedRoleId?: RoleDto['id'];
  tableData: {
    roleId: RoleDto['id'];
    read?: boolean;
    write?: boolean;
  }[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  entityId: string;
  entityType: EntityType;
  onSubmit: (entities: EntityPermissionDto[]) => void;
  isLoading: boolean;
  title?: string;
};

export const EntityPermissionDialog: FC<Props> = ({
  entityId,
  entityType,
  isLoading,
  onClose,
  onSubmit,
  open,
  title,
}) => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<RoleDto[]>([]);

  const { data: permissions, isLoading: isPermissionsLoading } = useQuery({
    queryKey: ['entityPermissions', entityType, entityId],
    queryFn: () => entityPermissionAPI.getEntityPermissions({ entityType, entityId }).then((res) => res.data),
    staleTime: 0,
  });

  const schema = object<EntityPermissionForm>({
    selectedRoleId: string(),
    tableData: array<EntityPermissionForm>().of(
      object<EntityPermissionForm>().shape({
        roleId: string().required(),
        read: boolean(),
        write: boolean(),
      }),
    ),
  });

  const methods = useForm<EntityPermissionForm>({
    defaultValues: {
      selectedRoleId: '',
      tableData: [],
    },
    // @ts-ignore
    resolver: yupResolver(schema),
  });

  const { handleSubmit } = methods;

  const { watch, setValue, control } = methods;
  const formValues = watch();

  const arrayMethods = useFieldArray({
    control,
    name: 'tableData',
  });
  const columns: GridColDef<EntityPermissionForm['tableData'][0]>[] = [
    {
      field: 'roleId',
      headerName: t('access.role'),
      flex: 1,
      valueFormatter: (value) => roles.find((r) => r.id === value)?.name,
      minWidth: 250,
    },
    {
      field: 'read',
      headerName: t('access.read'),
      flex: 1,
      minWidth: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const index = params.api.getAllRowIds().indexOf(params.id);

        return (
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <Checkbox
                checked={params.row.read}
                onChange={(e) => {
                  arrayMethods.update(index, { ...params.row, read: e.target.checked });
                }}
                color="primary"
              />
            }
            label=""
          />
        );
      },
    },
    {
      field: 'write',
      headerName: t('access.write'),
      flex: 1,
      minWidth: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const index = params.api.getAllRowIds().indexOf(params.id);
        return (
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <Checkbox
                checked={params.row.write}
                onChange={(e) => {
                  arrayMethods.update(index, { ...params.row, write: e.target.checked });
                }}
                color="primary"
              />
            }
            label=""
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: t('actions'),
      align: 'center',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return (
          <Tooltip title={t('delete')}>
            <IconButton
              color="error"
              onClick={() => {
                const index = params.api.getAllRowIds().indexOf(params.id);
                arrayMethods.remove(index);
              }}
            >
              <DeleteOutline />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const prepareAndSubmit = (data: EntityPermissionForm) => {
    const entities = data.tableData.map((d) => ({
      entityId,
      entityType,
      role: { id: d.roleId },
      permissions: [d.read ? Permission.READ : '', d.write ? Permission.WRITE : ''].filter((p) => p) as Permission[],
    }));

    console.log({ entities, formValues });

    onSubmit(entities);
  };

  useEffect(() => {
    if (permissions) {
      setValue(
        'tableData',
        permissions.map((p) => ({
          roleId: p.role.id,
          read: p.permissions.includes(Permission.READ),
          write: p.permissions.includes(Permission.WRITE),
        })),
        {
          shouldDirty: false,
        },
      );

      setRoles((prev) => {
        const newRoles = permissions.map((p) => p.role);
        const uniqueRoles = newRoles.filter((r) => !prev.some((pr) => pr.id === r.id));
        return [...prev, ...uniqueRoles];
      });
    }
  }, [permissions]);

  return (
    <Dialog open={open} onClose={onClose}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(prepareAndSubmit)} style={{ display: 'contents' }} noValidate>
          <DialogTitle>{title || t(`access.${entityType}`)}</DialogTitle>
          <DialogContent>
            <DataGrid
              rows={formValues.tableData}
              columns={columns}
              loading={isPermissionsLoading || isLoading}
              getRowId={(row) => row.roleId!}
              hideFooter
              hideFooterPagination
              rowSelection={false}
              disableColumnMenu
              disableColumnSorting
              slots={{
                noRowsOverlay: () => <CustomNoRowsOverlay text={t('access.noAccess')} />,
              }}
              slotProps={{
                loadingOverlay: {
                  variant: 'linear-progress',
                  noRowsVariant: 'linear-progress',
                },
              }}
              sx={{
                minHeight: 200,
              }}
            />
            <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2} gap={2}>
              <InfiniteScrollSelect
                margin="dense"
                name="selectedRoleId"
                label={t('access.role')}
                fetchFn={roleAPI.getRoles}
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id}
                disabledFn={(option) => formValues.tableData.some((d) => d.roleId === option.id)}
                onChange={(_, role) => {
                  setRoles((prev) => {
                    if (!role || prev.some((r) => r.id === role!.id)) {
                      return prev;
                    }

                    return [...prev, role!];
                  });
                }}
              />
              <Button
                color="primary"
                disabled={!formValues.selectedRoleId}
                type="button"
                onClick={() => {
                  arrayMethods.append({ roleId: formValues.selectedRoleId, read: false, write: false });
                  setValue('selectedRoleId', '', { shouldDirty: false });
                }}
                startIcon={<Add />}
                sx={{ px: 2 }}
              >
                {t('add')}
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>{t('cancel')}</Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isLoading || !methods.formState.isDirty}
            >
              {t('save')}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};