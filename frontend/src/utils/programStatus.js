export const PROGRAM_STATUS = {
  register: "Register Now",
  active: "Active",
  selection: "Selection Phase",
  completed: "Completed",
};

const startOfDay = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const toDateInputValue = (value) => {
  if (!value) return "";

  if (typeof value === "string") {
    const dateOnly = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (dateOnly) return dateOnly[0];
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function getRegistrationDeadlineValue(program) {
  if (program?.registrationDeadline) {
    return toDateInputValue(program.registrationDeadline);
  }

  return "";
}

export function getProgramDisplayStatus(program) {
  if (program?.status === PROGRAM_STATUS.completed || program?.status === "Completed") {
    return PROGRAM_STATUS.completed;
  }

  const registrationDeadline = startOfDay(getRegistrationDeadlineValue(program));
  const start = startOfDay(program?.dateFrom);
  const end = startOfDay(program?.dateTo);
  const today = startOfDay(new Date());

  if (!start || !end || !today) return PROGRAM_STATUS.selection;
  if (today > end) return PROGRAM_STATUS.completed;
  if (registrationDeadline && today <= registrationDeadline) {
    return PROGRAM_STATUS.register;
  }
  if (today <= end) return PROGRAM_STATUS.active;
  return PROGRAM_STATUS.selection;
}

export function programStatusClass(status) {
  return String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function programStatusRank(status) {
  if (status === PROGRAM_STATUS.register) return 0;
  if (status === PROGRAM_STATUS.active) return 1;
  if (status === PROGRAM_STATUS.selection) return 2;
  if (status === PROGRAM_STATUS.completed) return 3;
  return 4;
}
