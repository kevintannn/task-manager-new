import { useParams } from "react-router-dom";

const ViewTask = () => {
  const { id } = useParams();
  console.log(id);

  // TODO: continue here love

  return <div>ViewTask</div>;
};

export default ViewTask;
