/* eslint-disable react/prop-types */
import CallMissedOutgoingIcon from "@mui/icons-material/CallMissedOutgoing";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { avatarImg, firebaseRealtimeDatabaseURL } from "../constants";
import { getDatasFromAxios } from "../utils";
import axios from "axios";
import Loading from "./Loading";

const Person = ({ person, id, type, idx }) => {
  const user = useSelector((state) => state.auth.user);

  const [statePerson, setStatePerson] = useState(person);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleClick = () => {
    if (user.id == statePerson?.id) {
      return navigate("/profile");
    }

    return navigate(`/profile/${statePerson?.id}`);
  };

  useEffect(() => {
    setLoading(true);

    if (!person && id) {
      axios
        .get(`${firebaseRealtimeDatabaseURL}/users/${id}.json`)
        .then((res) => {
          if (res.data) {
            setStatePerson({ id: id, ...res.data });
            setLoading(false);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [id, person]);

  useEffect(() => {
    setStatePerson(person);
  }, [person]);

  useEffect(() => {
    setLoading(true);

    const getDivisions = async () => {
      setDivisions(await getDatasFromAxios("divisions"));
    };
    getDivisions().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading type="spinner_only" />
  ) : (
    <div
      className="flex cursor-pointer items-center gap-5 p-1 duration-100 hover:rounded-full hover:bg-blue-100"
      onClick={handleClick}
    >
      <img
        src={statePerson?.imgPath ?? avatarImg}
        className="h-10 w-10 rounded-full object-cover"
      />

      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-bold">{statePerson?.name}</p>
          <p className="text-xs text-gray-600">
            {divisions.find((item) => item.id == statePerson?.divisionId)?.name}{" "}
            {type === "creator_label" && idx === 0 && "• Creator"}
          </p>
        </div>

        <CallMissedOutgoingIcon className="mr-3 text-blue-700" />
      </div>
    </div>
  );
};

export default Person;
