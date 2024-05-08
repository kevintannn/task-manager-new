import ProjectsTable from "../components/ProjectsTable";
import ListLayout from "./layouts/ListLayout";
import ReplyIcon from "@mui/icons-material/Reply";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useSelector } from "react-redux";
import IconLabel from "../components/IconLabel";

const ProjectList = () => {
  const projects = useSelector((state) => state.project.projects);

  return (
    <ListLayout>
      <div className="flex flex-col gap-7">
        <div className="flex items-end justify-between">
          {/* header */}
          <h1 className="text-4xl font-bold">Project List</h1>

          <div className="flex items-center gap-5 text-xs text-gray-500">
            <IconLabel type="export" hoverable={true} />

            <IconLabel type="share" hoverable={true} />

            <div className="cursor-pointer">
              <MoreHorizIcon
                fontSize="large"
                className="text-blue-900 hover:text-blue-500"
              />
            </div>
          </div>
        </div>

        {/* projects */}
        <ProjectsTable projects={projects} fontsize={"15px"} />
      </div>
    </ListLayout>
  );
};

export default ProjectList;
