'use client';
import { memo } from 'react';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Link from 'next/link';
import StatusChip from 'components/UIComponent/StatusChip';
import EditIconButton from 'components/UIComponent/IconButtons/EditButton';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { SellingData } from 'services/parameter/sellingCompany/type';
import { renderTableCell, renderTableCellClick } from 'utils/renderTableCell';
import { getComparator, stableSort } from 'utils/react-table';
import { SellingCompanyTableBodyProps } from 'types/table';
import { StickyColCell } from 'views/common.styled';

const SellingCompanyTableBody = ({
  data,
  page,
  order,
  orderBy,
  loading,
  rowsPerPage,
  onStatusToggle,
  onWebsiteLinkClick,
}: SellingCompanyTableBodyProps<SellingData>) => {
  const getStatusChip = (status: string) => {
    const statusMap = {
      Active: { color: 'success', label: 'Active' },
      Inactive: { color: 'error', label: 'Deactive' },
    };

    if (status in statusMap) {
      const { color, label } = statusMap[status as keyof typeof statusMap];
      return <StatusChip color={color as any} label={label} />;
    }

    return <StatusChip color="default" label={status} />;
  };

  const renderRow = (row: SellingData, index: number) => (
    <TableRow hover tabIndex={-1} key={row?.entityID} className="hover-row">
      {renderTableCell({ content: page * rowsPerPage + index + 1, component: 'th', padding: 'none', width: '50px', align: 'right' })}
      {renderTableCell({ content: row?.seqno, align: 'right' })}
      {renderTableCell({ content: row?.co_name })}
      {renderTableCell({ content: row?.co_city })}
      {renderTableCell({ content: row?.co_country })}
      {renderTableCell({ content: `${row?.phonecountry1}${row?.phoneno1 ?? '-'}` })}
      {renderTableCellClick({ content: row?.co_website, onClick: () => onWebsiteLinkClick(row?.co_website) })}
      {renderTableCell({ content: row?.IsMultiVendor ? 'Yes' : 'No' })}
      <TableCell align="center" width="1%">
        <Button onClick={() => onStatusToggle(row.entityID ?? '')}>{getStatusChip(row?.IsActive ?? '')}</Button>
      </TableCell>
      <StickyColCell width="1%" align="center" fixRight={0} fixWidth={150}>
        <Link href={`/master-setup/selling-Company/upsert-selling-comapny/${row?.entityID}`}>
          <EditIconButton title="Edit" />
        </Link>
      </StickyColCell>
    </TableRow>
  );

  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={11} />
      ) : data?.length > 0 ? (
        stableSort(data, getComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, index) => (row ? renderRow(row, index) : null))
      ) : (
        <NoDataTableRow colSpan={11} padding />
      )}
    </TableBody>
  );
};

export default memo(SellingCompanyTableBody);
