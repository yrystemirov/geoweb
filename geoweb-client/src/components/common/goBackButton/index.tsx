import { ChevronLeft } from '@mui/icons-material';
import { Button } from '@mui/material';
import { FC } from 'react';

type Props = {
  onClick: () => void;
  text?: string;
};

export const GoBackButton: FC<Props> = ({ onClick, text }) => {
  return (
    <Button variant="outlined" color="primary" onClick={onClick}>
      <ChevronLeft />
      {text}
    </Button>
  );
};
