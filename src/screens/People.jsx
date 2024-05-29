import Person from "../components/Person";
import PrimaryButton from "../components/PrimaryButton";
import slugify from "slugify";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useEffect, useRef, useState } from "react";
import { uiActions } from "../store/uiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Box, FormControlLabel, Paper, Radio, RadioGroup } from "@mui/material";
import useEnterKeyPressEffect from "../hooks/useEnterKeyPressEffect";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { createActivity, getDatasFromAxios } from "../utils";
import TopBar from "../components/TopBar";
import axios from "axios";
import { firebaseRealtimeDatabaseURL } from "../constants";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const People = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [divisionFilterId, setDivisionFilterId] = useState("-1");
  const [search, setSearch] = useState("");
  const [divisionMode, setDivisionMode] = useState("add");
  const [divisionName, setDivisionName] = useState("");
  const [divisionChangedSwitch, setDivisionChangedSwitch] = useState(false);
  const [editInputToggleIdx, setEditInputToggleIdx] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveRef = useRef();
  const divisionNameInputRef = useRef();

  const navigate = useNavigate();

  const filteredUsers = users?.filter((item) => {
    if (divisionFilterId === "-1") {
      return item;
    }

    if (item.divisionId == divisionFilterId) {
      return item;
    }
  });

  const searchedUsers = filteredUsers.filter((item) => {
    if (item.name.toLowerCase().includes(search.toLowerCase())) {
      return item;
    }

    if (search === "") {
      return item;
    }
  });

  const addDivision = async () => {
    if (divisionName.length < 2) {
      return alert("Division name is too short (min. 2 characters)");
    }

    // firebase
    const newDivision = {
      name: divisionName,
      slug: slugify(divisionName, {
        lower: true,
        strict: true,
      }),
    };

    await axios
      .post(`${firebaseRealtimeDatabaseURL}/divisions.json`, newDivision)
      .then(async (res) => {
        if (res.data) {
          dispatch(
            uiActions.setNotification({
              type: "success",
              message: "New division added!",
              open: true,
            }),
          );

          setDivisionName("");
          setDivisionMode("add");

          setDivisionChangedSwitch(!divisionChangedSwitch);

          await createActivity(
            user.id,
            `added a new division "${divisionName}".`,
          );
        }
      })
      .catch((err) => console.log(err));

    // local storage
    // const existingDivisionsJSON = localStorage.getItem("divisions");
    // const existingDivisions = existingDivisionsJSON
    //   ? JSON.parse(existingDivisionsJSON)
    //   : [];

    // const newDivisionId =
    //   existingDivisions.length > 0
    //     ? parseInt(existingDivisions[existingDivisions.length - 1].id) + 1
    //     : 1;

    // existingDivisions.push({
    //   id: newDivisionId,
    //   name: divisionName,
    //   slug: slugify(divisionName, {
    //     lower: true,
    //     strict: true,
    //   }),
    // });

    // localStorage.setItem("divisions", JSON.stringify(existingDivisions));

    // dispatch(
    //   uiActions.setNotification({
    //     type: "success",
    //     message: "New division added!",
    //     open: true,
    //   }),
    // );

    // setDivisionName("");
    // setDivisionMode("add");

    // setDivisionChangedSwitch(!divisionChangedSwitch);

    // createActivity(user.id, `added a new division "${divisionName}".`);
  };

  const deleteDivision = async (divisionId) => {
    if (!confirm("Confirm delete this division? (can not be undone)")) {
      return;
    }

    // firebase
    // check if there is user in this division
    await axios
      .get(
        `${firebaseRealtimeDatabaseURL}/users.json?orderBy="divisionId"&equalTo="${divisionId}"`,
      )
      .then(async (res) => {
        if (Object.keys(res.data).length > 0) {
          dispatch(
            uiActions.setNotification({
              type: "error",
              message:
                "Can not delete because there are users in this division!",
              open: true,
            }),
          );
        } else {
          await axios
            .delete(
              `${firebaseRealtimeDatabaseURL}/divisions/${divisionId}.json`,
            )
            .then(async (res) => {
              if (res.status === 200) {
                dispatch(
                  uiActions.setNotification({
                    type: "success",
                    message: "Division deleted!",
                    open: true,
                  }),
                );

                setDivisionChangedSwitch(!divisionChangedSwitch);

                await createActivity(
                  user.id,
                  `deleted division named "${divisions.find((item) => item.id == divisionId).name}".`,
                );
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));

    return;

    // local storage
    // // check if there is user in this division
    // const existUserInDivision = users?.find(
    //   (item) => item.divisionId == divisionId,
    // );
    // if (existUserInDivision) {
    //   return alert(
    //     "Can not delete this division because there are users in this division!",
    //   );
    // }

    // const existingDivisionsJSON = localStorage.getItem("divisions");
    // const existingDivisions = existingDivisionsJSON
    //   ? JSON.parse(existingDivisionsJSON).filter(
    //       (item) => item.id != divisionId,
    //     )
    //   : [];

    // localStorage.setItem("divisions", JSON.stringify(existingDivisions));

    // dispatch(
    //   uiActions.setNotification({
    //     type: "success",
    //     message: "Division deleted!",
    //     open: true,
    //   }),
    // );

    // setDivisionChangedSwitch(!divisionChangedSwitch);

    // createActivity(
    //   user.id,
    //   `deleted division named "${divisions.find((item) => item.id == divisionId).name}".`,
    // );
  };

  const editDivision = async (divisionId) => {
    if (divisionName.length < 2) {
      return alert("Division name is too short (min. 2 characters)");
    }

    // firebase
    const updatedDivision = {
      name: divisionName,
      slug: slugify(divisionName, {
        lower: true,
        strict: true,
      }),
    };

    await axios
      .patch(
        `${firebaseRealtimeDatabaseURL}/divisions/${divisionId}.json`,
        updatedDivision,
      )
      .then(async (res) => {
        if (res.data) {
          dispatch(
            uiActions.setNotification({
              type: "success",
              message: "Division saved!",
              open: true,
            }),
          );

          setDivisionName("");
          setEditInputToggleIdx(null);

          setDivisionChangedSwitch(!divisionChangedSwitch);

          await createActivity(
            user.id,
            `changed division name from "${divisions.find((item) => item.id == divisionId).name}" to "${divisionName}".`,
          );

          return navigate(0);
        }
      })
      .catch((err) => console.log(err));

    // local storage
    // const existingDivisionsJSON = localStorage.getItem("divisions");
    // const existingDivisions = existingDivisionsJSON
    //   ? JSON.parse(existingDivisionsJSON).map((item) => {
    //       if (item.id == divisionId) {
    //         return {
    //           ...item,
    //           name: divisionName,
    //           slug: slugify(divisionName, {
    //             lower: true,
    //             strict: true,
    //           }),
    //         };
    //       }

    //       return item;
    //     })
    //   : [];

    // localStorage.setItem("divisions", JSON.stringify(existingDivisions));

    // dispatch(
    //   uiActions.setNotification({
    //     type: "success",
    //     message: "Division saved!",
    //     open: true,
    //   }),
    // );

    // setDivisionName("");
    // setEditInputToggleIdx(null);

    // setDivisionChangedSwitch(!divisionChangedSwitch);

    // createActivity(
    //   user.id,
    //   `changed division name from "${divisions.find((item) => item.id == divisionId).name}" to "${divisionName}".`,
    // );
  };

  useEnterKeyPressEffect(saveRef);

  useEffect(() => {
    if (divisionMode === "save") {
      divisionNameInputRef.current?.focus();
    }
  }, [divisionMode]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      setDivisions(await getDatasFromAxios("divisions"));
      setUsers(await getDatasFromAxios("users"));
    };
    fetchData().finally(() => setLoading(false));
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <div className="flex flex-col">
      {/* top bar */}
      <TopBar mode="only_profile" />

      {/* content */}
      <div className="mt-16 flex items-center justify-center">
        {/* box */}
        <div className="flex gap-5">
          {/* left section */}
          <div className="flex max-h-[500px] w-[500px] flex-col items-center gap-3">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-lg border-2 p-3 px-5 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Box
              component={Paper}
              elevation={3}
              className="flex w-full flex-col gap-3 overflow-y-auto p-5"
              sx={{
                borderRadius: "10px",
              }}
            >
              {searchedUsers.length > 0 ? (
                searchedUsers.map((item, idx) => (
                  <Person key={idx} person={item} idx={idx} />
                ))
              ) : (
                <p className="text-sm text-gray-600">
                  No person is in this division
                </p>
              )}
            </Box>
          </div>

          {/* right section */}
          <Box
            component={Paper}
            elevation={3}
            className="h-fit max-h-[500px] w-[300px] overflow-y-auto"
            sx={{ borderRadius: "10px" }}
          >
            <div className="flex flex-col gap-5 p-5">
              {/* header */}
              <h1 className="font-bold">Divisions</h1>

              {/* radios */}
              <RadioGroup
                value={divisionFilterId}
                onChange={(e) => setDivisionFilterId(e.target.value)}
              >
                <FormControlLabel value="-1" control={<Radio />} label="All" />

                {divisions.map((item, idx) => (
                  <div className="" key={idx}>
                    {/* radio label and buttons */}
                    <div className="flex items-center justify-between">
                      {/* radio label */}
                      <FormControlLabel
                        key={idx}
                        label={item.name}
                        value={item.id}
                        control={<Radio />}
                      />

                      {/* edit and delete button */}
                      {editInputToggleIdx === null && (
                        <div className="flex items-center gap-1">
                          <div
                            className="cursor-pointer rounded-sm bg-green-600 hover:bg-green-500"
                            onClick={() => {
                              setDivisionName("");
                              setDivisionMode("add");
                              setEditInputToggleIdx((prev) => {
                                if (prev === idx) {
                                  return null;
                                }

                                return idx;
                              });
                            }}
                          >
                            <ModeEditIcon className="p-1 text-white" />
                          </div>

                          <div
                            className="cursor-pointer rounded-sm bg-red-700 hover:bg-red-600"
                            onClick={() => deleteDivision(item.id)}
                          >
                            <DeleteForeverIcon className="p-1 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* edit input and buttons */}
                    {editInputToggleIdx === idx && (
                      <div className="flex items-center gap-2">
                        <input
                          className="w-full rounded-lg border-2 p-2 text-sm outline-none"
                          placeholder="New Division Name"
                          value={divisionName}
                          onChange={(e) => setDivisionName(e.target.value)}
                        />

                        <div className="flex items-center gap-1">
                          <div
                            className="cursor-pointer rounded-sm bg-green-600 hover:bg-green-500"
                            onClick={() => editDivision(item.id)}
                          >
                            <CheckIcon className="p-1 text-white" />
                          </div>

                          <div
                            className="cursor-pointer rounded-sm bg-red-700 hover:bg-red-600"
                            onClick={() => setEditInputToggleIdx(null)}
                          >
                            <CancelIcon className="p-1 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>

              {/* add division button */}
              {divisionMode === "add" && (
                <PrimaryButton
                  cname={"justify-center"}
                  handleClick={() => {
                    setDivisionName("");
                    setEditInputToggleIdx(null);
                    setDivisionMode("save");
                  }}
                >
                  Add Division
                </PrimaryButton>
              )}

              {/* save and cancel button */}
              {divisionMode === "save" && (
                <div className="flex flex-col gap-2">
                  <input
                    ref={divisionNameInputRef}
                    className="rounded-lg border-2 p-2 text-sm outline-none"
                    placeholder="New Division Name"
                    value={divisionName}
                    onChange={(e) => setDivisionName(e.target.value)}
                  />

                  <div className="flex items-center gap-2">
                    <PrimaryButton
                      forwardedRef={saveRef}
                      cname={"justify-center w-full"}
                      handleClick={addDivision}
                    >
                      Save
                    </PrimaryButton>

                    <PrimaryButton
                      cname={
                        "justify-center w-full bg-red-700 hover:bg-red-600"
                      }
                      handleClick={() => setDivisionMode("add")}
                    >
                      Cancel
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default People;
