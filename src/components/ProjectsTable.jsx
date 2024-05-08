/* eslint-disable react/prop-types */
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { projectTypes, users } from "../data";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import IconLabel from "./IconLabel";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const ProjectsTable = ({ projects, fontsize }) => {
  const navigate = useNavigate();

  const handleRowClick = (projectId) => {
    return navigate(`/projects/${projectId}`);
  };

  return (
    <TableContainer>
      <Table
        sx={{
          "th, td": {
            border: 0,
            fontFamily: "Merriweather, serif",
            fontSize: fontsize ?? "13px",
          },
          "tr th": {
            backgroundColor: "#f9f7fc",
            fontWeight: "bold",
            color: "slategray",
            borderRadius: "10px",
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Project Name</TableCell>
            <TableCell>Deadline</TableCell>
            <TableCell>Project Type</TableCell>
            <TableCell>Project Team</TableCell>
            <TableCell>Project Status</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {projects.map((item, idx) => (
            <TableRow
              className="cursor-pointer hover:bg-gray-100"
              key={idx}
              onClick={() => handleRowClick(item.id)}
            >
              <TableCell sx={{ fontWeight: "bold" }}>
                {item.projectName}
              </TableCell>
              <TableCell>
                {format(new Date(item.deadline), "eee, dd MMM yyyy, HH:mm aa")}
              </TableCell>
              <TableCell>
                {
                  projectTypes.find((item2) => item2.id == item.projectType)
                    ?.name
                }
              </TableCell>
              <TableCell>
                <div className="flex">
                  {item.people.map((item2, idx) => (
                    <img
                      key={idx}
                      src={users.find((item) => item.id == item2)?.imgPath}
                      className={`${idx !== 0 ? "-ml-4" : ""} h-9 w-9 rounded-full border-[3px] border-white object-cover`}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <IconLabel type={item.status} />
              </TableCell>
              <TableCell>
                <MoreHorizIcon fontSize="large" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProjectsTable;
