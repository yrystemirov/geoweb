import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { FolderTreeDto } from '../../../api/types/mapFolders';
import { Box, IconButton, Paper, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LibraryAddCheck } from '@mui/icons-material';
import CheckboxTree, { Node } from 'react-checkbox-tree';
import { useTranslatedProp } from '../../../hooks/useTranslatedProp';
import { uuidv4 } from '../../../utils/uidv4';
import { icons } from './data';
import { common } from '@mui/material/colors';
import { usePublicMapStore } from '../../../hooks/usePublicMapStore';
import { LayerActionsMenu } from './ActionsMenu';

interface Props {
  color?: CSSProperties['background'];
  publicMaps?: FolderTreeDto[];
}

export const LayerPanel: React.FC<Props> = ({ color = 'rgb(64 152 68 / 70%)', publicMaps }) => {
  const { t } = useTranslation();
  const nameProp = useTranslatedProp('name');
  const { userLayers } = usePublicMapStore();

  const [expanded, setExpanded] = useState<{ [mapId: string]: string[] }>({});
  const [checked, setChecked] = useState<{ [mapId: string]: string[] }>({});
  const [open, setOpen] = useState(false);

  const recursiveConvertToTreeNode = (folder: FolderTreeDto): Node => {
    return {
      value: folder.id,
      label: <Typography color={common.black}>{folder[nameProp]}</Typography>,
      children: folder.children
        .map((child) => recursiveConvertToTreeNode(child))
        .concat(
          folder.layers.map((layer) => ({
            value: `${uuidv4()}.${layer.id}`, // NOTE: вынужденное решение, т.к. react-checkbox-tree не поддерживает дубликаты value, а у нас могут быть папки с одинаковыми слоями
            label: (
              <Box display={'flex'} alignItems={'center'}>
                <Typography color={common.black}>{layer[nameProp]}</Typography>
                <LayerActionsMenu layer={layer} />
              </Box>
            ),
          })),
        ),
    };
  };

  const mapNodes = useMemo(() => publicMaps?.map((folder) => recursiveConvertToTreeNode(folder)), [publicMaps]);

  const switchLayerVisibility = (checked: { [key: string]: string[] }) => {
    userLayers.forEach((layer) => {
      const layerId = layer.getProperties().systemLayerProps.id;
      const isVisible = Object.values(checked)
        .flat()
        .map((id) => id.split('.')[1]) // очищаем от uuidv4
        .includes(layerId);

      layer.setVisible(isVisible);
    });
  };

  useEffect(() => {
    switchLayerVisibility(checked);
  }, [checked]);

  return (
    <>
      <Tooltip title={t('maps.title')} placement="left">
        <IconButton
          style={{
            background: color,
            borderRadius: 0,
          }}
          onClick={() => setOpen(!open)}
          sx={{ color: 'white' }}
        >
          <LibraryAddCheck />
        </IconButton>
      </Tooltip>
      {open && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            left: 50,
            minWidth: 300,
            maxWidth: '50vw',
            minHeight: 250,
            maxHeight: '50vh',
            py: 2,
            zIndex: 1,
            overflow: 'scroll',
          }}
        >
          {mapNodes?.map((mapNode) => (
            <Box className="layers-tree" key={mapNode.value} sx={{ borderBottom: '1px solid #e0e0e0', p: 1, color }}>
              <CheckboxTree
                nodes={[mapNode]}
                checked={checked[mapNode.value] || []}
                expanded={expanded[mapNode.value] || []}
                onCheck={(checked: string[]) => {
                  setChecked((prev) => ({ ...prev, [mapNode.value]: checked }));
                }}
                onExpand={(expanded: string[]) => {
                  setExpanded((prev) => ({ ...prev, [mapNode.value]: expanded }));
                }}
                icons={icons}
              />
            </Box>
          ))}
        </Paper>
      )}
    </>
  );
};