export type PaginationProps = {
  alwaysShow?: boolean;
  className?: string;
  disabled?: boolean;
  label?: string;
  onPageChange?: (page: number) => void;
  page: number;
  pageSize: number;
  siblingCount?: number;
  totalItems: number;
};

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function getPageRange(currentPage: number, totalPages: number, siblingCount: number): number[] {
  const start = Math.max(1, currentPage - siblingCount);
  const end = Math.min(totalPages, currentPage + siblingCount);
  const pages: number[] = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
}

export function Pagination({
  alwaysShow = false,
  className,
  disabled = false,
  label = "Pagination",
  onPageChange,
  page,
  pageSize,
  siblingCount = 1,
  totalItems,
}: PaginationProps) {
  const totalPages = pageSize > 0 ? Math.ceil(totalItems / pageSize) : 0;

  if (totalPages <= 1 && !alwaysShow) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const currentPage = Math.min(Math.max(page, 1), safeTotalPages);
  const pages = getPageRange(currentPage, safeTotalPages, siblingCount);

  function requestPage(nextPage: number) {
    if (disabled || nextPage === currentPage) return;
    onPageChange?.(nextPage);
  }

  return (
    <nav aria-label={label} className={joinClasses("atlas-pagination", className)}>
      <button
        className="atlas-action-menu__item"
        disabled={disabled || currentPage <= 1}
        onClick={() => requestPage(currentPage - 1)}
        type="button"
      >
        Previous
      </button>
      {pages.map((pageNumber) => (
        <button
          aria-current={pageNumber === currentPage ? "page" : undefined}
          className={joinClasses(
            "atlas-pagination__page",
            pageNumber === currentPage && "atlas-pagination__page--current",
          )}
          disabled={disabled}
          key={pageNumber}
          onClick={() => requestPage(pageNumber)}
          type="button"
        >
          {pageNumber}
        </button>
      ))}
      <button
        className="atlas-action-menu__item"
        disabled={disabled || currentPage >= safeTotalPages}
        onClick={() => requestPage(currentPage + 1)}
        type="button"
      >
        Next
      </button>
    </nav>
  );
}
