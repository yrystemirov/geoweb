import { Box, Tab, Tabs, Tooltip } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import { AttributeTableTab } from './tab';
import VectorLayer from 'ol/layer/Vector';

// import { translateField } from 'utils/data.utils';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import VectorSource from 'ol/source/Vector';
import { usePublicMapStore } from '../../../hooks/usePublicMapStore';

export const AttributeTabsPanel = (props: any) => {
  const {
    map,
    attributeTables,
    setAttributeTables,
    currentAttributeTable,
    setCurrentAttributeTable,
    systemThemeColor,
  } = usePublicMapStore();

  const [selectedTab, setSelectedTab] = useState<string>();

  const [toggle, setToggle] = useState<boolean>(false);
  // const { locale } = useRouter();
  // const { t } = useTranslation();

  const changeCurrentTab = (event: React.SyntheticEvent, tab: string) => {
    setSelectedTab(tab);
    let cTable = attributeTables.filter(at=>at.id==tab)[0];
    setCurrentAttributeTable(cTable);
  };
  const handleClose = (layer: any) => {
    let arr: any[] = attributeTables.filter((item: any) => item.id !== layer.id);
    setAttributeTables(arr);
    if (layer.id == selectedTab && arr.length > 0) {
      setSelectedTab(arr[0].id);
      setCurrentAttributeTable(arr[0].id);
    }
    if (arr.length == 0) {
      setSelectedTab(undefined);
      setCurrentAttributeTable('');
    }

    const attrTableVectorName = 'attributePanelVectorLayer';
    let layerExists =
      map!
        .getLayers()
        .getArray()
        .filter((layer_: any) => {
          return layer_.getProperties()?.code == attrTableVectorName;
        }).length > 0;
    let vector = new VectorLayer();
    if (layerExists) {
      vector = map!
        .getLayers()
        .getArray()
        .filter((layer_: any) => {
          return layer_.getProperties()?.code == attrTableVectorName;
        })[0] as VectorLayer<VectorSource>;
      if (arr.length == 0 || layer.id == selectedTab) {
        vector?.getSource()?.clear();
        vector.setVisible(false);
      }
      map?.updateSize();
    }
  };

  useEffect(() => {
    if (!currentAttributeTable) return;
    setSelectedTab(currentAttributeTable.id);
  }, [currentAttributeTable]);

  const changeToggle = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          left: props.toggle ? '0px' : '400px',
          position: 'fixed',
          bottom: '0px',
          height: '270px',
          width: '100%',
          background: '#ffffff',
          zIndex: 1000000000,
        }}
        className="gis__attr-table"
      >
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
          <Tabs
            value={selectedTab}
            onChange={changeCurrentTab}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
            sx={{ minHeight: '36px', height: '36px' }}
          >
            {attributeTables.map((layer: any, index) => {
              return (
                <Tab
                  key={layer?.id}
                  aria-label=""
                  title={layer.nameRu}
                  value={layer?.id}
                  label={
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: selectedTab == layer.id ? 'white' : 'black',
                      }}
                    >
                      {layer.nameRu}
                      <CloseIcon fontSize="small" sx={{ marginLeft: '10px' }} onClick={() => handleClose(layer)} />
                    </div>
                  }
                  sx={{
                    height: '36px',
                    paddingTop: '0px',
                    background: selectedTab === layer.id ? systemThemeColor : 'white',
                  }}
                />
              );
            })}
          </Tabs>
        </Box>

        {attributeTables.map((layer: any, index) => {
          return (
            <Box
              key={index}
              width="100%"
              height="100%"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              sx={{ display: selectedTab === layer.id?'block':'none' }}
            >
              <AttributeTableTab key="attr-table2" layer={layer} />
            </Box>
          );
        })}
      </div>
    </>
  );
};
