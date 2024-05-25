/* eslint-disable react/prop-types */
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
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
import { useEffect, useState } from "react";
import { avatarImg } from "../constants";
import { getDatasFromAxios } from "../utils";
import Loading from "./Loading";

const ProjectsTable = ({ projects, fontsize }) => {
  const [users, setUsers] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleRowClick = (projectId) => {
    return navigate(`/projects/${projectId}`);
  };

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      setProjectTypes(await getDatasFromAxios("projectTypes"));
      setUsers(await getDatasFromAxios("users"));
    };
    fetchData().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <TableContainer
      sx={{
        borderRadius: "15px",
      }}
    >
      <Table
        sx={{
          "th, td": {
            border: 0,
            fontFamily: "Merriweather, serif",
            fontSize: fontsize ?? "13px",
          },
          "tr th": {
            fontWeight: "bold",
            color: "slategray",
            bgcolor: "rgb(219 234 254)",
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
              className="cursor-pointer hover:bg-blue-50"
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
                      src={
                        users?.find((item) => item.id == item2)?.imgPath ??
                        avatarImg
                      }
                      className={`${idx !== 0 ? "-ml-4" : ""} h-9 w-9 rounded-full border-[3px] border-white object-cover`}
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <IconLabel type={item.status} fontSizePx={"14px"} />
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
