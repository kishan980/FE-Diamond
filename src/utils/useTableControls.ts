'use client';
import { useState, SyntheticEvent, MouseEvent, ChangeEvent } from 'react';
import { getDefaultRowsPerPage } from './getDefaultRowsPerPage';
import { ArrangementOrder } from 'types/table';

export const useTableControls = (defaultOrderBy = 'SeqNo') => {
  const [order, setOrder] = useState<ArrangementOrder>('asc');
  const [orderBy, setOrderBy] = useState<string>(defaultOrderBy);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(getDefaultRowsPerPage());

  const handleRequestSort = (event: SyntheticEvent, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: MouseEvent<HTMLElement> | MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) =>
    setPage(newPage);

  const handleChangeRowsPerPage = (event?: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event?.target?.value;
    if (value) {
      setRowsPerPage(parseInt(value, 10));
      setPage(0);
    }
  };

  return {
    order,
    orderBy,
    page,
    rowsPerPage,
    handleRequestSort,
    handleChangePage,
    handleChangeRowsPerPage,
    setOrder,
    setOrderBy,
    setPage,
    setRowsPerPage,
  };
};
