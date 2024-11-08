import { Box, CardHeader } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import CheckboxTree, { Node } from 'react-checkbox-tree';
import { Folder, FolderOpen, Image, KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { MapFolderActionsMenu } from '../../MapFolder/ActionsMenu';
import { mapFoldersAPI } from '../../../../../api/mapFolders';
import { GoBackButton } from '../../../../common/GoBackButton';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FolderTreeDto, LayerDto } from '../../../../../api/types/mapFolders';
import { useTranslatedProp } from '../../../../../hooks/useTranslatedProp';
import ConfirmDialog from '../../../../common/Confirm';
import { Dialog } from '../../../../common/Dialog';
import { MapFolderEditForm } from '../../MapFolder/EditForm';
import { MapFolderCreateForm } from '../../MapFolder/CreateForm';
import { LayerForm } from '../../../Layers/Form';
import { layersAPI } from '../../../../../api/layer';
import { uuidv4 } from '../../../../../utils/uidv4';
import { useNotify } from '../../../../../hooks/useNotify';
import { dashboardUrl } from '../../../routes';
import { EntityPermissionDto, EntityType } from '../../../../../api/types/entityPermission';
import { entityPermissionAPI } from '../../../../../api/entityPermission';
import { EntityPermissionDialog } from '../../EntityPermissionDialog';

enum DialogType {
  none = '',
  createFolder = 'createFolder',
  editFolder = 'editFolder',
  deleteFolder = 'deleteFolder',
  addLayer = 'addLayer',
  editLayer = 'editLayer',
  deleteLayer = 'deleteLayer',
  removeLayerFromFolder = 'removeLayerFromFolder',
  removeLayerFromAllFolders = 'removeLayerFromAllFolders',
  editPermissions = 'editPermissions',
}

