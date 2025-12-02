'use client';
import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import NoDataTableRow from 'components/UIComponent/NoDataTableRow';
import LoadingTableRow from 'components/UIComponent/LoadingTableRow';
import { renderTableCell, renderTableCellFixed } from 'utils/renderTableCell';
import { isLotsData } from 'constants/tenderBidsDetailsDialog.constants';
import { CancelBiddingTableBodyProps } from 'types/table';
import { GetCancelBiddingData, BidsData, LotsData } from 'services/archives/pastEvents/types';
import { formatNumber, formatNumberWithSign, formatPercentageWithSign } from 'utils/formatPercentage';

const CancelWinningBidBody = ({ data, eventCategoryID, loading }: CancelBiddingTableBodyProps<GetCancelBiddingData>) => (
  <TableBody>
    {loading.isProgress || loading.isLoading ? (
      <LoadingTableRow colSpan={8} />
    ) : data && data?.length > 0 ? (
      data?.map((data: GetCancelBiddingData, outerIndex: number) => {
        if (Array.isArray(data)) {
          return data?.map((item: BidsData | LotsData, innerIndex: number) => {
            if (isLotsData(item)) {
              return (
                <TableRow key={`${outerIndex}-${innerIndex}`}>
                  {renderTableCell({ content: item?.stockNo })}
                  {eventCategoryID === 1 && renderTableCell({ content: item?.Size })}
                  {eventCategoryID === 1 &&
                    renderTableCell({
                      content:
                        item?.stockDesc.length > 20 ? (
                          <Tooltip title={item?.stockDesc} arrow>
                            <span>{item?.stockDesc.substring(0, 20)}...</span>
                          </Tooltip>
                        ) : (
                          item?.stockDesc
                        ),
                    })}
                  {eventCategoryID === 2 && renderTableCell({ content: item?.Shape })}
                  {eventCategoryID === 2 && renderTableCell({ content: item?.Colour })}
                  {eventCategoryID === 2 && renderTableCell({ content: item?.Clarity })}
                  {renderTableCell({ content: item?.pcs, align: 'right' })}
                  {renderTableCellFixed({
                    content: formatNumber(item?.cts),
                    align: 'right',
                  })}
                  {renderTableCellFixed({
                    content: formatNumber(item?.rate),
                    align: 'right',
                  })}
                  {renderTableCell({
                    content: formatNumberWithSign(item?.marketprice),
                    align: 'right',
                  })}
                  {renderTableCell({
                    content: formatPercentageWithSign(item?.varianceprice),
                    align: 'right',
                  })}
                </TableRow>
              );
            }
          });
        }
        return null;
      })
    ) : (
      <NoDataTableRow colSpan={8} padding />
    )}
  </TableBody>
);

export default CancelWinningBidBody;
