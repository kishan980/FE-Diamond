'use client';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TickIcon from 'components/UIComponent/IconButtons/TickButton';
import CloseIcon from 'components/UIComponent/IconButtons/CloseButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { SelectViewerData } from 'services/event/event-action/select-viewers/type';
import { SelectViewerTableBodyProps } from 'types/table';
import { getDescComparator, stableSort } from 'utils/react-table';
import { renderTableCell, renderTableCellLink } from 'utils/renderTableCell';
import { StickyColCell } from 'views/common.styled';

const SelectViewersTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  handleClick,
  isSelected,
}: SelectViewerTableBodyProps<SelectViewerData>) => {
  const renderRow = (row: SelectViewerData, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const isItemSelected = isSelected(row?.EntityID);

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        selected={isItemSelected}
        tabIndex={-1}
        key={row?.EntityID}
        className="hover-row"
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={() => handleClick(row.EntityID ?? '', row.EmailID ?? '')}
            inputProps={{ 'aria-labelledby': labelId }}
          />
        </TableCell>
        {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
        {renderTableCellLink({
          content: row?.CompanyName,
          redirectUrl: `/account/viewers/upsert-viewers/${row.EntityID}`,
        })}
        {renderTableCell({ content: row?.ContactPerson })}
        {renderTableCell({ content: row?.Contact })}
        {renderTableCell({ content: row?.EmailID })}
        <StickyColCell align="center" width="1%" fixRight={150} fixWidth={150}>
          {row?.st === 1 ? <CloseIcon /> : <TickIcon />}
        </StickyColCell>
        <StickyColCell align="center" width="1%" fixRight={0} fixWidth={75}>
          {row?.isLocked === false ? <TickIcon /> : <CloseIcon />}
        </StickyColCell>
      </TableRow>
    );
  };

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={8} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={8} padding />
      )}
    </TableBody>
  );
};

export default SelectViewersTableBody;
