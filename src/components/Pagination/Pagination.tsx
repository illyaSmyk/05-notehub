import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  forcePage?: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  pageRangeDisplayed?: number;
  marginPagesDisplayed?: number;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
  breakLabel?: React.ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({
  pageCount,
  forcePage = 0,
  onPageChange,
  pageRangeDisplayed = 5,
  marginPagesDisplayed = 1,
  previousLabel = "←",
  nextLabel = "→",
  breakLabel = "...",
}) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={forcePage}
      onPageChange={onPageChange}
      pageRangeDisplayed={pageRangeDisplayed}
      marginPagesDisplayed={marginPagesDisplayed}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      breakLabel={breakLabel}
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.pageItem}
      previousLinkClassName={css.pageLink}
      nextClassName={css.pageItem}
      nextLinkClassName={css.pageLink}
      breakClassName={css.pageItem}
      breakLinkClassName={css.pageLink}
      activeClassName={css.active}
    />
  );
};

export default Pagination;