import axios from "axios";
import { format } from "date-fns";
import { firebaseRealtimeDatabaseURL } from "../constants";

export const getDuration = (startDateTime, endDateTime) => {
  if (format(startDateTime, "dmy") === format(endDateTime, "dmy")) {
    const startTime = format(startDateTime, "hh:mm a");
    const endTime = format(endDateTime, "hh:mm a");
    return `${startTime} - ${endTime}`;
  }

  const formatStartDateTime = format(startDateTime, "eee, d MMM y hh:mm a");
  const formatEndDateTime = format(endDateTime, "eee, d MMM y hh:mm a");
  return `${formatStartDateTime} - ${formatEndDateTime}`;
};

export const stringSort = (array, order) => {
  if (order === "asc") {
    return array.sort();
  }

  if (order === "desc") {
    return array.sort((a, b) => b.localeCompare(a));
  }
};

export const createActivity = async (person, activity) => {
  await axios
    .post(`${firebaseRealtimeDatabaseURL}/activities.json`, {
      person,
      activity,
      updatedAt: new Date(),
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  // const existingActivitiesJSON = localStorage.getItem("activities");
  // const existingActivities = existingActivitiesJSON
  //   ? JSON.parse(existingActivitiesJSON)
  //   : [];

  // const newId = existingActivities?.[existingActivities.length - 1]?.id
  //   ? parseInt(existingActivities?.[existingActivities.length - 1]?.id) + 1
  //   : 1;

  // existingActivities.push({
  //   id: newId,
  //   person,
  //   activity,
  //   updatedAt: new Date(),
  // });

  // localStorage.setItem("activities", JSON.stringify(existingActivities));
};

export const getDatasFromAxios = async (dataName) => {
  let data = [];

  await axios
    .get(`${firebaseRealtimeDatabaseURL}/${dataName}.json`)
    .then((res) => {
      if (res.data) {
        data = Object.keys(res.data).map((item) => {
          return { id: item, ...res.data[item] };
        });
      }
    })
    .catch((err) => console.log(err));

  return data;
};
