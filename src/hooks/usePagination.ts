import { useState } from 'react';
import { EventData } from 'services/event/types';

export default function usePagination(data: EventData[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  }

  const next = () => setCurrentPage((currentPage: number) => Math.min(currentPage + 1, maxPage));

  const prev = () => setCurrentPage((currentPage: number) => Math.max(currentPage - 1, 1));

  const jump = (page: number) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(() => Math.min(pageNumber, maxPage));
  };

  return { next, prev, jump, currentData, currentPage, maxPage };
}
