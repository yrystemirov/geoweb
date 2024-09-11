import { Tooltip } from '@mui/material';
import { GridEditInputCell, GridPreProcessEditCellProps, GridRenderEditCellParams } from '@mui/x-data-grid';

const fieldIsRequiredProps = (errorTxt: string) => ({
  preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
    return {
      ...params.props,
      error: params.props.value ? '' : errorTxt,
    };
  },
  renderEditCell: (params: GridRenderEditCellParams) => (
    <Tooltip
      title={params.error || ''}
      open={Boolean(params.error)}
      arrow
    >
      <GridEditInputCell {...params} />
    </Tooltip>
  ),
});

export {
  fieldIsRequiredProps,
}