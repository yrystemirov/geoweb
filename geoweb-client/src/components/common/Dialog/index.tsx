import { FC } from 'react';
import { DialogContent, Dialog as DialogMui, DialogTitle } from '@mui/material';

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export const Dialog: FC<Props> = ({ children, title, open, onClose }) => {
  return (
    <DialogMui open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
    </DialogMui>
  );
};
