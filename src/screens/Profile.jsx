import TopBar from "../components/TopBar";
import PersonImg from "../assets/asd.jpg";
import PrimaryButton from "../components/PrimaryButton";

const Profile = () => {
  const user = {
    ID: 1239,
    Username: "kevin",
    Name: "Kevin Tan",
    Email: "kvnt20@gmail.com",
    Gender: "Male",
    "Contact Number": "+62 813 6257 4332",
  };

  return (
    <div className="flex flex-col">
      <TopBar mode="only_profile" />

      <div className="flex w-96 flex-col gap-10 rounded-lg bg-blue-50 p-10">
        {/* image */}
        <img
          src={PersonImg}
          className="h-40 w-40 self-center rounded-lg object-contain"
        />

        {/* details */}
        <div className="grid grid-cols-2 gap-y-5">
          {Object.keys(user).map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <p className="font-bold">{item}</p>
              <p>{user[item]}</p>
            </div>
          ))}
        </div>

        {/* change button */}
        <PrimaryButton>Change Profile</PrimaryButton>
      </div>
    </div>
  );
};

export default Profile;
