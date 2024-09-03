import Link from 'next/link';
//import { useUser } from 'modules/auth/hooks/useUser';


import Button from '@mui/material/Button';
import AccountButton from './accountButton';
//import { useTranslation } from 'next-i18next';

const SignInButton: React.FC = () => {
    //const { t } = useTranslation('common');

    //const { user } = useUser();
    const  user = true;

    if (user) return <AccountButton />;

    return (
        <Link href="/login" passHref>
            <Button
                sx={{
                    color: 'black',
                    paddingY: '8px',
                    paddingX: '32px',
                    backgroundColor: '#FFFFFF !important',
                    borderRadius: '12px',
                    marginLeft: '32px',
                    ':hover': {
                        color: 'white',
                        background: 'transparent !important',
                    },
                }}
            >
                Sign in
            </Button>
        </Link>
    );
};

export default SignInButton;