export const MapFolderEditLayers: FC = () => {
  const { showSuccess, showError } = useNotify();
  const [expanded, setExpanded] = useState<string[]>([]);
  const navigate = useNavigate();
  const nameProp = useTranslatedProp('name');
  const { t } = useTranslation();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState<{
    type: DialogType;
    selectedItem: { layer?: LayerDto; folder?: FolderTreeDto } | null;
  }>({
    type: DialogType.none,
    selectedItem: null,
  });

  const closeDialogs = () => {
    setOpenDialog({ type: DialogType.none, selectedItem: null });
  };

  const onError = (error: any) => {
    showError({ error });
  };

  const { data: treeData, refetch } = useQuery({
    queryKey: ['mapTree', id, 'tree'],
    queryFn: () => mapFoldersAPI.getFolderTree(id!).then((res) => res.data),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => mapFoldersAPI.deleteFolder(id).then((res) => res.data),
    onSuccess: () => {
      handleSuccess();
      showSuccess();
    },
    onError,
  });

  const deleteLayerMutation = useMutation({
    mutationFn: (id: string) => layersAPI.deleteLayer(id).then((res) => res.data),
    onSuccess: () => {
      handleSuccess();
      showSuccess();
    },
    onError,
  });

  const getAndRemoveLayerFromFolderMutation = useMutation({
    mutationFn: (layerId: string) => layersAPI.getLayer(layerId).then((res) => res.data),
    onSuccess: (data) => {
      editLayerMutation.mutate({
        ...data,
        folders: data.folders.filter((f) => f.id !== openDialog.selectedItem?.folder?.id),
      });
    },
    onError,
  });

  const getAndRemoveLayerFromAllFoldersMutation = useMutation({
    mutationFn: (layerId: string) => layersAPI.getLayer(layerId).then((res) => res.data),
    onSuccess: (data) => {
      editLayerMutation.mutate({ ...data, folders: [] });
    },
    onError,
  });

  const editLayerMutation = useMutation({
    mutationFn: (layer: LayerDto) => layersAPI.updateLayer(layer.id, layer),
    onSuccess: () => {
      handleSuccess();
      showSuccess();
    },
    onError,
  });

  const entitiesMutation = useMutation({
    mutationFn: (e: EntityPermissionDto[]) => entityPermissionAPI.setEntityPermissions(e).then((res) => res.data),
    onSuccess: () => {
      showSuccess();
      closeDialogs();
    },
    onError: (error) => showError({ error }),
  });

  const handleSuccess = (idToExpand?: string) => {
    closeDialogs();
    refetch();
    addExpand(idToExpand);
  };

  const recursiveConvertToTreeNode = (folder: FolderTreeDto): Node => {
    return {
      value: folder.id,
      label: (
        <Box display={'flex'} alignItems={'center'}>
          {folder[nameProp]}
          <MapFolderActionsMenu
            onAdd={() => setOpenDialog({ type: DialogType.createFolder, selectedItem: { folder } })}
            onDelete={() => setOpenDialog({ type: DialogType.deleteFolder, selectedItem: { folder } })}
            onEdit={() => setOpenDialog({ type: DialogType.editFolder, selectedItem: { folder } })}
            onAddLayer={() => setOpenDialog({ type: DialogType.addLayer, selectedItem: { folder } })}
            onEditPermissions={() => setOpenDialog({ type: DialogType.editPermissions, selectedItem: { folder } })}
          />
        </Box>
      ),
      children: folder.children
        .map((child) => recursiveConvertToTreeNode(child))
        .concat(
          folder.layers.map((layer) => ({
            // вынужденное решение, т.к. react-checkbox-tree не поддерживает дубликаты value, а у нас могут быть папки с одинаковыми слоями
            value: uuidv4(),
            label: (
              <Box display={'flex'} alignItems={'center'}>
                {layer[nameProp]}
                <MapFolderActionsMenu
                  onEditLayer={() => setOpenDialog({ type: DialogType.editLayer, selectedItem: { layer } })}
                  onDeleteLayer={() => setOpenDialog({ type: DialogType.deleteLayer, selectedItem: { layer } })}
                  onRemoveLayerFromFolder={() =>
                    setOpenDialog({ type: DialogType.removeLayerFromFolder, selectedItem: { layer, folder } })
                  }
                  onRemoveLayerFromAllFolders={() =>
                    setOpenDialog({ type: DialogType.removeLayerFromAllFolders, selectedItem: { layer } })
                  }
                  onEditPermissions={() => setOpenDialog({ type: DialogType.editPermissions, selectedItem: { layer } })}
                />
              </Box>
            ),
          })),
        ),
    };
  };

  const treeNodes = treeData ? [recursiveConvertToTreeNode(treeData)] : [];

  const selectedItemName = useMemo(() => {
    if (openDialog.selectedItem) {
      return {
        folder: openDialog.selectedItem.folder?.[nameProp] ? `"${openDialog.selectedItem.folder[nameProp]}"` : '',
        layer: openDialog.selectedItem.layer?.[nameProp] ? `"${openDialog.selectedItem.layer[nameProp]}"` : '',
      };
    }
    return null;
  }, [openDialog.selectedItem, nameProp]);

  console.log({ selectedItemName });
  const addExpand = (id?: string) => {
    if (id && !expanded.includes(id)) {
      setExpanded((prev) => [...prev, id]);
    }
  };

  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
        <GoBackButton text={t('backToList')} onClick={() => navigate(`${dashboardUrl}/maps`)} />
        <CardHeader title={t('maps.editStructure')} sx={{ textAlign: 'center', flex: 1 }} />
      </Box>
      <Box className="layers-tree">
        <CheckboxTree
          nodes={treeNodes}
          expanded={expanded}
          onExpand={(v) => setExpanded(v)}
          icons={{
            expandClose: <KeyboardArrowRight sx={{ fontSize: 20 }} />,
            expandOpen: <KeyboardArrowDown sx={{ fontSize: 20 }} />,
            check: null,
            halfCheck: null,
            uncheck: null,
            leaf: <Image sx={{ fontSize: 20 }} />,
            parentOpen: <FolderOpen sx={{ fontSize: 20 }} />,
            parentClose: <Folder sx={{ fontSize: 20 }} />,
          }}
        />

        <Dialog
          open={openDialog.type === DialogType.createFolder}
          onClose={closeDialogs}
          title={t('maps.addFolderTitle', { folder: selectedItemName?.folder })}
        >
          <MapFolderCreateForm
            parentId={openDialog.selectedItem?.folder?.id}
            onSuccess={() => handleSuccess(openDialog.selectedItem?.folder?.id)}
            onCancel={closeDialogs}
          />
        </Dialog>

        <Dialog
          open={openDialog.type === DialogType.editFolder}
          onClose={closeDialogs}
          title={t('editProperties', { name: selectedItemName?.folder })}
        >
          <MapFolderEditForm
            id={openDialog.selectedItem?.folder?.id}
            onSuccess={handleSuccess}
            onCancel={closeDialogs}
          />
        </Dialog>

        <Dialog
          open={openDialog.type === DialogType.addLayer}
          onClose={closeDialogs}
          title={t('maps.addLayerTitle', { folder: selectedItemName?.folder })}
        >
          <LayerForm
            onSuccess={() => handleSuccess(openDialog.selectedItem?.folder?.id)}
            onCancel={closeDialogs}
            addFolderId={openDialog.selectedItem?.folder?.id}
          />
        </Dialog>

        <Dialog
          open={openDialog.type === DialogType.editLayer}
          onClose={closeDialogs}
          title={t('maps.editLayer', { layer: selectedItemName?.layer })}
        >
          <LayerForm
            editLayerId={openDialog.selectedItem?.layer?.id}
            onSuccess={handleSuccess}
            onCancel={closeDialogs}
          />
        </Dialog>

        <ConfirmDialog
          open={openDialog.type === DialogType.deleteFolder}
          onClose={closeDialogs}
          onSubmit={() => deleteMutation.mutate(openDialog.selectedItem!.folder!.id)}
          title={t('maps.deleteFolder')}
          isLoading={deleteMutation.isPending}
        >
          {t('deleteConfirmDescription')}
        </ConfirmDialog>

        <ConfirmDialog
          open={openDialog.type === DialogType.deleteLayer}
          onClose={closeDialogs}
          onSubmit={() => deleteLayerMutation.mutate(openDialog.selectedItem!.layer!.id)}
          title={t('maps.deleteLayer')}
          isLoading={deleteLayerMutation.isPending}
        >
          {t('deleteConfirmDescription')}
        </ConfirmDialog>

        <ConfirmDialog
          open={openDialog.type === DialogType.removeLayerFromFolder}
          onClose={closeDialogs}
          onSubmit={() => getAndRemoveLayerFromFolderMutation.mutate(openDialog.selectedItem!.layer!.id)}
          title={t('maps.removeLayerFromFolder', { folder: selectedItemName?.folder })}
          isLoading={getAndRemoveLayerFromFolderMutation.isPending}
        >
          {t('maps.removeLayerFromFolderDescription', {
            layer: selectedItemName?.layer,
            folder: selectedItemName?.folder,
          })}
        </ConfirmDialog>

        <ConfirmDialog
          open={openDialog.type === DialogType.removeLayerFromAllFolders}
          onClose={closeDialogs}
          onSubmit={() => getAndRemoveLayerFromAllFoldersMutation.mutate(openDialog.selectedItem!.layer!.id)}
          title={t('maps.removeLayerFromAllFolders')}
          isLoading={getAndRemoveLayerFromAllFoldersMutation.isPending}
        >
          {t('deleteConfirmDescription')}
        </ConfirmDialog>

        {openDialog.type === DialogType.editPermissions && (
          <EntityPermissionDialog
            title={
              openDialog.selectedItem?.folder
                ? t('access.FOLDER', { name: selectedItemName?.folder })
                : t('access.LAYER', { name: selectedItemName?.layer })
            }
            open
            onClose={() => closeDialogs()}
            entityId={openDialog.selectedItem?.folder?.id || openDialog.selectedItem?.layer?.id!}
            entityType={openDialog.selectedItem?.folder ? EntityType.FOLDER : EntityType.LAYER}
            onSubmit={entitiesMutation.mutate}
            isLoading={entitiesMutation.isPending}
          />
        )}
      </Box>
    </>
  );
};