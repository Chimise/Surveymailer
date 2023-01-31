import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import cn from "classnames";
import Link from "next/link";
import type { Paginate } from "../../../types";
import usePagination from "../../../hooks/usePagination";
import PaginationLink from "../PaginationLink";

interface PaginationProps extends Paginate {
  className?: string;
}

const Pagination = ({
  previousPage,
  nextPage,
  totalPages,
  className,
}: PaginationProps) => {
  const { pages, handleNextPage, handlePrevPage, handleNewPage, currentPage } =
    usePagination(totalPages);
  return (
    <nav
      className={cn(
        "isolate inline-flex -space-x-px rounded-md shadow-md",
        className
      )}
      aria-label="Pagination"
    >
      <PaginationLink
        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
        onClick={handlePrevPage}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </PaginationLink>
      {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
      {pages.map((page) => (
        <PaginationLink
          href={`?page=${page}`}
          key={page}
          disabled={page > totalPages}
          onClick={handleNewPage(page)}
          className={cn(
            "relative inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20",
            {
              "z-10 bg-indigo-50 border-indigo-500 text-indigo-600":
                page === currentPage,
              "bg-white border-gray-300 text-gray-500 hover:bg-gray-50":
                page !== currentPage,
            }
          )}
        >
          {page}
        </PaginationLink>
      ))}
      <PaginationLink
        onClick={handleNextPage}
        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </PaginationLink>
    </nav>
  );
};

export default Pagination;
