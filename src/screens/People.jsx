import { Box, FormControlLabel, Paper, Radio, RadioGroup } from "@mui/material";
import Person from "../components/Person";
import { divisions, users } from "../data";
import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";

const People = () => {
  const [divisionFilterId, setDivisionFilterId] = useState("-1");
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((item) => {
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

  return (
    <div className="mt-24 flex items-center justify-center">
      {/* box */}
      <div className="flex gap-5">
        {/* left section */}
        <div className="flex w-[500px] flex-col items-center gap-3">
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
            className="flex max-h-[500px] w-full flex-col gap-3 overflow-y-auto p-5"
            sx={{
              borderRadius: "10px",
            }}
          >
            {searchedUsers.length > 0 ? (
              searchedUsers.map((item, idx) => (
                <Person key={idx} id={item.id} idx={idx} />
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
          className="h-fit w-[200px]"
          sx={{ borderRadius: "10px" }}
        >
          <div className="flex flex-col gap-5 p-5">
            <h1 className="font-bold">Divisions</h1>

            <RadioGroup
              value={divisionFilterId}
              onChange={(e) => setDivisionFilterId(e.target.value)}
            >
              <FormControlLabel value="-1" control={<Radio />} label="All" />

              {divisions.map((item, idx) => (
                <FormControlLabel
                  key={idx}
                  value={item.id}
                  control={<Radio />}
                  label={item.name}
                />
              ))}
            </RadioGroup>

            <PrimaryButton cname={"justify-center"}>Add Division</PrimaryButton>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default People;
