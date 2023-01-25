import React from "react";

import Pagination from "react-js-pagination";
import useBreakPoints from "utils/useBreakPoints";

const PaginationComponent = ({
  itemsPerPage,
  totalItems,
  onChangePage,
  currPage,
}) => {
  const recordPerPage = itemsPerPage;
  const totalRecords = totalItems;
  const { active } = useBreakPoints();

  const breakPointCondition = {
    xs: 5,
    sm: 7,
    md: 9,
    lg: 12,
    xl: 20,
  };

  const handlePageChange = (pageNumber) => {
    onChangePage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (totalRecords <= recordPerPage) {
    return null;
  }

  return (
    <Pagination
      prevPageText="قبلی"
      nextPageText="بعدی"
      activePage={currPage}
      itemsCountPerPage={recordPerPage}
      totalItemsCount={totalRecords}
      pageRangeDisplayed={breakPointCondition[active]}
      onChange={handlePageChange}
      getPageUrl={(n) => `/?page=${n}`}
      hideDisabled
      firstPageText={Math.ceil(totalRecords / recordPerPage) > 10
      ? Math.ceil(totalRecords / recordPerPage)
      : "«"}
      lastPageText={
        Math.ceil(totalRecords / recordPerPage) > 10
          ? Math.ceil(totalRecords / recordPerPage)
          : "»"
      }
      innerClass="flex items-center justify-center p-0"
      itemClass="flex items-center justify-center p-0 w-8 h-8 mr-2 rounded-full bg-secondary-light dark:bg-secondary-dark-800 hover:bg-accent-500"
      linkClass="flex items-center justify-center p-1 hover:text-inherit"
      itemClassFirst="first-page"
      itemClassLast="last-page"
      itemClassPrev="prev-page"
      itemClassNext="next-page"
      activeClass="!bg-accent-800"
      disabledClass="disabled-page"
      activeLinkClass="active-page-link"
    />
  );
};

export default PaginationComponent;
