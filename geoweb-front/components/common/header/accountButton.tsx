//import { useAuth } from 'modules/auth/hooks/useAuth';
//import { getStoredCurrentOrgtreeBin, useUser } from 'modules/auth/hooks/useUser';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
//import { useTranslation } from 'next-i18next';

export default function AccountButton() {
    //const { t } = useTranslation();
    const router = useRouter();
    //const { user } = useUser();
    //const { logout } = useAuth();

    const [renderButton, setRenderButton] = useState(1);

    const settings = [
        { title: ('common:Профиль'), url: '/portal/user/profile' },
        { title: ('common:Личный кабинет'), url: '/portal/user/personal-account' },
        { title: ('common:История получения услуг'), url: '/portal/my-services' },
        {
            title: 'Выход',
            action: () => {
                //logout();
                router.push('/');
            },
        },
    ];

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    useEffect(() => {
        setRenderButton(renderButton + 1);
    //}, [user?.user?.username]);
}, []);


    return (
        <>
            <Button
                onClick={handleOpenUserMenu}
                endIcon={<KeyboardArrowDownIcon />}
                sx={{
                    color: 'black',
                }}
            >
                <Box display="flex" flexDirection="column">
                    {/* <Typography fontSize={12}>{user?.user?.username}</Typography> */}
                    <Typography fontSize={12}>{'username'}</Typography>
                    {/* {getStoredCurrentOrgtreeBin() && (
                        <Typography fontSize={12}>
                            {t('common:БИН')}: {getStoredCurrentOrgtreeBin()}
                        </Typography>
                    )} */}
                </Box>
            </Button>
            <Menu
                sx={{ mt: '30px' }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings.map((setting, index) => {
                    if (setting.url)
                        return (
                            <Link key={index} href={setting.url} passHref>
                                <MenuItem>
                                    <Typography textAlign="center">{setting.title}</Typography>
                                </MenuItem>
                            </Link>
                        );

                    if (setting.action)
                        return (
                            <MenuItem key={index} onClick={() => setting.action()}>
                                <Typography textAlign="center">{setting.title}</Typography>
                            </MenuItem>
                        );
                })}
            </Menu>
        </>
    );
}
