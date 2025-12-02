'use client';
import { useState, SyntheticEvent, ChangeEvent, KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Collapse from '@mui/material/Collapse';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import { ArrowDown2, ArrowUp2, Refresh, SearchNormal1 } from 'iconsax-react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormInput from 'components/UIComponent/FormInput';
import {
  StyledSearchToggleWrapper,
  StyledSearchControlRow,
  SearchFilterContainer,
  StyledSearchToggleLabel,
  StyledStickyTableHeaderRow,
  StickyHeaderRowTotalTitle,
  StyledStickySearchBarRow,
} from 'views/common.styled';
import { SelectViewerData } from 'services/event/event-action/select-viewers/type';
import { SelectViewersTableHeaderProps } from 'types/table';
import { SELECT_VIEWER_HEAD_CELLS } from 'constants/tableHeadCells';

const SEARCH_FIELDS = ['companyName', 'contactPerson'] as const;

const SelectViewersTableHeader = ({
  data,
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  handleLoginClick,
  onSelectAllClick,
  handleClickSearch,
  handleInvitedClick,
  searchFilters,
  setSearchFilters,
  handleResetFilters,
}: SelectViewersTableHeaderProps<SelectViewerData>) => {
  const [checked, setChecked] = useState(false);
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up('md'));

  const totalRecords = data.filter((item) => item.st === 1).length;

  const handleChange = () => setChecked((prev) => !prev);

  const handleInputChange = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setSearchFilters?.((prev) => ({
      ...prev,
      [key]: event.target.value || undefined,
    }));
  };

  const createSortHandler = (property: string) => (event: SyntheticEvent) => onRequestSort(event, property);

  const handleKeyDownSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClickSearch?.();
    }
  };

  return (
    <TableHead sx={{ position: 'relative', zIndex: 15 }}>
      <StyledStickySearchBarRow>
        <TableCell colSpan={SELECT_VIEWER_HEAD_CELLS.length + 1}>
          <StyledSearchToggleWrapper>
            <StyledSearchControlRow onClick={handleChange}>
              {checked ? <ArrowUp2 /> : <ArrowDown2 />}
              <StyledSearchToggleLabel>
                <b>Search Viewers </b> (Click here to {checked ? 'hide' : 'show'} quick search)
              </StyledSearchToggleLabel>
            </StyledSearchControlRow>
            <Collapse in={checked}>
              <SearchFilterContainer>
                {SEARCH_FIELDS.map((fieldKey) => (
                  <FormInput
                    key={fieldKey}
                    id={fieldKey}
                    name={fieldKey}
                    label={fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    value={searchFilters?.[fieldKey] ?? ''}
                    onChange={handleInputChange(fieldKey)}
                    fullWidth={false}
                    onKeyDown={handleKeyDownSearch}
                  />
                ))}

                <Button variant="contained" size="small" onClick={handleClickSearch} startIcon={<SearchNormal1 />}>
                  Search
                </Button>
                <Button variant="contained" size="small" onClick={handleResetFilters} startIcon={<Refresh />}>
                  Reset
                </Button>
              </SearchFilterContainer>
            </Collapse>
          </StyledSearchToggleWrapper>
        </TableCell>
      </StyledStickySearchBarRow>
      <StyledStickyTableHeaderRow isSearchOpen={checked}>
        <TableCell colSpan={SELECT_VIEWER_HEAD_CELLS.length + 1}>
          Total selected records: {totalRecords}/{rowCount}
        </TableCell>
      </StyledStickyTableHeaderRow>
      <StickyHeaderRowTotalTitle isSearchOpen={checked}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={Boolean(rowCount) && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-labelledby': 'select all' }}
          />
        </TableCell>
        {SELECT_VIEWER_HEAD_CELLS.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={['st', 'isLocked'].includes(headCell.id) ? 'center' : headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            width={headCell.fixedWith}
            sx={{
              ...(headCell.isFixed &&
                isMediumUp && {
                  position: 'sticky !important',
                  right: `${headCell.fixedRight || 0}px !important`,
                  backgroundColor: '#F8F9FA',
                  zIndex: 11,
                  minWidth: '150px !important',
                  top: 0,
                }),
            }}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={(event) => {
                  event.preventDefault();
                  if (headCell.id === 'Invited') handleInvitedClick?.('Invited');
                  else if (headCell.id === 'Login') handleLoginClick?.('Login');
                  else createSortHandler(headCell.id)(event);
                }}
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
      </StickyHeaderRowTotalTitle>
    </TableHead>
  );
};

export default SelectViewersTableHeader;
