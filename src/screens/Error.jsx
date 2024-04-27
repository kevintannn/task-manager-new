import { useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-5">
      <h1 className="text-2xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="text-gray-500">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default Error;
