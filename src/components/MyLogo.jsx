import AnimationIcon from "@mui/icons-material/Animation";

const MyLogo = () => {
  return (
    <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-4 border-blue-200 bg-purple-800">
      <AnimationIcon
        sx={{
          color: "white",
          fontSize: "30px",
        }}
      />
    </div>
  );
};

export default MyLogo;
