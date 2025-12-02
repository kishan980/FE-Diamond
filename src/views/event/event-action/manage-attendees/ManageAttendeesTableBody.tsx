'use client';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TickIcon from 'components/UIComponent/IconButtons/TickButton';
import CloseIcon from 'components/UIComponent/IconButtons/CloseButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { ManageAttendData } from 'services/event/event-action/manage-attendees/type';
import { getDescComparator, stableSort } from 'utils/react-table';
import { ManageAttendeesTableBodyProps } from 'types/table';
import { renderTableCell, renderTableCellLink } from 'utils/renderTableCell';
import { StickyColCell } from 'views/common.styled';
import PrintIconButton from 'components/UIComponent/IconButtons/PrintButton';

const ManageAttendeesTableBody = ({
  data,
  page,
  order,
  orderBy,
  rowsPerPage,
  isSelected,
  loading,
  entityID,
  eventCategoryId,
  handleClick,
  fetchPrintLotsData,
}: ManageAttendeesTableBodyProps<ManageAttendData>) => {
  const renderRow = (row: ManageAttendData, index: number) => {
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
          <Checkbox checked={isItemSelected} onClick={() => handleClick(row.EntityID ?? '')} inputProps={{ 'aria-labelledby': labelId }} />
        </TableCell>
        {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
        {renderTableCellLink({
          content: row?.CompanyName,
          redirectUrl: `${eventCategoryId === 1 ? `/account/rough-bidders/upsert-rough-bidders/${row.EntityID}` : `/account/polished-bidders/upsert-polished-bidders/${row.EntityID}`}`,
        })}
        {renderTableCell({ content: row?.ContactPerson })}
        {renderTableCell({ content: row?.contactPerson2 })}
        {renderTableCell({ content: row?.bidcount, align: 'right', width: '7%' })}
        <StickyColCell align="center" width="1%" fixRight={150} fixWidth={150}>
          {row?.IsActive ? <CloseIcon /> : <TickIcon />}
        </StickyColCell>
        <StickyColCell align="center" width="1%" fixRight={0} fixWidth={75}>
          {row?.IsAttended ? <TickIcon /> : <CloseIcon />}
        </StickyColCell>
        <StickyColCell align="center" width="1%" fixRight={0} fixWidth={75}>
          <PrintIconButton
            title="Print Sheet"
            isLoading={entityID === row?.EntityID}
            onClick={() => fetchPrintLotsData(row?.EntityID.toString())}
          />
        </StickyColCell>
      </TableRow>
    );
  };

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={9} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={9} padding />
      )}
    </TableBody>
  );
};

export default ManageAttendeesTableBody;
