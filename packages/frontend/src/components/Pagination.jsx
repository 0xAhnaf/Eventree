import "./Pagination.css";

export default function Pagination({
  totalVendors,
  vendorsPerPage,
  currentPage,
  setCurrentPage,
}) {
  const totalPages = Math.ceil(totalVendors / vendorsPerPage);

  const pages = [...Array(totalPages).keys()].map((n) => n + 1);

  return (
    <div className="pagination-CLP">
      <button
        className="page-btn-CLP"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        &#8249;
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`page-btn-CLP ${currentPage === page ? "active-CLP" : ""}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="page-btn-CLP"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        &#8250;
      </button>
    </div>
  );
}
