/* eslint-disable react/prop-types */
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ReplyIcon from "@mui/icons-material/Reply";

const IconLabel = ({
  type,
  cname,
  hoverable = false,
  iconSizePx,
  fontSizePx,
}) => {
  const iconTypes = {
    completed: {
      Icon: <CheckCircleIcon sx={{ fontSize: iconSizePx ?? "15px" }} />,
      text: "Completed",
      color: "text-green-600",
    },
    ongoing: {
      Icon: <HourglassTopIcon sx={{ fontSize: iconSizePx ?? "15px" }} />,
      text: "Ongoing",
    },
    notstarted: {
      Icon: <PendingIcon sx={{ fontSize: iconSizePx ?? "15px" }} />,
      text: "Not Started",
    },
    failed: {
      Icon: <CancelIcon sx={{ fontSize: iconSizePx ?? "15px" }} />,
      text: "Failed",
      color: "text-red-600",
    },
    export: {
      Icon: <CloudDownloadIcon sx={{ fontSize: iconSizePx ?? "15px" }} />,
      text: "Export",
    },
    share: {
      Icon: <ReplyIcon sx={{ fontSize: iconSizePx ?? "15px" }} />,
      text: "Share",
    },
  };

  return (
    <div
      className={`${cname} ${iconTypes[type]?.color ?? "text-gray-600"} ${hoverable ? "cursor-pointer text-gray-500 hover:text-gray-700" : "cursor-default text-gray-600"} flex items-center gap-2`}
    >
      <div className="-mt-0.5">
        {iconTypes[type]?.Icon ?? iconTypes["ongoing"].Icon}
      </div>

      <p
        style={{
          fontSize: fontSizePx ?? "15px",
        }}
      >
        {iconTypes[type]?.text ?? iconTypes["ongoing"].text}
      </p>
    </div>
  );
};

export default IconLabel;
