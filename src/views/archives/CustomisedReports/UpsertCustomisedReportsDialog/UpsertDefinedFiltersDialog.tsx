'use client';
import { SyntheticEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Add, CloseCircle } from 'iconsax-react';
import {
  UpsertDefinedFilterButtonsContainer,
  UpsertDefinedFilterMainContainer,
  UpsertDefinedFilterTabsContainer,
} from './UpsertCustomisedReportsDialog.styled';
import CustomDialog from 'components/UIComponent/Dialogs/CustomDialog/CustomDialog';
import CircularLoader from 'components/UIComponent/CircularLoader';
import { FilterDialogProps } from 'types/dialog';
import { Filter, SelectColumnData } from 'services/archives/customisedReports/types';
import { CustomisedReportsServices } from 'services/archives/customisedReports/customisedReports.services';
import { FilterFormProps, TabPanelProps } from 'types/archives';

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <Box role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </Box>
  );
}

const FilterForm = ({ title, columns, filters, setFilters, selectFilterData }: FilterFormProps) => {
  const addNewFilter = () => {
    setFilters((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        column: '',
        filterType: '',
        filterValue: '',
        logicalOperator: 'OR',
      },
    ]);
  };

  const removeFilter = (id: number) => setFilters((prev) => prev.filter((f) => f.id !== id));

  const updateFilter = (id: number, field: string, value: string) =>
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  return (
    <>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {filters.map((filter) => {
        const columnInfo = selectFilterData.find((col) => col.COLUMN_NAME === filter.column);
        const dataTypeOptions = columnInfo?.DATA_TYPEList?.split(',') || [];

        return (
          <UpsertDefinedFilterMainContainer key={filter.id}>
            <TextField
              label="Column Name"
              size="small"
              fullWidth
              select
              value={filter.column}
              onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
            >
              {columns.map((column) => (
                <MenuItem key={column.COLUMN_NAME} value={column.COLUMN_NAME}>
                  {column.DISPLAY_NAME}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Filter Type"
              size="small"
              fullWidth
              select
              value={filter.filterType}
              onChange={(e) => updateFilter(filter.id, 'filterType', e.target.value)}
            >
              {dataTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Filter Value"
              size="small"
              fullWidth
              value={filter.filterValue}
              onChange={(e) => updateFilter(filter.id, 'filterValue', e.target.value)}
            />
            <TextField
              label="Logical Operator"
              size="small"
              fullWidth
              select
              value={filter.logicalOperator}
              onChange={(e) => updateFilter(filter.id, 'logicalOperator', e.target.value)}
            >
              <MenuItem value="AND">AND</MenuItem>
              <MenuItem value="OR">OR</MenuItem>
            </TextField>
            <IconButton onClick={() => removeFilter(filter.id)}>
              <CloseCircle />
            </IconButton>
          </UpsertDefinedFilterMainContainer>
        );
      })}
      <Button variant="outlined" color="primary" onClick={addNewFilter} startIcon={<Add />}>
        Add Filter
      </Button>
    </>
  );
};

const FilterDialog = ({
  open,
  handleClose,
  loading,
  filters,
  setFilters,
  onSubmit,
  selectColumnData,
  selectFilterValues,
}: FilterDialogProps) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectFilterData, setSelectFilterData] = useState<SelectColumnData[]>([]);

  const handleTabChange = (e: SyntheticEvent, newValue: number) => setActiveTabIndex(newValue);

  const getFilteredColumns = (dataFor: string) =>
    selectColumnData.filter((col) => col.DATA_FOR === dataFor && selectFilterValues.includes(col.DISPLAY_NAME));

  const hasRelevantDataFor = (dataFor: string) => getFilteredColumns(dataFor).length > 0;

  const transformFilters = (filters: Filter[], dataFor: string) =>
    filters.map((filter) => {
      const columnData = selectColumnData.find((col) => col.COLUMN_NAME === filter.column && col.DATA_FOR === dataFor);
      const columnInfo = selectFilterData.find((col) => col.COLUMN_NAME === filter.column);
      const dataTypeList = columnInfo?.DATA_TYPEList;
      return {
        dataColumns: { selectedIndex: 1, selectedValue: filter.column },
        dataFilter: { selectedIndex: 1, selectedValue: `${dataTypeList}:${filter.filterType}` },
        operatorOrAnd: { selectedValue: filter.logicalOperator },
        txtCondition: filter.filterValue,
        dataType: columnData?.DATA_TYPE || 'varchar',
      };
    });

  const handleSubmit = () => {
    const transformedPayload = {
      bidderPerformanceData: transformFilters(filters.PERFORMANCE, 'PERFORMANCE'),
      biddingPerformanceData: transformFilters(filters.BIDDINGPER, 'BIDDINGPER'),
    };

    onSubmit(transformedPayload);
    handleClose();
  };

  const handleFilterChange = (dataFor: keyof typeof filters, updatedFilters: Filter[] | ((prev: Filter[]) => Filter[])) => {
    setFilters((prev) => ({
      ...prev,
      [dataFor]: typeof updatedFilters === 'function' ? updatedFilters(prev[dataFor]) : updatedFilters,
    }));
  };

  useEffect(() => {
    const fetchColumnData = async () => {
      try {
        const biddingRes = await CustomisedReportsServices.getSelectedColumnListData(4);
        const performanceRes = await CustomisedReportsServices.getSelectedColumnListData(5);
        const allData = [];

        if (typeof biddingRes !== 'string' && biddingRes.success) allData.push(...biddingRes.data);
        if (typeof performanceRes !== 'string' && performanceRes.success) allData.push(...performanceRes.data);

        setSelectFilterData(allData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching both column lists', error);
        toast.error('Error fetching both column lists');
      }
    };

    if (open) fetchColumnData();
  }, [open]);
  return (
    <>
      {loading.isLoading && <CircularLoader isProgress={loading.isLoading} />}

      <CustomDialog
        open={open}
        onClose={handleClose}
        title="Please define the filters that you want to apply to the report:"
        maxWidth="md"
        fullWidth
        content={
          <>
            <UpsertDefinedFilterTabsContainer>
              <Tabs value={activeTabIndex} onChange={handleTabChange}>
                {hasRelevantDataFor('BIDDINGPER') && <Tab label="Bidding Performance" />}
                {hasRelevantDataFor('PERFORMANCE') && <Tab label="Bidders Performance" />}
              </Tabs>
            </UpsertDefinedFilterTabsContainer>
            {hasRelevantDataFor('BIDDINGPER') && (
              <TabPanel value={activeTabIndex} index={0}>
                <FilterForm
                  title="Bidding Performance Filters"
                  columns={getFilteredColumns('BIDDINGPER')}
                  filters={filters.BIDDINGPER}
                  setFilters={(newFilters) => handleFilterChange('BIDDINGPER', newFilters)}
                  selectFilterData={selectFilterData}
                />
              </TabPanel>
            )}
            {hasRelevantDataFor('PERFORMANCE') && (
              <TabPanel value={activeTabIndex} index={hasRelevantDataFor('BIDDINGPER') ? 1 : 0}>
                <FilterForm
                  title="Bidders Performance Filters"
                  columns={getFilteredColumns('PERFORMANCE')}
                  filters={filters.PERFORMANCE}
                  setFilters={(newFilters) => handleFilterChange('PERFORMANCE', newFilters)}
                  selectFilterData={selectFilterData}
                />
              </TabPanel>
            )}
            <UpsertDefinedFilterButtonsContainer>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Apply Filter
              </Button>
            </UpsertDefinedFilterButtonsContainer>
          </>
        }
      />
    </>
  );
};

export default FilterDialog;
