import {
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  Folder,
  FolderOpen,
  Image,
  IndeterminateCheckBoxOutlined,
  KeyboardArrowDown,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { common } from '@mui/material/colors';

const iconSx = { fontSize: 20, opacity: 0.8 };
export const icons = {
  expandClose: <KeyboardArrowRight sx={iconSx} />,
  expandOpen: <KeyboardArrowDown sx={iconSx} />,
  leaf: <Image sx={iconSx} />,
  parentOpen: <FolderOpen sx={iconSx} />,
  parentClose: <Folder sx={iconSx} />,
  check: <CheckBoxOutlined sx={{ ...iconSx, color: common.black }} />,
  halfCheck: <IndeterminateCheckBoxOutlined sx={{ ...iconSx, color: common.black }} />,
  uncheck: <CheckBoxOutlineBlank sx={{ ...iconSx, color: common.black }} />,
};
