export const validateUsername = (username) => {
  if (username.includes(" ")) {
    return "Invalid username";
  }

  if (username.length > 0 && username.length < 5) {
    return "Min. 5 characters";
  }

  return null;
};

export const validatePassword = (password) => {
  if (password.length > 0 && password.length <= 8) {
    return "Min. 8 characters";
  }

  return null;
};

export const validateTaskTitle = (title) => {
  return null;
};

export const validateTaskPriority = (priority) => {
  return null;
};

export const validateTaskDivision = (division) => {
  return null;
};

export const validateTaskPeople = (people) => {
  return null;
};

export const validateDate = (startDate, endDate) => {
  if (startDate === "" || endDate === "") {
    return null;
  }

  if (startDate > endDate) {
    return "Start date can not be higher than end date";
  }

  if (startDate === endDate) {
    return "Start date can not be the same as end date";
  }

  return null;
};

export const validateProjectName = (projectName) => {
  return null;
};

export const validateDeadline = (deadline) => {
  return null;
};

export const validateProjectType = (projectType) => {
  return null;
};
