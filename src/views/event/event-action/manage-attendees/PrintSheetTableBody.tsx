import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import { GetAllLotsData } from 'services/bidder/all-lots/type';
import { renderTableCell, renderTableCellEllipsis } from 'utils/renderTableCell';

const PrintSheetTableBody = ({ eventCategoryID, data }: { eventCategoryID: number; data: GetAllLotsData[] }) => (
  <TableBody>
    {data.length > 0 ? (
      data.map((row) => (
        <TableRow tabIndex={-1} key={row?.SeqNo}>
          {renderTableCell({ content: row?.stockNo })}
          {eventCategoryID === 1 && renderTableCell({ content: row?.Size })}
          {eventCategoryID === 1
            ? renderTableCellEllipsis({
                content:
                  row?.stockDesc?.length > 20 ? (
                    <Tooltip title={row.stockDesc} arrow>
                      <span>{row.stockDesc.substring(0, 20)}...</span>
                    </Tooltip>
                  ) : (
                    row?.stockDesc || '-'
                  ),
              })
            : renderTableCell({
                content:
                  row?.Shape?.length > 20 ? (
                    <Tooltip title={row?.Shape} arrow>
                      <span>{row?.Shape.substring(0, 20)}...</span>
                    </Tooltip>
                  ) : (
                    row?.Shape || '-'
                  ),
              })}
          {renderTableCell({ content: row?.pcs, align: 'right' })}
          {renderTableCell({ content: row?.cts, align: 'right' })}
          {renderTableCellEllipsis({ content: row?.MinesName })}
          {renderTableCell({ content: row?.bid_value, align: 'left' })}
          {renderTableCell({ content: row?.lot_value, align: 'left' })}
        </TableRow>
      ))
    ) : (
      <NoDataTableRow colSpan={8} />
    )}
  </TableBody>
);

export default PrintSheetTableBody;
