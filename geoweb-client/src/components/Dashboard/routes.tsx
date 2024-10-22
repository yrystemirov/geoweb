import {
  Dashboard as DashboardIcon,
  Map as MapIcon,
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
import { Params, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayerForm } from './Layers/Form';
import { LayerAttrs } from './LayerAttrs';
import { LayerAttrForm } from './LayerAttrs/Form';
import { LayerStyleEditor } from './Layers/Style';

export type DashboardRoute = {
  text?: string;
  path: string;
  icon?: JSX.Element;
  component: JSX.Element;
  isMenuItem?: boolean;
  children?: DashboardRoute[];
};

type ChildPageLayoutProps = {
  backTitle?: string;
  goBackPath: string | ((queryParams: Readonly<Params<string>>) => string);
  title: string;
  titleParams?: Record<string, string>;
  children: React.ReactNode;
};

export const ChildPageLayout: React.FC<ChildPageLayoutProps> = ({
  backTitle = 'backToList',
  goBackPath,
  title,
  titleParams,
  children,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryParams = useParams();
  const onGoBakClick = () => {
    switch (typeof goBackPath) {
      case 'string':
        navigate(goBackPath);
        break;
      case 'function':
        navigate(goBackPath(queryParams));
        break;
    }
  };
  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
        <GoBackButton text={t(backTitle)} onClick={onGoBakClick} />
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
          <ChildPageLayout  goBackPath={`${parentUrl}/users`} title={'users.create'}>
            <UserCreateForm goBackPath={`${parentUrl}/users`} />
          </ChildPageLayout>
        ),
      },
      {
        path: '/users/:id/edit',
        component: (
          <ChildPageLayout
            
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
          <ChildPageLayout  goBackPath={`${parentUrl}/maps`} title={'maps.addMap'}>
            <MapFolderCreateForm goBackPath={`${parentUrl}/maps`} />
          </ChildPageLayout>
        ),
      },
      {
        path: '/maps/:id/edit',
        component: (
          <ChildPageLayout
            
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
        path: '/layers/add',
        component: (
          <ChildPageLayout  goBackPath={`${parentUrl}/layers`} title={'maps.addLayer'}>
            <LayerForm goBackPath={`${parentUrl}/layers`} />
          </ChildPageLayout>
        ),
      },
      {
        path: '/layers/:layerId/edit',
        component: (
          <ChildPageLayout
            
            goBackPath={`${parentUrl}/layers`}
            title={'editProperties'}
            titleParams={{ name: '' }}
          >
            <LayerForm goBackPath={`${parentUrl}/layers`} />
          </ChildPageLayout>
        ),
      },
      {
        path: '/layers/:layerId/attrs',
        component: <LayerAttrs />,
      },
      {
        path: '/layers/:layerId/style',
        component: <LayerStyleEditor />,
      },
      {
        path: '/layers/:layerId/attrs/add',
        component: (
          <ChildPageLayout
            
            goBackPath={(params) => `${parentUrl}/layers/${params.layerId}/attrs`}
            title={'attrs.create'}
          >
            <LayerAttrForm shouldGoBackToList />
          </ChildPageLayout>
        ),
      },
      {
        path: '/layers/:layerId/attrs/:attrId/edit',
        component: (
          <ChildPageLayout
            
            goBackPath={(params) => `${parentUrl}/layers/${params.layerId}/attrs`}
            title={'editProperties'}
            titleParams={{ name: '' }}
          >
            <LayerAttrForm shouldGoBackToList />
          </ChildPageLayout>
        ),
      },
    ],
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