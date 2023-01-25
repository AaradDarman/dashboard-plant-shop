import { useEffect, useState } from "react";

import PaginationComponent from "components/PaginationComponent";

const withPagination = (WrappedComponent) => {
  const WithPagination = ({
    itemsPerPage,
    totalItems,
    handleChangePage,
    currentPage,
    ...props
  }) => {
    // const [currentPage, setCurrentPage] = useState(1);

    return (
      <>
        <WrappedComponent {...props} />
        <PaginationComponent
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onChangePage={(page) => {
            // setCurrentPage(page);
            handleChangePage(page);
          }}
          currPage={currentPage}
        />
      </>
    );
  };
  WithPagination.displayName = `WithPagination(${getDisplayName(
    WrappedComponent
  )})`;
  return WithPagination;
};

export default withPagination;

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};
