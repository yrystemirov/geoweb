import { Box, CardHeader } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import CheckboxTree, { Node } from 'react-checkbox-tree';
import { Folder, FolderOpen, Image, KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { MapFolderActionsMenu } from '../../MapFolder/ActionsMenu';
import { mapFoldersAPI } from '../../../../../api/mapFolders';
import { GoBackButton } from '../../../../common/goBackButton';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FolderTreeDto, LayerDto } from '../../../../../api/types/mapFolders';
import { useTranslatedProp } from '../../../../../hooks/useTranslatedProp';
import ConfirmDialog from '../../../../common/confirm';
import i18n from '../../../../../i18n';
import { useNotifications } from '@toolpad/core';
import { constants } from '../../../../../constants';
import { Dialog } from '../../../../common/dialog';
import { MapFolderEditForm } from '../../MapFolder/EditForm';
import { MapFolderCreateForm } from '../../MapFolder/CreateForm';
import { LayerForm } from '../../MapFolder/LayerForm';
import { layersAPI } from '../../../../../api/layer';

enum DialogType {
  none = '',
  addLayer = 'addLayer',
  create = 'create',
  edit = 'edit',
  editLayer = 'editLayer',
  delete = 'delete',
  deleteLayer = 'deleteLayer',
}

export const MapFolderEditLayers: FC = () => {
  const notifications = useNotifications();
  const [expanded, setExpanded] = useState<string[]>([]);
  const navigate = useNavigate();
  const nameProp = useTranslatedProp('name');
  const { t } = useTranslation();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState<{ type: DialogType; selectedItem: FolderTreeDto | LayerDto | null }>({
    type: DialogType.none,
    selectedItem: null,
  });

  const onClose = () => {
    setOpenDialog({ type: DialogType.none, selectedItem: null });
  };

  const handleError = (error: any) => {
    const hasTranslation = i18n.exists(error?.response?.data?.message);
    const message = hasTranslation ? t(error.response.data.message) : t('errorOccurred');
    notifications.show(message, { severity: 'error', autoHideDuration: constants.ntfHideDelay });
  };

  const { data: treeData, refetch } = useQuery({
    queryKey: ['mapTree', id, 'tree'],
    queryFn: () => mapFoldersAPI.getFolderTree(id!).then((res) => res.data),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mapFoldersAPI.deleteFolder(id).then((res) => res.data),
    onSuccess: () => {
      refetch();
      onClose();
    },
    onError: handleError,
  });

  const deleteLayerMutation = useMutation({
    mutationFn: (id: string) => layersAPI.deleteLayer(id).then((res) => res.data),
    onSuccess: () => {
      refetch();
      onClose();
    },
    onError: handleError,
  });

  const recursiveConvertToTreeNode = (data: FolderTreeDto): Node => {
    return {
      value: data.id,
      label: (
        <Box display={'flex'} alignItems={'center'}>
          {data[nameProp]}
          <MapFolderActionsMenu
            onAdd={() => setOpenDialog({ type: DialogType.create, selectedItem: data })}
            onDelete={() => setOpenDialog({ type: DialogType.delete, selectedItem: data })}
            onEdit={() => setOpenDialog({ type: DialogType.edit, selectedItem: data })}
            onAddLayer={() => setOpenDialog({ type: DialogType.addLayer, selectedItem: null })}
          />
        </Box>
      ),
      children: data.children
        .map((child) => recursiveConvertToTreeNode(child))
        .concat(
          data.layers.map((layer) => ({
            value: layer.id,
            label: (
              <Box display={'flex'} alignItems={'center'}>
                {layer[nameProp]}
                <MapFolderActionsMenu
                  onEditLayer={() => setOpenDialog({ type: DialogType.editLayer, selectedItem: layer })}
                  onDeleteLayer={() => setOpenDialog({ type: DialogType.deleteLayer, selectedItem: layer })}
                />
              </Box>
            ),
            ['data' as any]: { ...layer }, // если не надо, удалить
          })),
        ),
      ['data' as any]: { ...data }, // если не надо, удалить
    };
  };

  const treeNodes = treeData ? [recursiveConvertToTreeNode(treeData)] : [];

  const selectedItemNameTitle = useMemo(() => {
    if (openDialog.selectedItem) {
      return openDialog.selectedItem[nameProp] ? `"${openDialog.selectedItem[nameProp]}": ` : '';
    }
    return '';
  }, [openDialog.selectedItem, nameProp]);

  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
        <GoBackButton text={t('backToList')} onClick={() => navigate('/dashboard/maps')} />
        <CardHeader title={t('maps.editStructure')} sx={{ textAlign: 'center', flex: 1 }} />
      </Box>
      <Box className="edit-layers-tree">
        <CheckboxTree
          nodes={treeNodes}
          expanded={expanded}
          onExpand={(v) => setExpanded(v)}
          icons={{
            expandClose: <KeyboardArrowRight className="rct-icon rct-icon-expand-close" />,
            expandOpen: <KeyboardArrowDown />,
            check: null,
            halfCheck: null,
            uncheck: null,
            leaf: <Image className="rct-icon rct-icon-leaf" />,
            parentOpen: <FolderOpen />,
            parentClose: <Folder />,
          }}
        />
        <Dialog
          open={openDialog.type === DialogType.create}
          onClose={onClose}
          title={`${selectedItemNameTitle}${t('maps.addFolder')}`}
        >
          <MapFolderCreateForm
            parentId={openDialog.selectedItem?.id}
            onSuccess={() => {
              onClose();
              refetch();
            }}
            onCancel={onClose}
          />
        </Dialog>
        <Dialog open={openDialog.type === DialogType.edit} onClose={onClose} title={t('editProperties')}>
          <MapFolderEditForm
            id={openDialog.selectedItem?.id}
            onSuccess={() => {
              onClose();
              refetch();
            }}
            onCancel={onClose}
          />
        </Dialog>
        <Dialog
          open={openDialog.type === DialogType.addLayer}
          onClose={onClose}
          title={`${selectedItemNameTitle}${t('maps.addLayer')}`}
        >
          <LayerForm
            onSuccess={() => {
              onClose();
              refetch();
            }}
            onCancel={onClose}
          />
        </Dialog>
        <Dialog open={openDialog.type === DialogType.editLayer} onClose={onClose} title={`${selectedItemNameTitle}${t('maps.editLayer')}`}>
          <LayerForm
            editLayerId={openDialog.selectedItem?.id}
            onSuccess={() => {
              onClose();
              refetch();
            }}
            onCancel={onClose}
          />
        </Dialog>
        <ConfirmDialog
          open={openDialog.type === DialogType.delete}
          onClose={onClose}
          onSubmit={() => deleteMutation.mutate(openDialog.selectedItem!.id)}
          title={t('maps.deleteFolder')}
          isLoading={deleteMutation.isPending}
        >
          {t('deleteConfirmDescription')}
        </ConfirmDialog>
        <ConfirmDialog
          open={openDialog.type === DialogType.deleteLayer}
          onClose={onClose}
          onSubmit={() => deleteLayerMutation.mutate(openDialog.selectedItem!.id)}
          title={t('maps.deleteLayer')}
          isLoading={deleteLayerMutation.isPending}
        >
          {t('deleteConfirmDescription')}
        </ConfirmDialog>
      </Box>
    </>
  );
};