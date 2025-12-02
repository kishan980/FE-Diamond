'use client';
import TableBody from '@mui/material/TableBody';
import BidTableRow from './BidTableRow';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { GetAllLotsData } from 'services/bidder/all-lots/type';
import { UploadPaperTableBodyProps } from 'types/table';
import { getDescComparator, stableSort } from 'utils/react-table';

const UploadPaperBidsTableBody = ({
  data,
  page,
  order,
  orderBy,
  rowsPerPage,
  loading,
  isSelected,
  values,
  setFieldValue,
  eventCategoryId,
  handleClick,
}: UploadPaperTableBodyProps<GetAllLotsData>) => {
  return (
    <TableBody>
      {loading.isProgress || loading.isLoading ? (
        <LoadingTableRow colSpan={10} />
      ) : data?.length > 0 ? (
        stableSort(data, getDescComparator(order, orderBy))
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row) =>
            row ? (
              <BidTableRow
                key={row.SeqNo}
                row={row}
                values={values}
                setFieldValue={setFieldValue}
                isItemSelected={isSelected(row.SeqNo)}
                handleClick={handleClick}
                eventCategoryId={eventCategoryId}
              />
            ) : null
          )
      ) : (
        <NoDataTableRow colSpan={10} padding />
      )}
    </TableBody>
  );
};

export default UploadPaperBidsTableBody;
