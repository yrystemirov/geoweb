import { Box, CardHeader } from '@mui/material';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import CheckboxTree, { Node } from 'react-checkbox-tree';
import { Folder, FolderOpen, Image, KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { MapFolderActionsMenu } from '../../MapFolder/ActionsMenu';
import { mapFoldersAPI } from '../../../../../api/mapFolders';
import { GoBackButton } from '../../../../common/goBackButton';
import { MapFolderCreateDialog } from '../../MapFolder/CreateDialog';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { FolderTreeDto } from '../../../../../api/types/mapFolders';
import { useTranslatedProp } from '../../../../../hooks/useTranslatedProp';
import ConfirmDialog from '../../../../common/confirm';
import i18n from '../../../../../i18n';
import { useNotifications } from '@toolpad/core';
import { constants } from '../../../../../constants';

enum DialogType {
  none = '',
  create = 'create',
  delete = 'delete',
}

export const MapFolderEditLayers: FC = () => {
  const notifications = useNotifications();
  const [expanded, setExpanded] = useState<string[]>([]);
  const navigate = useNavigate();
  const translatedNameProp = useTranslatedProp('name');
  const { t } = useTranslation();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState<{ type: DialogType; selectedItem: FolderTreeDto | null }>({
    type: DialogType.none,
    selectedItem: null,
  });

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
      setOpenDialog({ type: DialogType.none, selectedItem: null });
    },
    onError: handleError,
  });

  const recursiveConvertToTreeNode = (data: FolderTreeDto): Node => {
    return {
      value: data.id,
      label: (
        <Box display={'flex'} alignItems={'center'}>
          {data[translatedNameProp]}
          <MapFolderActionsMenu
            onAdd={() => setOpenDialog({ type: DialogType.create, selectedItem: data })}
            onDelete={() => setOpenDialog({ type: DialogType.delete, selectedItem: data })}
          />
        </Box>
      ),
      children: data.children
        .map((child) => recursiveConvertToTreeNode(child))
        .concat(
          data.layers.map((layer) => ({
            value: layer.id,
            label: <>{layer[translatedNameProp]}</>,
            ['data' as any]: { ...layer }, // если не надо, удалить
          })),
        ),
      ['data' as any]: { ...data }, // если не надо, удалить
    };
  };

  const treeNodes = treeData ? [recursiveConvertToTreeNode(treeData)] : [];

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
        <MapFolderCreateDialog
          open={openDialog.type === DialogType.create}
          onClose={() => setOpenDialog({ type: DialogType.none, selectedItem: null })}
          parent={openDialog.selectedItem}
          onSuccess={() => {
            refetch();
            setExpanded([...expanded, openDialog.selectedItem!.id]);
          }}
        />
        <ConfirmDialog
          open={openDialog.type === DialogType.delete}
          onClose={() => setOpenDialog({ type: DialogType.none, selectedItem: null })}
          onSubmit={() => deleteMutation.mutate(openDialog.selectedItem!.id)}
          title={t('maps.deleteFolder')}
          isLoading={deleteMutation.isPending}
        >
          {t('deleteConfirmDescription')}
        </ConfirmDialog>
      </Box>
    </>
  );
};