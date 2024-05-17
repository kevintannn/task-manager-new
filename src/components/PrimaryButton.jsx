/* eslint-disable react/prop-types */

import clsx from "clsx";
import { Link } from "react-router-dom";

const PrimaryButton = ({
  children,
  cname,
  href,
  handleClick,
  forwardedRef,
}) => {
  return (
    <>
      {!href && (
        <button
          ref={forwardedRef}
          className={clsx(
            cname,
            "relative flex items-center rounded-lg bg-blue-950 p-3 text-xs text-white duration-150 hover:bg-blue-900",
          )}
          onClick={handleClick}
        >
          {children}
        </button>
      )}

      {href && (
        <Link
          to={href}
          className={clsx(
            cname,
            "relative flex items-center rounded-lg bg-blue-950 p-3 text-xs text-white duration-150 hover:bg-blue-900",
          )}
        >
          {children}
        </Link>
      )}
    </>
  );
};

export default PrimaryButton;
