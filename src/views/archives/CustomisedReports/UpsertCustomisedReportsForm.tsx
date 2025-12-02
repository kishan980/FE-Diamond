'use client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import FilterDialog from './UpsertCustomisedReportsDialog/UpsertDefinedFiltersDialog';
import UpsertSellingCompanyDialog from './UpsertCustomisedReportsDialog/UpsertSellingCompanyDialog';
import UpsertSelectedColumnDialog from './UpsertCustomisedReportsDialog/UpsertSelectedColumnDialog';
import {
  CustomisedReportsDatePicker,
  UpsertCustomisedReportsContainer,
  UpsertCustomisedReportsMainContainer,
} from './CustomisedReports.styled';
import MainCard from 'components/MainCard';
import FormInput from 'components/UIComponent/FormInput';
import { StyledSelect } from 'components/UIComponent/ThemeCSS/StyleSelect';
import CardActionButtons from 'components/UIComponent/CardActionButton';
import { MultipleOptions } from 'components/UIComponent/type';
import { ViewMainContainer } from 'views/event/Event.styled';
import { customisedReportSchema } from 'validations/validationSchemas';
import mapFilterData from 'utils/mapFilterData';
import { formatDateAndTime } from 'utils/format-date';
import { SellingCompanyServices } from 'services/parameter/sellingCompany/sellingCompany.services';
import { CustomisedReportsServices } from 'services/archives/customisedReports/customisedReports.services';
import { SellingData } from 'services/parameter/sellingCompany/type';
import { LoadingState } from 'types/table';
import {
  AddCustomisedReportsParams,
  CustomisedReportsData,
  DialogFilters,
  Filter,
  FilterObject,
  FormValues,
  SelectColumnData,
  SelectedColumnValue,
  SelectedOperatorType,
  SellingCompanyValue,
  UpdateCustomisedReportsParams,
} from 'services/archives/customisedReports/types';
import { extractFirstItemValue } from 'utils/extractFirstItemValue';
import { EventServices } from 'services/event/event.services';
import { ProductTypeData } from 'services/event/types';
import CircularLoader from 'components/CircularLoader';
import Loader from 'components/Loader';

