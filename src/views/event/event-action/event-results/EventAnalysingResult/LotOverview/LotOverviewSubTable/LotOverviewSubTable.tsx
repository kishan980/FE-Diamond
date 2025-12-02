'use client';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import Divider from '@mui/material/Divider';
import TablePagination from '@mui/material/TablePagination';
import LotOverviewDetailsTableHeader from '../LotOverviewDetailsTableHeader';
import LotOverviewDetailsTableBody from '../LotOverviewDetailsTableBody';
import MainCard from 'components/MainCard';
import { LotOverviewSubTableProps } from 'types/table';
import { GetLotsOverviewTable2 } from 'services/event/event-action/event-results/type';
import { useTableControls } from 'utils/useTableControls';
import { ROWS_PER_PAGE_OPTIONS } from 'constants/event.constants';

const LotOverviewSubTable = ({
  showFinalStatusCell,
  detailsData,
  handleOpenConfirmModal,
  loading,
}: LotOverviewSubTableProps<GetLotsOverviewTable2>) => {
  const { order, orderBy, page, rowsPerPage, handleRequestSort, handleChangePage, handleChangeRowsPerPage } = useTableControls('stockNo');

  return (
    <MainCard content={false}>
      <TableContainer sx={{ mb: 2 }} className="print-table-container">
        <Table aria-label="collapsible table">
          <LotOverviewDetailsTableHeader
            showFinalStatusCell={showFinalStatusCell}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <LotOverviewDetailsTableBody
            data={detailsData}
            showFinalStatusCell={showFinalStatusCell}
            onRefuseClick={handleOpenConfirmModal}
            loading={loading}
            page={page}
            order={order}
            orderBy={orderBy}
            rowsPerPage={rowsPerPage}
          />
        </Table>
      </TableContainer>
      <Divider />
      <TablePagination
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        component="div"
        count={detailsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ '& p': { m: 0 } }}
      />
    </MainCard>
  );
};

export default LotOverviewSubTable;
