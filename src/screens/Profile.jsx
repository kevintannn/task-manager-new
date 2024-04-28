import TopBar from "../components/TopBar";
import PersonImg from "../assets/asd.jpg";
import PrimaryButton from "../components/PrimaryButton";
import { useSelector } from "react-redux";

const formatFieldName = (fieldName) => {
  if (fieldName === "id") {
    return "ID";
  }

  if (fieldName === "contactNumber") {
    return "Contact Number";
  }

  const replacedUnderscores = fieldName.replace(/_/g, " ");
  const words = replacedUnderscores.split(" ");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );

  return capitalizedWords.join(" ");
};

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col">
      <TopBar mode="only_profile" />

      <div className="flex items-center justify-center">
        {/* profile */}
        <div className="flex w-fit flex-col gap-10 rounded-lg bg-blue-50 p-10">
          {/* image */}
          <img
            src={PersonImg}
            className="h-40 w-40 self-center rounded-lg object-contain"
          />

          {/* details */}
          <div className="grid grid-cols-2 gap-5 gap-x-10">
            {Object.keys(user).map((item, idx) => (
              <div key={idx} className="flex flex-col">
                <p className="font-bold">{formatFieldName(item)}</p>
                <p className="text-sm">{user[item]}</p>
              </div>
            ))}
          </div>

          {/* change button */}
          <PrimaryButton cname="self-center">Change Profile</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Profile;
