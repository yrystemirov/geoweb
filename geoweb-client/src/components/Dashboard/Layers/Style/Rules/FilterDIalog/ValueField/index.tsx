import { FC, useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItem, Radio, RadioGroup, TextField, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { dictionariesAPI } from '../../../../../../../api/dictioanries';
import { AttrType, LayerAttrDto } from '../../../../../../../api/types/mapFolders';
import { useTranslatedProp } from '../../../../../../../hooks/useTranslatedProp';
import dayjs from 'dayjs';

type Props = {
  selectedAttr?: LayerAttrDto;
  required?: boolean;
};

const nonNumberSymbols = ['-', '+', 'e', 'E'];
const nonIntegerSymbols = ['.', ','];

export const ValueField: FC<Props> = ({ required, selectedAttr }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const entryNameProp = useTranslatedProp('', true);
  const [attr, setAttr] = useState<LayerAttrDto>(); // NOTE: this state is used to check if the selected attribute has changed for resetting the value
  const { t } = useTranslation();
  const methods = useFormContext<{ value: string }>();
  const {
    control,
    formState: { errors },
    register,
    setValue,
    watch,
  } = methods;
  const formValues = watch();

  const { data: entries, isLoading: isEntriesLoading } = useQuery({
    queryKey: ['dictionaryEntries', selectedAttr?.dictionaryCode],
    queryFn: () => dictionariesAPI.getAllEntriesByDicCode(selectedAttr?.dictionaryCode!).then((res) => res.data),
    enabled: selectedAttr?.attrType === AttrType.DICTIONARY,
  });

  const checkAndUpdateAttr = () => {
    const attrIsChanged = attr && selectedAttr && attr.attrname !== selectedAttr.attrname;

    if (attrIsChanged) {
      setValue('value', '');
    }

    setAttr(selectedAttr);
  };

  useEffect(() => {
    checkAndUpdateAttr();
  }, [selectedAttr]);

  const handleKeyPress = () => {
    const attrType = selectedAttr?.attrType!;
    const isNumeric = [AttrType.BIGINT, AttrType.NUMERIC].includes(attrType);

    if (inputRef.current && isNumeric) {
      const numberHandler = (e: KeyboardEvent) => {
        if (nonNumberSymbols.includes(e.key)) {
          // for both BigInt and Numeric
          e.preventDefault();
        }

        if (attrType === AttrType.BIGINT && nonIntegerSymbols.includes(e.key)) {
          e.preventDefault();
        }
      };

      inputRef.current.addEventListener('keydown', numberHandler);

      return () => {
        inputRef.current?.removeEventListener('keydown', numberHandler);
      };
    }
  };

  useEffect(handleKeyPress, [inputRef, selectedAttr?.attrType]);

  switch (selectedAttr?.attrType) {
    case AttrType.TEXT:
      return (
        <TextField
          {...register('value')}
          label={t('styleRules.value')}
          fullWidth
          margin="dense"
          variant="outlined"
          error={!!errors.value}
          helperText={errors.value?.message}
          required={required}
        />
      );
    case AttrType.BIGINT:
      return (
        <TextField
          {...register('value')}
          label={t('styleRules.value')}
          fullWidth
          margin="dense"
          variant="outlined"
          error={!!errors.value}
          helperText={errors.value?.message}
          type="number"
          slotProps={{ htmlInput: { step: 1 } }}
          inputRef={inputRef}
          required={required}
        />
      );
    case AttrType.NUMERIC:
      return (
        <TextField
          {...register('value')}
          label={t('styleRules.value')}
          fullWidth
          margin="dense"
          variant="outlined"
          error={!!errors.value}
          helperText={errors.value?.message}
          type="number"
          slotProps={{ htmlInput: { step: 0.001 } }}
          inputRef={inputRef}
          required={required}
        />
      );
    case AttrType.TIMESTAMP:
      return (
        <Controller
          control={control}
          name="value"
          render={({ field: { value, ...field } }) => {
            return (
              <DatePicker
                {...field}
                label={t('styleRules.dateValue')}
                value={value ? dayjs(value as string) : null}
                slotProps={{ textField: { fullWidth: true, required } }}
                format="DD.MM.YYYY"
                sx={{ mt: 1 }}
              />
            );
          }}
        />
      );
    case AttrType.BOOLEAN:
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend" required={required}>
            {t('styleRules.value')}
          </FormLabel>
          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <FormControlLabel value={true} control={<Radio />} label={t('yes')} />
                <FormControlLabel value={false} control={<Radio />} label={t('no')} />
                {!required && <FormControlLabel value={''} control={<Radio />} label={t('isNotSelected')} />}
              </RadioGroup>
            )}
          />
        </FormControl>
      );
    case AttrType.DICTIONARY:
      return (
        <TextField
          {...register('value')}
          label={t('styleRules.value')}
          fullWidth
          margin="dense"
          variant="outlined"
          error={!!errors.value}
          helperText={errors.value?.message}
          select
          value={formValues.value}
          disabled={isEntriesLoading}
          required={required}
        >
          {entries?.length ? (
            <MenuItem value="">
              <em>
                <i>{t('isNotSelected')}</i>
              </em>
            </MenuItem>
          ) : (
            <MenuItem disabled>{t('noData')}</MenuItem>
          )}
          {entries?.map((entry) => (
            <MenuItem key={entry.id} value={entry.code}>
              {entry[entryNameProp]}
            </MenuItem>
          ))}
        </TextField>
      );
    default:
      return null;
  }
};