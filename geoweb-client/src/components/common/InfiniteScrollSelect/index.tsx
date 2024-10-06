import { TransitionEvent, UIEvent, useEffect, useMemo, useState } from 'react';
import { TextField, MenuItem, Box, BaseTextFieldProps, IconButton, InputAdornment } from '@mui/material';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import ClearIcon from '@mui/icons-material/Clear';
import { AxiosResponse } from 'axios';
import { Loader } from '../Loader';
import { Pages } from '../../../api/types/page';
import useDebounce from '../../../hooks/useDebounce';

type Props<T> = {
  name: string;
  fetchFn: (params: { page: number; size: number }) => Promise<AxiosResponse<Pages<T>>>;
  disabledFn?: (option: T) => boolean;
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
  onChange?: (value: string, selectedOption: T | null) => void;
  searchKey?: string;
  searchIsEnabled?: boolean;
  /** Count of items per request of options, should be more than 10 for infinite scroll
   * @default 20
   */
  pageSize?: number;
} & BaseTextFieldProps;

const ClearButton = ({ onClick }: { onClick: () => void }) => (
  <InputAdornment position="end" sx={{ mr: 1 }}>
    <IconButton onClick={onClick} size="small">
      <ClearIcon />
    </IconButton>
  </InputAdornment>
);

export const infScrollSelectQueryKey = 'inf-scroll-select-options';

export const InfiniteScrollSelect = <T,>({
  onChange,
  fetchFn,
  disabledFn,
  searchKey = 'name',
  searchIsEnabled,
  getOptionLabel,
  getOptionValue,
  label,
  pageSize = 20,
  name,
  children,
  ...props
}: Props<T>) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce(search, 500);
  const methods = useFormContext();
  const { setValue, watch, formState, register } = methods;
  const value = watch(name);
  const [optionListHeight, setOptionListHeight] = useState<number>(0);

  const onChangeHandler = (newValue: string) => {
    const selectedOption = newValue ? allItems.find((item) => getOptionValue(item) === newValue)! : null;
    setValue(name, newValue);
    onChange?.(newValue, selectedOption);
    if (value !== newValue) {
      methods.trigger(name);
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery<
    Pages<T>,
    Error,
    InfiniteData<Pages<T>>
  >({
    initialPageParam: 0,
    queryKey: [infScrollSelectQueryKey, name, debouncedSearch],
    queryFn: ({ pageParam = 0 }) => {
      console.log({ ...(searchIsEnabled ? { [searchKey]: debouncedSearch } : {}) });

      return fetchFn({
        page: pageParam as number,
        size: pageSize,
        ...(searchIsEnabled ? { [searchKey]: debouncedSearch } : {}),
      }).then((res) => res.data);
    },
    getNextPageParam: (lastPage) => (lastPage.totalPages > lastPage.number + 1 ? lastPage.number + 1 : undefined),
  });

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const isScrolledToBottom =
      event.currentTarget.scrollHeight - event.currentTarget.scrollTop === event.currentTarget.clientHeight;
    if (isScrolledToBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleOptionListHeigthChange = (e: TransitionEvent<HTMLDivElement>) => {
    setOptionListHeight(e.currentTarget.clientHeight);
  };

  const allItems = useMemo(
    () => data?.pages?.reduce((acc, page) => [...acc, ...page.content], [] as T[]) || [],
    [data],
  );

  useEffect(() => {
    if (data) {
      const thereIsNoValue = data.pages.every((page) => page.content.every((item) => getOptionValue(item) !== value));
      if (thereIsNoValue) {
        onChangeHandler('');
      }
    }
  }, [data, value, onChangeHandler]);

  return (
    <>
      <TextField
        {...register(name)}
        label={label}
        select
        value={value}
        onChange={(e) => onChangeHandler(e.target.value)}
        fullWidth
        slotProps={{
          select: {
            MenuProps: {
              slotProps: {
                paper: {
                  style: {
                    maxHeight: 200,
                    maxWidth: 250,
                    textAlign: 'center',
                  },
                  onScroll: handleScroll,
                  onTransitionEnd: handleOptionListHeigthChange,
                },
              },
            },
            IconComponent: value
              ? () => (
                  <ClearButton
                    onClick={() => {
                      onChangeHandler('');
                      setSearch('');
                    }}
                  />
                )
              : undefined,
          },
        }}
        error={!!formState.errors[name]}
        helperText={formState.errors[name]?.message as string}
        {...props}
      >
        {searchIsEnabled && (
          <Box px={2} py={1}>
            <TextField
              placeholder={t('common:search')}
              fullWidth
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              onKeyDown={(e) => e.stopPropagation()}
              value={search}
              autoComplete="off"
              sx={{ '& input': { pb: 1.5 } }}
              slotProps={{
                input: {
                  endAdornment: search && (
                    <IconButton onClick={() => setSearch('')} size="small">
                      <ClearIcon />
                    </IconButton>
                  ),
                },
              }}
              variant="standard"
            />
          </Box>
        )}

        {children}

        {data?.pages.map((page) =>
          page.content.map((option) => (
            <MenuItem
              key={getOptionValue(option)}
              value={getOptionValue(option)}
              className="text-truncate"
              title={getOptionLabel(option)}
              disabled={isFetching || disabledFn?.(option)}
            >
              {getOptionLabel(option)}
            </MenuItem>
          )),
        )}

        {allItems.length === 0 && (
          <MenuItem disabled sx={{ whiteSpace: 'normal' }}>
            {t(debouncedSearch ? 'common:noResult' : 'common:noData')}
          </MenuItem>
        )}

        {isFetching && (
          <Box
            id="infinite-scroll-options-loader"
            sx={{
              position: 'sticky',
              bottom: 0,
              width: '100%',
              height: `${optionListHeight}px`,
              marginTop: `${-optionListHeight}px`,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <Loader />
          </Box>
        )}
      </TextField>
    </>
  );
};
