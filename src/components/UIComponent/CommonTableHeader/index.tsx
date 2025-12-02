'use client';
import { useState, SyntheticEvent, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { ArrowDown2, ArrowUp2, Refresh, SearchNormal1 } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SelectDropDown from '../SelectDropDown/SelectDropDown';
import DateRangePicker from '../DateRangePicker';
import FormInput from 'components/UIComponent/FormInput';
import {
  StyledSearchToggleWrapper,
  StyledSearchControlRow,
  SearchFilterContainer,
  StyledSearchToggleLabel,
  StyledStickyTableHeaderRow,
  StyledStickySearchBarRow,
} from 'views/common.styled';
import { SellingData } from 'services/parameter/sellingCompany/type';
import { ACCOUNT_TYPE_OPTIONS } from 'constants/accountType.constants';
import { CommonTableHeaderProps, SearchFilters } from 'types/table';

const CommonTableHeader = ({
  title,
  headCells,
  order,
  orderBy,
  onRequestSort,
  rowCount = 0,
  numSelected = 0,
  onSelectAllClick,
  showCheckbox = false,
  searchFields = [],
  searchDropDown = [],
  searchFilters,
  setSearchFilters,
  handleClickSearch,
  handleResetFilters,
  values,
  setFieldValue,
  sellerData,
  selectedSellerId,
  handleChangeSellerTypeSearch,
}: CommonTableHeaderProps<SellingData>) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const toggleSearch = () => setSearchOpen((prev) => !prev);
  const theme = useTheme();
  const upMD = useMediaQuery(theme.breakpoints.up('md'));

  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

  const handleInputChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setSearchFilters?.((prev) => ({ ...prev, [key]: event.target.value || undefined }));
  };

  const handleSelectChange = <T extends keyof SearchFilters>(field: T, value: SearchFilters[T]) => {
    setSearchFilters?.((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (field: 'fromDatePicker' | 'toDatePicker', newValue: Date | null) => setFieldValue?.(field, newValue);

  return (
    <TableHead>
      <StyledStickySearchBarRow>
        <TableCell colSpan={headCells.length + (showCheckbox ? 1 : 0)}>
          <StyledSearchToggleWrapper>
            <StyledSearchControlRow onClick={toggleSearch}>
              {searchOpen ? <ArrowUp2 size={18} /> : <ArrowDown2 size={18} />}
              <StyledSearchToggleLabel>
                <b> Search {title} </b> (Click here to {searchOpen ? 'hide' : 'show'} quick search)
              </StyledSearchToggleLabel>
            </StyledSearchControlRow>
            <Collapse in={searchOpen}>
              <SearchFilterContainer>
                <>
                  {sellerData && (
                    <StyledSearchControlRow>
                      <Typography>Seller company name:</Typography>
                      <SelectDropDown
                        size="small"
                        id="seller"
                        name="seller"
                        value={selectedSellerId}
                        options={[
                          { value: 0, label: 'All' },
                          ...(sellerData || []).map((item) => ({ value: item.entityID, label: item.co_name })),
                        ]}
                        onChange={(value) => handleChangeSellerTypeSearch?.(Number(value))}
                      />
                    </StyledSearchControlRow>
                  )}

                  {values && <DateRangePicker fromDate={values.fromDatePicker} toDate={values.toDatePicker} onChange={handleDateChange} />}

                  {searchFields.map((fieldKey) => (
                    <FormInput
                      key={fieldKey}
                      id={fieldKey}
                      name={fieldKey}
                      label={fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                      value={searchFilters?.[fieldKey] ?? ''}
                      onChange={handleInputChange(fieldKey)}
                      fullWidth={false}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleClickSearch?.();
                        }
                      }}
                    />
                  ))}

                  {searchDropDown.map((fieldKey) => (
                    <SelectDropDown
                      key={fieldKey}
                      size="small"
                      id={fieldKey}
                      name={fieldKey}
                      value={searchFilters?.[fieldKey] ?? 1}
                      options={ACCOUNT_TYPE_OPTIONS}
                      onChange={(value) => handleSelectChange(fieldKey, value)}
                    />
                  ))}
                </>
                {handleClickSearch && (
                  <Button variant="contained" size="small" onClick={handleClickSearch} startIcon={<SearchNormal1 />}>
                    Search
                  </Button>
                )}

                {handleResetFilters && (
                  <Button variant="contained" size="small" onClick={handleResetFilters} startIcon={<Refresh />}>
                    Reset
                  </Button>
                )}
              </SearchFilterContainer>
            </Collapse>
          </StyledSearchToggleWrapper>
        </TableCell>
      </StyledStickySearchBarRow>
      <StyledStickyTableHeaderRow isSearchOpen={searchOpen}>
        {showCheckbox && (
          <TableCell padding="checkbox">
            <Checkbox
              checked={Boolean(rowCount) && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all items' }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === 'Options' || headCell.id === 'IsActive' ? 'center' : headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.fixedWith}
            sx={{
              minWidth: headCell.minWidth || 0,
              ...(headCell.isFixed &&
                upMD && {
                  position: 'sticky !important',
                  right: `${headCell.fixedRight || 0}px !important`,
                  backgroundColor: '#F8F9FA',
                  zIndex: 10,
                  minWidth: '100px !important',
                }),
            }}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </StyledStickyTableHeaderRow>
    </TableHead>
  );
};

export default CommonTableHeader;
