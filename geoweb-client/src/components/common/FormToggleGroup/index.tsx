import {
  FormControl,
  FormHelperText,
  InputLabel,
  InputLabelOwnProps,
  SxProps,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps,
} from '@mui/material';
import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
  name: string;
  label?: string;
  options: { value: string; label: React.ReactNode | string }[];
  sx?: SxProps;
  disabled?: ToggleButtonGroupProps['disabled'];
  required?: InputLabelOwnProps['required'];
};

export const FormToggleGroup: FC<Props> = ({ disabled, name, options, label, sx }) => {
  const methods = useFormContext();

  return (
    <>
      <InputLabel required>{label}</InputLabel>
      <Controller
        name={name}
        control={methods.control}
        render={({ field, fieldState: { error } }) => (
          <FormControl>
            <ToggleButtonGroup
              {...field}
              disabled={disabled}
              sx={sx}
              defaultValue={options[0].value}
              value={field.value}
              onChange={(event: React.MouseEvent<HTMLElement> | any, value: string) => {
                event.target.value = value;
                field.onChange(event);
              }}
              exclusive
            >
              {options.map(({ value, label }) => (
                <ToggleButton key={value} value={value}>
                  {label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            {!!error && <FormHelperText error>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    </>
  );
};
