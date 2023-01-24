import { useState, useMemo, useCallback, useEffect } from "react";

let firstRender = true;

const usePagination = (totalPages: number, pageSize: number = 5) => {
  const pageLength = Math.max(totalPages, pageSize);
  const [pages, setPages] = useState(
    Array.from({ length: pageLength }, (_, i) => i + 1)
  );
  const [currentPage, setCurrentPage] = useState(pages[0]);
  const [offsetPage, setOffsetPage] = useState(0);

  // Rerender the pages when the page length changes
  useEffect(() => {
    if (firstRender) {
      firstRender = false;
      return;
    }
    setPages(Array.from({ length: pageLength }, (_, i) => i + 1));
  }, [pageLength]);

  // Get a slice of the pages to display to the user;
  const slicedPage = useMemo(() => {
    return pages.slice(offsetPage, pageSize + offsetPage);
  }, [pages, offsetPage, pageSize]);

  const handleNewPage = useCallback(
    (page: number) => () => {
      if (page < 0 || page > pageLength) {
        return;
      }
      setCurrentPage(page);
    },
    [pageLength]
  );

  const handleNextPage = useCallback(
    () => {
      if (offsetPage >= totalPages - pageSize) {
        return;
      }
      setOffsetPage((prev) => prev + 1);
    },
    [totalPages, offsetPage, pageSize]
  );

  const handlePrevPage = useCallback(
    () => {
      if (offsetPage <= 0) {
        return;
      }
      setOffsetPage((prev) => prev - 1);
    },
    [offsetPage]
  );

  return {
    pages: slicedPage,
    handleNewPage,
    handlePrevPage,
    currentPage,
    handleNextPage,
  };
};

export default usePagination;
