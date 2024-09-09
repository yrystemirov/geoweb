import { IconButton, Tooltip } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { useTranslation } from 'react-i18next';
export const HomeExtentButton = (props: any) => {
    
    const { t } = useTranslation();
    
    const handleButtonClick = () => {
        if (props.map) {
            let zoom = 5.15;
            let center = [7739532.205446683, 6290648.115801078];
            props.map.getView()?.setZoom(zoom);
            props.map.getView()?.setCenter(center);
        }
    };

    return (
        <>
            <Tooltip title={t('main_extent')} placement="left">
                <IconButton
                    style={{
                        background: props.color ? props.color : 'rgb(64 152 68 / 70%)',
                        borderRadius: 0,
                    }}
                    onClick={handleButtonClick}
                    sx={{ color: 'white' }}
                >
                    <PublicIcon />
                </IconButton>
            </Tooltip>
        </>
    );
};