const UpsertCustomisedReportsForm = () => {
  const { push } = useRouter();
  const { id } = useParams();
  const customisedReportId = Number(id);

  const [isDefinedFiltersDialogOpen, setIsDefinedFiltersDialogOpen] = useState(false);
  const [isSellingCompanyDialogOpen, setIsSellingCompanyDialogOpen] = useState(false);
  const [isSelectColumnDialogOpen, setIsSelectColumnDialogOpen] = useState(false);
  const [selectSellerValues, setSelectSellerValues] = useState<SellingCompanyValue[]>([]);
  const [selectColumnValues, setSelectColumnValues] = useState<SelectedColumnValue[]>([]);
  const [sellingCompanyId, setSellingCompanyId] = useState<string>('');
  const [headerName, setHeaderName] = useState<string>('');
  const [filters, setFilters] = useState<{ BIDDINGPER: Filter[]; PERFORMANCE: Filter[] }>({
    BIDDINGPER: [],
    PERFORMANCE: [],
  });
  const [bidderPerformance, setBidderPerformance] = useState<FilterObject[]>([]);
  const [biddingPerformance, setBiddingPerformance] = useState<FilterObject[]>([]);
  const [productTypeOptions, setProductTypeOptions] = useState<MultipleOptions[]>([]);
  const [sellerData, setSellerData] = useState<SellingData[]>([]);
  const [selectColumnData, setSelectColumnData] = useState<SelectColumnData[]>([]);
  const [customisedReportsData, setCustomisedReportsData] = useState<CustomisedReportsData | undefined>(undefined);
  const [productTypes, setProductTypes] = useState<ProductTypeData[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false, isProgress: false });

  const initialValues: FormValues = {
    tenderCategory: 0,
    reportName: '',
    reportDescription: '',
    archivesFromDate: null,
    archivesToDate: null,
    sellingCompany: '',
    selectedColumns: '',
    definedFilters: '',
  };

  const {
    errors,
    values,
    touched,
    setValues,
    handleChange,
    setFieldValue,
    handleBlur,
    handleReset,
    handleSubmit,
    setSubmitting,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: customisedReportSchema,
    onSubmit: (values) => {
      // eslint-disable-next-line no-use-before-define
      return handleSubmitForm(values);
    },
  });

  const fetchSellerData = useCallback(async () => {
    try {
      const res = await SellingCompanyServices.sellingListData();
      if (typeof res !== 'string' && res.success) setSellerData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching seller data:', error);
      toast.error('Error fetching seller data.');
    }
  }, []);

  const fetchSelectedColumnData = useCallback(async () => {
    try {
      const res = await CustomisedReportsServices.getSelectedColumnListData(1);
      if (typeof res !== 'string' && res.success) setSelectColumnData(res.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching data.', error);
      toast.error('Error fetching data.');
    }
  }, []);

  const customisedReportsParams = (values: FormValues): AddCustomisedReportsParams => ({
    bidderPerformanceData: bidderPerformance,
    biddingPerformanceData: biddingPerformance,
    reportName: values.reportName,
    reportDescription: values.reportDescription,
    columnName: values.selectedColumns.replace(/,/g, ' ,'),
    headerName: headerName,
    sellingCompanyId: sellingCompanyId,
    refEntityType_Typemas: values.tenderCategory.toString(),
    fromDate: values.archivesFromDate || '',
    toDate: values.archivesToDate || '',
  });

  const handleSubmitForm = async (values: FormValues) => {
    const addParams: AddCustomisedReportsParams = customisedReportsParams(values);
    const updateParams: UpdateCustomisedReportsParams = { ...addParams, seqNo: customisedReportId };

    try {
      const res = await (customisedReportId ? CustomisedReportsServices.update(updateParams) : CustomisedReportsServices.add(addParams));

      if (typeof res !== 'string' && res.success) {
        push('/history/customised-reports');
        toast.success('Customised Reports ' + (customisedReportId ? 'updated' : 'added') + ' successfully');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error occurred while submitting the form', error);
      toast.error('An error occurred while submitting the form');
    } finally {
      setSubmitting(false);
    }
  };

  const fetchProductTypeData = useCallback(async () => {
    try {
      const response = await EventServices.getProductType();

      if (typeof response !== 'string' && response) {
        setProductTypes(response.data);

        const options = response.data.map((type) => ({
          id: type.eventcategoryID,
          name: type.eventcategory,
        }));
        setProductTypeOptions(options);
        setValues({
          ...values,
          tenderCategory: extractFirstItemValue(response, 'eventcategoryID', 0),
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error in fetchProductTypeData:', error);
      toast.error('Error fetching data.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCustomisedReportsById = useCallback(async () => {
    setLoading((prev) => ({ ...prev, isProgress: true }));
    try {
      const res = await CustomisedReportsServices.customisedReportsListData(customisedReportId);

      if (typeof res !== 'string' && res.success) {
        const matchedReport = res.data.find((report) => report.SeqNo === customisedReportId);
        if (matchedReport) setCustomisedReportsData(matchedReport);
        else toast.error('Customised reports Id not found');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Exception while fetching reports:', error);
      toast.error('Exception while fetching reports:');
    } finally {
      setLoading((prev) => ({ ...prev, isProgress: false }));
    }
  }, [customisedReportId]);

  const handleSellingCompanyDialogSubmit = (selectSellerValues: SellingCompanyValue[]) => {
    const sellingCompanyIdParams = selectSellerValues.map((item) => item.entityID).join(',');
    setSellingCompanyId(sellingCompanyIdParams);

    const sellingCompany = selectSellerValues.map((item) => item.co_name).join(', ');
    setFieldValue('sellingCompany', sellingCompany);
  };

  const handleSelectedColumnDialogSubmit = (selectColumnValues: SelectedColumnValue[]) => {
    const columnNameParams = selectColumnValues.map((item) => item.COLUMN_NAME).join(',');
    setHeaderName(columnNameParams);

    const selectColumns = selectColumnValues.map((item) => item.DISPLAY_NAME).join(', ');
    setFieldValue('selectedColumns', selectColumns);
  };

  const handleDefinedFiltersDialogSubmit = (filters: DialogFilters) => {
    setBidderPerformance(mapFilterData(filters.bidderPerformanceData));
    setBiddingPerformance(mapFilterData(filters.biddingPerformanceData));

    const bidderPerformance = mapFilterData(filters.bidderPerformanceData).map((item) => ({ ...item, category: 'Bidder Performance' }));

    const biddingPerformance = mapFilterData(filters.biddingPerformanceData).map((item) => ({ ...item, category: 'Bidding Performance' }));

    const combinedFilters = [...bidderPerformance, ...biddingPerformance];

    const formatCondition = (operator: SelectedOperatorType, condition: string, columnDescription: string, dataType: string): string => {
      switch (operator) {
        case 'Equal to':
          return dataType === 'varchar' ? `[${columnDescription}] = '${condition}'` : `[${columnDescription}] = ${condition}`;

        case 'Not equal to':
          return dataType === 'varchar' ? `[${columnDescription}] <> '${condition}'` : `[${columnDescription}] <> ${condition}`;

        case 'Less than':
          return `[${columnDescription}] < ${condition}`;

        case 'Less than or equal to':
          return `[${columnDescription}] <= ${condition}`;

        case 'Greater than':
          return `[${columnDescription}] > ${condition}`;

        case 'Greater than or equal to':
          return `[${columnDescription}] >= ${condition}`;

        case 'Like':
          return `[${columnDescription}] like '%${condition}%'`;

        case 'In':
          if (dataType === 'varchar') {
            const formattedList = condition
              .split(',')
              .map((val) => `''${val.trim()}''`)
              .join(', ');
            return `[${columnDescription}] in (${formattedList})`;
          } else return `[${columnDescription}] in (${condition})`;

        case 'Top':
          return `${condition}:[${columnDescription}]`;

        case 'Between':
          return `[${columnDescription}] between ${condition}`;

        default:
          return '';
      }
    };

    const formattedFilters = combinedFilters.map((filter) => {
      const columnDescription = filter.dataColumns.selectedValue;
      const selectedOperator = filter.dataFilter.selectedValue.split(':')[1] as SelectedOperatorType;
      const logicalOperator = filter.operatorOrAnd.selectedValue || '';
      const dataType = filter.dataType || '';
      const { category } = filter;
      const condition = formatCondition(selectedOperator, filter.txtCondition, columnDescription, dataType);

      return { category, description: `${condition}`, logicalOperator };
    });

    const groupedFilters = formattedFilters.reduce<Record<string, string>>((acc, filter, index, array) => {
      const isLast = index === array.length - 1 || array[index + 1]?.category !== filter.category;

      if (!acc[filter.category]) acc[filter.category] = '';

      acc[filter.category] += filter.description;

      if (!isLast) acc[filter.category] += ` ${filter.logicalOperator} `;

      return acc;
    }, {});

    // Generate the final output string
    const finalOutput = Object.entries(groupedFilters)
      .map(([category, conditions]) => `${category}: ${conditions}`)
      .join('\n');

    setFieldValue('definedFilters', finalOutput);
    setIsDefinedFiltersDialogOpen(false);
  };

  useEffect(() => {
    if (customisedReportId && customisedReportsData) {
      const setAutomaticFilters = () => {
        const parseFilterString = (filterString: string) => {
          const filters: {
            columnNo: string;
            column: string;
            dataType: string;
            dataFor: string;
            filterType: string;
            filterValue: string;
            logicalOperator: string;
          }[] = [];

          const rawFilters = filterString.split(';').filter(Boolean);

          for (let i = 0; i < rawFilters.length; i++) {
            const parts = rawFilters[i].split(':');
            if (parts.length >= 7) {
              const [columnNo, column, dataType, dataFor, filterType, filterValue, logicalOperator] = parts;
              filters.push({ columnNo, column, dataType, dataFor, filterType, filterValue, logicalOperator });
            }
          }

          return filters;
        };

        const bidderFilters = parseFilterString(customisedReportsData?.BidderWhereClausedtl ?? '');
        const biddingFilters = parseFilterString(customisedReportsData?.BiddingWhereClausedtl ?? '');

        setFilters({
          BIDDINGPER: biddingFilters.map((filter, idx) => ({
            id: idx + 1,
            column: filter.column,
            filterType: filter.filterType,
            filterValue: filter.filterValue,
            logicalOperator: filter.logicalOperator,
          })),
          PERFORMANCE: bidderFilters.map((filter, idx) => ({
            id: idx + 1,
            column: filter.column,
            filterType: filter.filterType,
            filterValue: filter.filterValue,
            logicalOperator: filter.logicalOperator,
          })),
        });
      };

      setAutomaticFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customisedReportsData]);

  useEffect(() => {
    const transformFilters = (filters: Filter[], dataFor: string) =>
      filters.map((filter) => {
        const columnData = selectColumnData.find((column) => column.DISPLAY_NAME === filter.column && column.DATA_FOR === dataFor);
        return {
          dataColumns: { selectedIndex: 1, selectedValue: filter.column },
          dataFilter: { selectedIndex: 1, selectedValue: filter.filterType },
          operatorOrAnd: { selectedValue: filter.logicalOperator },
          txtCondition: filter.filterValue,
          seqNo: columnData?.OrdNo ? String(columnData.OrdNo) : '',
          dataType: columnData?.DATA_TYPE || 'varchar',
          dataTypeList: columnData?.DATA_FOR || 'typeList',
        };
      });

    const transformedData = {
      bidderPerformanceData: transformFilters(filters.PERFORMANCE, 'PERFORMANCE'),
      biddingPerformanceData: transformFilters(filters.BIDDINGPER, 'BIDDINGPER'),
    };

    setBidderPerformance(mapFilterData(transformedData.bidderPerformanceData));
    setBiddingPerformance(mapFilterData(transformedData.biddingPerformanceData));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const matchedSellers = sellerData
      .filter((seller) => {
        const ids = [...new Set(customisedReportsData?.SellingCmpID?.split(',').map(Number))];
        return ids.includes(seller.entityID);
      })
      .map((seller) => ({ co_name: seller.co_name, entityID: seller.entityID.toString() }));

    if (customisedReportId)
      setValues({
        ...values,
        tenderCategory: customisedReportsData?.refEntityType_Typemas ?? (productTypes.length > 0 ? productTypes[0].eventcategoryID : 0),
        reportName: customisedReportsData?.ReportName || '',
        reportDescription: customisedReportsData?.Description || '',
        archivesFromDate: customisedReportsData?.FromDate ? formatDateAndTime(customisedReportsData?.FromDate) : null,
        archivesToDate: customisedReportsData?.ToDate ? formatDateAndTime(customisedReportsData?.ToDate) : null,
        sellingCompany: matchedSellers.map((seller) => seller.co_name).join(', ') || '',
        selectedColumns: customisedReportsData?.ColumnName || '',
        definedFilters: customisedReportsData?.WhereClause || '',
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customisedReportsData]);

  useEffect(() => {
    if (customisedReportsData && customisedReportId) {
      const ids = customisedReportsData?.SellingCmpID?.split(',').map(Number) || [];
      const matchedSellers = sellerData
        .filter((seller) => ids.includes(seller.entityID))
        .map((seller) => ({ co_name: seller.co_name, entityID: seller.entityID.toString() }));

      setSelectSellerValues(matchedSellers);
      setSellingCompanyId(matchedSellers.map((seller) => seller.entityID).join(','));
      setFieldValue('sellingCompany', matchedSellers.map((seller) => seller.co_name).join(', '));

      const columnNameArray = customisedReportsData.HeaderName.split(',').map((item) => item.trim());
      const displayNameArray = customisedReportsData.ColumnName.split(', ').map((item) => item.trim());

      if (columnNameArray.length === displayNameArray.length)
        setSelectColumnValues(columnNameArray.map((colName, index) => ({ COLUMN_NAME: colName, DISPLAY_NAME: displayNameArray[index] })));

      setHeaderName(columnNameArray.join(','));
      setFieldValue('selectedColumns', displayNameArray.join(', '));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customisedReportsData, customisedReportId, sellerData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading((prev) => ({ ...prev, isProgress: true }));

      try {
        await Promise.all([fetchSellerData(), fetchProductTypeData(), fetchSelectedColumnData()]);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error during data fetching:', error);
        toast.error('Error fetching data');
      } finally {
        setLoading((prev) => ({ ...prev, isProgress: false }));
      }
    };

    fetchData();
  }, [fetchSellerData, fetchProductTypeData, fetchSelectedColumnData]);

  useEffect(() => {
    if (customisedReportId) fetchCustomisedReportsById();
  }, [customisedReportId, fetchCustomisedReportsById]);
  return loading.isLoading ? (
    <Loader />
  ) : (
    <>
      {(loading.isProgress || loading.isLoading) && <CircularLoader isProgress={loading.isProgress || loading.isLoading} />}
      <form onSubmit={handleSubmit}>
        <ViewMainContainer>
          <MainCard title={`${customisedReportId ? 'Update' : 'Add'} Customised Reports Registration`} content={false}>
            <CardContent>
              <UpsertCustomisedReportsMainContainer>
                <UpsertCustomisedReportsContainer>
                  <FormControl size="small">
                    <InputLabel>Tender Category</InputLabel>
                    <StyledSelect id="tenderCategory" name="tenderCategory" value={values.tenderCategory} onChange={handleChange}>
                      {productTypeOptions.map((type, index: number) => (
                        <MenuItem key={index} value={type.id as number}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                  <FormInput
                    id="reportName"
                    name="reportName"
                    label="Report Name"
                    required
                    value={values.reportName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.reportName && Boolean(errors.reportName)}
                    helperText={touched.reportName ? errors.reportName : undefined}
                  />
                  <FormInput
                    id="reportDescription"
                    name="reportDescription"
                    label="Report Description"
                    required
                    value={values.reportDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.reportDescription && Boolean(errors.reportDescription)}
                    helperText={touched.reportDescription ? errors.reportDescription : undefined}
                  />
                  <CustomisedReportsDatePicker>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label={
                          <Box>
                            From <span style={{ color: 'red' }}>*</span>
                          </Box>
                        }
                        value={values.archivesFromDate ? new Date(values.archivesFromDate) : new Date()}
                        format="MM/dd/yyyy"
                        onChange={(newValue) => setFieldValue('archivesFromDate', newValue)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        sx={{
                          '& .MuiInputLabel-sizeSmall': {
                            lineHeight: '1.4em !important',
                          },
                        }}
                      />
                    </LocalizationProvider>
                    {errors.archivesFromDate && touched.archivesFromDate && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                        {errors.archivesFromDate}
                      </FormHelperText>
                    )}
                  </CustomisedReportsDatePicker>
                  <CustomisedReportsDatePicker>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label={
                          <Box>
                            To <span style={{ color: 'red' }}>*</span>
                          </Box>
                        }
                        value={values.archivesToDate ? new Date(values.archivesToDate) : values.archivesFromDate}
                        format="MM/dd/yyyy"
                        onChange={(newValue) => setFieldValue('archivesToDate', newValue)}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        sx={{
                          '& .MuiInputLabel-sizeSmall': {
                            lineHeight: '1.4em !important',
                          },
                        }}
                      />
                    </LocalizationProvider>
                    {errors.archivesToDate && touched.archivesToDate && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                        {errors.archivesToDate}
                      </FormHelperText>
                    )}
                  </CustomisedReportsDatePicker>
                  <FormInput
                    id="sellingCompany"
                    name="sellingCompany"
                    label="Selling Company"
                    required
                    value={values.sellingCompany}
                    onClick={() => setIsSellingCompanyDialogOpen(true)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.sellingCompany && Boolean(errors.sellingCompany)}
                    helperText={touched.sellingCompany ? errors.sellingCompany : undefined}
                    multiline
                    rows={3}
                    readOnly
                  />
                  <FormInput
                    id="selectedColumns"
                    name="selectedColumns"
                    label="Selected Columns"
                    required
                    value={values.selectedColumns}
                    onClick={() => setIsSelectColumnDialogOpen(true)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.selectedColumns && Boolean(errors.selectedColumns)}
                    helperText={touched.selectedColumns ? errors.selectedColumns : undefined}
                    multiline
                    rows={5}
                    readOnly
                  />
                  <FormInput
                    id="definedFilters"
                    name="definedFilters"
                    label="Defined Filters"
                    value={values.definedFilters}
                    onClick={() => setIsDefinedFiltersDialogOpen(true)}
                    onChange={handleChange}
                    multiline
                    rows={5}
                    onBlur={handleBlur}
                    readOnly
                  />
                </UpsertCustomisedReportsContainer>
              </UpsertCustomisedReportsMainContainer>
            </CardContent>
          </MainCard>
          <CardActionButtons isSubmitting={isSubmitting} id={customisedReportId} handleReset={handleReset} />
        </ViewMainContainer>
      </form>
      <UpsertSellingCompanyDialog
        open={isSellingCompanyDialogOpen}
        handleClose={() => setIsSellingCompanyDialogOpen(false)}
        onSubmit={handleSellingCompanyDialogSubmit}
        sellerData={sellerData}
        loading={loading}
        selectSellerValues={selectSellerValues}
        setSelectSellerValues={setSelectSellerValues}
      />
      <UpsertSelectedColumnDialog
        open={isSelectColumnDialogOpen}
        handleClose={() => setIsSelectColumnDialogOpen(false)}
        loading={loading}
        onSubmit={handleSelectedColumnDialogSubmit}
        selectColumnData={selectColumnData}
        selectColumnValues={selectColumnValues}
        setSelectColumnValues={setSelectColumnValues}
      />
      <FilterDialog
        open={isDefinedFiltersDialogOpen}
        handleClose={() => setIsDefinedFiltersDialogOpen(false)}
        loading={loading}
        filters={filters}
        setFilters={setFilters}
        onSubmit={handleDefinedFiltersDialogSubmit}
        selectColumnData={selectColumnData}
        selectFilterValues={values.selectedColumns.split(', ')}
      />
    </>
  );
};

export default UpsertCustomisedReportsForm;
