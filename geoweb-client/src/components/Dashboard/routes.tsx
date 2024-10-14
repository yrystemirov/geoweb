import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
  Settings as SettingsIcon,
  Group as GrouprIcon,
  AdminPanelSettings as RolesIcon,
  Layers as LayersIcon,
} from '@mui/icons-material';
import { Dictionaries } from './Dictionaries';
import { DictionaryEntries } from './Dictionaries/Entries';
import { MapFolders } from './Maps/Index';
import { MapFolderEditForm } from './Maps/MapFolder/EditForm';
import { MapFolderEditLayers } from './Maps/Index/MapEditLayers';
import { MapFolderCreateForm } from './Maps/MapFolder/CreateForm';
import { Users } from './Users';
import { UserCreateForm } from './Users/CreateForm';
import { UserEditForm } from './Users/EditForm';
import { Roles } from './Roles';
import { Layers } from './Layers';
import { GoBackButton } from '../common/GoBackButton';
import { Box, CardHeader } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayerForm } from './Maps/MapFolder/LayerForm';

export type DashboardRoute = {
  text?: string;
  path: string;
  icon?: JSX.Element;
  component: JSX.Element;
  isMenuItem?: boolean;
  children?: DashboardRoute[];
};

type ChildPageLayoutProps = {
  backTitle: string;
  goBackPath: string;
  title: string;
  titleParams?: Record<string, string>;
  children: React.ReactNode;
};

const ChildPageLayout: React.FC<ChildPageLayoutProps> = ({ backTitle, goBackPath, title, titleParams, children }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
        <GoBackButton text={t(backTitle)} onClick={() => navigate(goBackPath)} />
        <CardHeader title={t(title, titleParams)} sx={{ textAlign: 'center', flex: 1 }} />
      </Box>
      {children}
    </>
  );
};

export const parentUrl = '/dashboard';

export const routes: DashboardRoute[] = [
  {
    text: 'users.title',
    path: '/users',
    icon: <GrouprIcon />,
    component: <Users />,
    isMenuItem: true,
    children: [
      {
        text: 'roles.title',
        path: '/roles',
        icon: <RolesIcon />,
        component: <Roles />,
        isMenuItem: true,
      },
      {
        path: '/users/add',
        component: (
          <ChildPageLayout backTitle={'backToList'} goBackPath={`${parentUrl}/users`} title={'users.create'}>
            <UserCreateForm goBackPath={`${parentUrl}/users`} />
          </ChildPageLayout>
        ),
      },
      {
        path: '/users/:id/edit',
        component: (
          <ChildPageLayout
            backTitle={'backToList'}
            goBackPath={`${parentUrl}/users`}
            title={'editProperties'}
            titleParams={{ name: '' }}
          >
            <UserEditForm goBackPath={`${parentUrl}/users`} />
          </ChildPageLayout>
        ),
      },
    ],
  },
  {
    text: 'maps.title',
    path: '/maps',
    icon: <MapIcon />,
    component: <MapFolders />,
    isMenuItem: true,
    children: [
      {
        path: '/maps/add',
        component: (
          <ChildPageLayout backTitle={'backToList'} goBackPath={`${parentUrl}/maps`} title={'maps.addMap'}>
            <MapFolderCreateForm goBackPath={`${parentUrl}/maps`} />
          </ChildPageLayout>
        ),
      },
      {
        path: '/maps/:id/edit',
        component: (
          <ChildPageLayout
            backTitle={'backToList'}
            goBackPath={`${parentUrl}/maps`}
            title={'editProperties'}
            titleParams={{ name: '' }}
          >
            <MapFolderEditForm goBackPath={`${parentUrl}/maps`} />
          </ChildPageLayout>
        ),
      },
      { path: '/maps/:id/edit-layers', component: <MapFolderEditLayers /> },
    ],
  },
  {
    text: 'layers',
    path: '/layers',
    icon: <LayersIcon />,
    component: <Layers />,
    isMenuItem: true,
    children: [
      {
        path: '/layers/:layerId/edit',
        component: (
          <ChildPageLayout
            backTitle={'backToList'}
            goBackPath={`${parentUrl}/layers`}
            title={'editProperties'}
            titleParams={{ name: '' }}
          >
            <LayerForm goBackPath={`${parentUrl}/layers`} />
          </ChildPageLayout>
        ),
      },
      {
        path: '/layers/add',
        component: (
          <ChildPageLayout backTitle={'backToList'} goBackPath={`${parentUrl}/layers`} title={'maps.addLayer'}>
            <LayerForm goBackPath={`${parentUrl}/layers`} />
          </ChildPageLayout>
        ),
      },
    ],
  },
  {
    text: 'layerAttributes',
    path: '/layerAttributes',
    icon: <SettingsIcon />,
    component: <>{'layerAttributes'}</>,
    isMenuItem: true,
  },
  {
    text: 'dictionaries',
    path: '/dictionaries',
    icon: <DashboardIcon />,
    component: <Dictionaries />,
    isMenuItem: true,
    children: [
      {
        path: '/dictionaries/:id',
        component: <DictionaryEntries />,
      },
    ],
  },
];
