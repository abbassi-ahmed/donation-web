import { Pagination as BootstrapPagination } from "react-bootstrap"
import React from "react"

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPaginationItems = () => {
    const items = []

    if (totalPages <= 5) {
      for (let page = 1; page <= totalPages; page++) {
        items.push(
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </BootstrapPagination.Item>
        )
      }
    } else {
      items.push(
        <BootstrapPagination.Item
          key={1}
          active={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </BootstrapPagination.Item>
      )

      if (currentPage > 3) {
        items.push(<BootstrapPagination.Ellipsis key="start-ellipsis" />)
      }

      for (
        let page = Math.max(2, currentPage - 1);
        page <= Math.min(totalPages - 1, currentPage + 1);
        page++
      ) {
        items.push(
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </BootstrapPagination.Item>
        )
      }

      if (currentPage < totalPages - 2) {
        items.push(<BootstrapPagination.Ellipsis key="end-ellipsis" />)
      }

      items.push(
        <BootstrapPagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </BootstrapPagination.Item>
      )
    }

    return items
  }

  return (
    <BootstrapPagination className="justify-content-center mt-4">
      <BootstrapPagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {getPaginationItems()}
      <BootstrapPagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </BootstrapPagination>
  )
}
