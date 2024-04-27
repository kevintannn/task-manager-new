/* eslint-disable react/prop-types */

const PrimaryButton = ({ children }) => {
  return (
    <button className="relative flex items-center rounded-lg bg-blue-950 p-3 text-xs text-white duration-150 hover:bg-blue-900">
      {children}
    </button>
  );
};

export default PrimaryButton;
