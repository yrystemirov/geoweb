import { GridLocaleText } from "@mui/x-data-grid";

export const muiDgKkLocale: Partial<GridLocaleText> = {
  MuiTablePagination: {
    labelRowsPerPage: 'Беттегі жолдар:',
    labelDisplayedRows: ({ from, to, count }) => (count !== -1 ? `${count}-тен ${from}-${to}` : `${to}-нан аса жолдан ${from}-${to}`),
  },
  // Root
  noRowsLabel: 'Жолдар жоқ',
  noResultsOverlayLabel: 'Деректер табылмады.',
  // Density selector toolbar button text
  toolbarDensity: 'Жолдың биіктігі',
  toolbarDensityLabel: 'Жолдың биіктігі',
  toolbarDensityCompact: 'Ықшам',
  toolbarDensityStandard: 'Стандартты',
  toolbarDensityComfortable: 'Ыңғайлы',
  // Columns selector toolbar button text
  toolbarColumns: 'Бағандар',
  toolbarColumnsLabel: 'Бағандарды бөліп көрсетіңіз',
  // Filters toolbar button text
  toolbarFilters: 'Сүзгілер',
  toolbarFiltersLabel: 'Сүзгілерді көрсету',
  toolbarFiltersTooltipHide: 'Сүзгілерді жасыру',
  toolbarFiltersTooltipShow: 'Сүзгілерді көрсету',
  toolbarFiltersTooltipActive: (count) => {
    let pluralForm = 'белсенді сүзгі';
    const lastDigit = count % 10;
    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'белсенді сүзгі';
    } else if (lastDigit === 1) {
      pluralForm = 'белсенді сүзгі';
    }
    return `${count} ${pluralForm}`;
  },
  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Іздеу…',
  toolbarQuickFilterLabel: 'Іздеу',
  toolbarQuickFilterDeleteIconLabel: 'Тазарту',
  // Export selector toolbar button text
  toolbarExport: 'Экспорт',
  toolbarExportLabel: 'Экспорт',
  toolbarExportCSV: 'CSV форматында жүктеу',
  toolbarExportPrint: 'Басып шығару',
  toolbarExportExcel: 'Excel форматында жүктеу',
  // Columns management text
  columnsManagementSearchTitle: 'Іздеу',
  columnsManagementNoColumns: 'Бағандар жоқ',
  columnsManagementShowHideAllText: 'Барлығын көрсету/жасыру',
  columnsManagementReset: 'Қалпына келтіру',
  // Filter panel text
  filterPanelAddFilter: 'Сүзгі қосу',
  filterPanelRemoveAll: 'Барлық сүзгілерді жою',
  filterPanelDeleteIconLabel: 'Жою',
  filterPanelLogicOperator: 'Логикалық операторлар',
  filterPanelOperator: 'Операторлар',
  filterPanelOperatorAnd: 'Және',
  filterPanelOperatorOr: 'Немесе',
  filterPanelColumns: 'Бағандар',
  filterPanelInputLabel: 'Мән',
  filterPanelInputPlaceholder: 'Сүзгінің мәні',
  // Filter operators text
  filterOperatorContains: 'қамтиды',
  filterOperatorEquals: 'тең',
  filterOperatorStartsWith: '-дан басталады',
  filterOperatorEndsWith: '-мен аяқталады',
  filterOperatorIs: 'тең',
  filterOperatorNot: 'тең емес',
  filterOperatorAfter: '-дан көп',
  filterOperatorOnOrAfter: 'көп немесе тең',
  filterOperatorBefore: '-дан аз',
  filterOperatorOnOrBefore: 'аз немесе тең',
  filterOperatorIsEmpty: 'бос',
  filterOperatorIsNotEmpty: 'бос емес',
  filterOperatorIsAnyOf: 'кез келгені', // Filter values text
  filterValueAny: 'кез келгені',
  filterValueTrue: 'ақиқат',
  filterValueFalse: 'жалған',
  // Column menu text
  columnMenuLabel: 'Мәзір',
  columnMenuShowColumns: 'Бағандарды көрсету',
  columnMenuManageColumns: 'Бағандарды басқару',
  columnMenuFilter: 'Сүзгі',
  columnMenuHideColumn: 'Жасыру',
  columnMenuUnsort: 'Сұрыптаудың күшін жою',
  columnMenuSortAsc: 'Өсуіне қарай сұрыптау',
  columnMenuSortDesc: 'Кемуіне қарай сұрыптау',
  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    let pluralForm = 'белсенді сүзгі';
    const lastDigit = count % 10;
    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'белсенді сүзгі';
    } else if (lastDigit === 1) {
      pluralForm = 'белсенді сүзгі';
    }
    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'Сүзгілерді көрсету',
  columnHeaderSortIconLabel: 'Сұрыптау',
  // Rows selected footer text
  footerRowSelected: (count) => `${count} жол таңдалды`,
  // Total row amount footer text
  footerTotalRows: 'Барлық жол саны:',
  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${totalCount.toLocaleString()}-дан
${visibleCount.toLocaleString()}`,
  // Checkbox selection text
  checkboxSelectionHeaderName: 'Жалау таңдау',
  checkboxSelectionSelectAllRows: 'Барлық жолдарды таңдау',
  checkboxSelectionUnselectAllRows: 'Барлық жолдарды таңдаудың күшін жою',
  checkboxSelectionSelectRow: 'Жол таңдау',
  checkboxSelectionUnselectRow: 'Жолды таңдаудың күшін жою',
  // Boolean cell text
  booleanCellTrueLabel: 'ақиқат',
  booleanCellFalseLabel: 'жалған',
  // Actions cell more text
  actionsCellMore: 'тағы',
  // Column pinning text
  pinToLeft: 'Сол жаққа бекіту',
  pinToRight: 'Оң жаққа бекіту',
  unpin: 'Ажырату',
  // Tree Data
  treeDataGroupingHeaderName: 'Топ',
  treeDataExpand: 'еншілес элементтерді көрсету',
  treeDataCollapse: 'еншілес элементтерді жасыру',
  // Grouping columns
  groupingColumnHeaderName: 'Топ',
  groupColumn: (name) => `${name} бойынша топтау`,
  unGroupColumn: (name) => `${name} бойынша топты тарату`,
  // Master/detail
  detailPanelToggle: 'Мәліметтер',
  expandDetailPanel: 'Кеңейте ашу',
  collapseDetailPanel: 'Жиыру',
  // Row reordering text
  rowReorderingHeaderName: 'Жолдар ретін өзгерту',
  // Aggregation
  aggregationMenuItemHeader: 'Деректерді біріктіру',
  aggregationFunctionLabelSum: 'сома',
  aggregationFunctionLabelAvg: 'ортамән',
  aggregationFunctionLabelMin: 'мин',
  aggregationFunctionLabelMax: 'макс',
  aggregationFunctionLabelSize: 'есеп',
};
