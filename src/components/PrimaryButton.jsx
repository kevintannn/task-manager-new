/* eslint-disable react/prop-types */

import clsx from "clsx";
import { Link } from "react-router-dom";

const PrimaryButton = ({
  children,
  cname,
  type = "button",
  href,
  handleClick,
  forwardedRef,
}) => {
  return (
    <>
      {type === "button" && (
        <button
          ref={forwardedRef}
          className={clsx(
            "relative flex items-center rounded-lg bg-blue-950 p-3 text-xs text-white duration-150 hover:bg-blue-900",
            cname,
          )}
          onClick={handleClick}
        >
          {children}
        </button>
      )}

      {type === "link" && (
        <Link
          to={href}
          className={clsx(
            "relative flex items-center rounded-lg bg-blue-950 p-3 text-xs text-white duration-150 hover:bg-blue-900",
            cname,
          )}
        >
          {children}
        </Link>
      )}
    </>
  );
};

export default PrimaryButton;
