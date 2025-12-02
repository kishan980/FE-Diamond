'use client';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import DeleteIconButton from 'components/UIComponent/IconButtons/DeleteButton';
import DownloadCSVXSButton from 'components/UIComponent/IconButtons/DownloadCSVButton/DownloadCSVXSButton';
import { StyledLeftAlignedIconGroup, StickyColCell } from 'views/common.styled';
import { formatDate } from 'utils/format-date';
import { CustomisedReportsData } from 'services/archives/customisedReports/types';
import { getDescComparator, stableSort } from 'utils/react-table';
import { CustomisedReportsTableBodyProps } from 'types/table';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';

const CustomisedReportsTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  onDeleteClick,
  isDownloadAccess,
  onExcelClick,
}: CustomisedReportsTableBodyProps<CustomisedReportsData>) => {
  const renderRow = (row: CustomisedReportsData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.SeqNo} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCellEllipsis({ content: row?.ReportName })}
      {renderTableCellEllipsis({
        content:
          row?.Description.length > 20 ? (
            <Tooltip title={row?.Description} arrow>
              <span>{row?.Description.substring(0, 20)}...</span>
            </Tooltip>
          ) : (
            row?.Description
          ),
      })}
      {renderTableCellEllipsis({ content: formatDate(row?.FromDate) })}
      {renderTableCellEllipsis({ content: formatDate(row?.ToDate) })}
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
        <StyledLeftAlignedIconGroup>
          <Link href={`/history/customised-reports/upsert-customised-reports/${row.SeqNo}`}>
            <EditIconButton title="Edit" />
          </Link>
          {isDownloadAccess && <DownloadCSVXSButton title="Generate Report" onClick={() => onExcelClick(row.SeqNo ?? '')} />}
          <DeleteIconButton title="Delete" onClick={() => onDeleteClick(row.SeqNo ?? '')} />
        </StyledLeftAlignedIconGroup>
      </StickyColCell>
    </TableRow>
  );

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={6} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={6} padding />
      )}
    </TableBody>
  );
};

export default CustomisedReportsTableBody;
