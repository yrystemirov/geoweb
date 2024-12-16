import { BaseTextFieldProps, MenuItem, TextField } from '@mui/material';
import { AxiosError, AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useNotify } from '../../../hooks/useNotify';
import { useQuery } from '@tanstack/react-query';

type Props<T> = {
  options?: T[];
  fetchFn?: () => Promise<AxiosResponse<T[]>>;
  name: string;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
  getOptionTitle?: (option: T) => string | undefined;
  disabledFn?: (option: T) => boolean;
} & BaseTextFieldProps;

export const FormSelect = <T,>({
  disabled,
  fetchFn,
  name,
  options,
  getOptionLabel,
  getOptionValue,
  getOptionTitle,
  disabledFn,
  children,
  ...props
}: Props<T>) => {
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<FieldValues>();

  const { showError } = useNotify();

  const {
    data: fetchedOptions,
    isLoading,
    refetch,
    error,
  } = useQuery<T[], AxiosError<any>>({
    queryKey: ['selectOptions', name],
    queryFn: () => fetchFn!().then((res) => res.data),
    enabled: !!fetchFn,
  });

  useEffect(() => {
    if (error) {
      showError({ error });
    }
  }, [error]);

  useEffect(() => {
    refetch();
  }, [fetchFn]);

  if (options?.length) {
    return (
      <TextField
        {...register(name)}
        select
        defaultValue={watch(name)}
        error={!!errors[name]}
        helperText={errors[name]?.message as string}
        fullWidth
        disabled={disabled}
        {...props}
      >
        {children}
        {options.map((option) => (
          <MenuItem
            key={getOptionValue(option)}
            value={getOptionValue(option)}
            disabled={disabledFn?.(option)}
            title={getOptionTitle?.(option)}
          >
            {getOptionLabel(option)}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  if (fetchFn) {
    return (
      <TextField
        {...register(name)}
        select
        defaultValue={watch(name)}
        error={!!errors[name]}
        helperText={errors[name]?.message as string}
        fullWidth
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
        {fetchedOptions?.map((option) => (
          <MenuItem
            key={getOptionValue(option)}
            value={getOptionValue(option)}
            disabled={disabledFn?.(option)}
            title={getOptionTitle?.(option)}
          >
            {getOptionLabel(option)}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return null;
};
