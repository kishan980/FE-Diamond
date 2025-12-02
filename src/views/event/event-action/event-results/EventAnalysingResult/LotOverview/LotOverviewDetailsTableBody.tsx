'use client';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Forbidden2, LocationDiscover } from 'iconsax-react';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import { formatTimestamp } from 'utils/format-date';
import { formatNumber, formatPercentage } from 'utils/formatPercentage';
import { GetLotsOverviewTable2 } from 'services/event/event-action/event-results/type';
import { LotOverviewDetailsTableProps } from 'types/table';
import { renderTableCellClick, renderTableCellEllipsis, renderTableCellFixed } from 'utils/renderTableCell';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import ProfileDetailsReadModal from 'views/profileDetails-Model/ProfileDetailsReadModal';
import { getComparator, stableSort } from 'utils/react-table';

const LotOverviewDetailsTableBody = ({
  data,
  showFinalStatusCell,
  onRefuseClick,
  loading,
  page,
  order,
  orderBy,
  rowsPerPage,
}: LotOverviewDetailsTableProps<GetLotsOverviewTable2>) => {
  const [isProfileDetailsDialogOpen, setIsProfileDetailsDialogOpen] = useState(false);
  const [sellerID, setSellerID] = useState<number | null>(null);

  const handleProfileDetailsReadClick = (sellerID: number) => {
    setSellerID(sellerID);
    setIsProfileDetailsDialogOpen(true);
  };

  const renderRow = (row: GetLotsOverviewTable2, index: number) => (
    <TableRow hover tabIndex={-1} key={index}>
      {renderTableCellEllipsis({ content: row?.ranks })}
      {renderTableCellClick({ content: row?.co_name, onClick: () => handleProfileDetailsReadClick(row?.refBuyerID_EntityMas) })}
      {renderTableCellFixed({
        content: row?.bid_value,
        format: (value) => Number(value).toFixed(2),
        align: 'right',
      })}
      {renderTableCellFixed({
        content: formatNumber(row?.lot_value),
        align: 'right',
      })}
      {renderTableCellEllipsis({ content: formatPercentage(row?.diff), align: 'right' })}
      {renderTableCellEllipsis({ content: formatTimestamp(row?.InsTimeStamp) })}
      {showFinalStatusCell && (
        <TableCell>
          {row?.bidStatus1?.toString() === '1' ? (
            <Button variant="outlined" color="error" startIcon={<Forbidden2 />}>
              Refused
            </Button>
          ) : row?.bidStatus1?.toString() === '2' ? (
            <Button variant="contained" onClick={() => onRefuseClick(row?.refBuyerID_EntityMas)} startIcon={<LocationDiscover />}>
              Reallocated
            </Button>
          ) : row?.ranks === 1 && row?.winner_Id === row?.refBuyerID_EntityMas ? (
            <Button variant="contained" color="error" onClick={() => onRefuseClick(row?.refBuyerID_EntityMas)} startIcon={<Forbidden2 />}>
              Refuse?
            </Button>
          ) : null}
        </TableCell>
      )}
    </TableRow>
  );
  return (
    <>
      <TableBody>
        {loading.isProgress || loading.isLoading ? (
          <LoadingTableRow colSpan={7} />
        ) : data?.length > 0 ? (
          stableSort(data, getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (row ? renderRow(row, index) : null))
        ) : (
          <NoDataTableRow colSpan={7} padding />
        )}
      </TableBody>
      <ProfileDetailsReadModal
        open={isProfileDetailsDialogOpen}
        handleClose={() => setIsProfileDetailsDialogOpen(false)}
        entityID={sellerID}
      />
    </>
  );
};

export default LotOverviewDetailsTableBody;
