/* eslint-disable react/prop-types */
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";

const PaginationButtons = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div className="flex items-center gap-3 self-end text-xs">
      <p>
        Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
      </p>

      <div className="flex cursor-pointer items-center gap-1">
        <div
          className="text-blue-950 transition-all duration-150 hover:text-blue-900"
          onClick={() =>
            setCurrentPage((prev) => {
              if (prev === 1) {
                return prev;
              }

              return prev - 1;
            })
          }
        >
          <ArrowCircleLeftIcon fontSize="large" />
        </div>

        <div
          className="text-blue-950 transition-all duration-150 hover:text-blue-900"
          onClick={() =>
            setCurrentPage((prev) => {
              if (prev === totalPages) {
                return prev;
              }

              return prev + 1;
            })
          }
        >
          <ArrowCircleRightIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
};

export default PaginationButtons;
