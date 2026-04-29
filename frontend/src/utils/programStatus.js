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

const toDateInputValue = (date) => {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
};

export function getRegistrationDeadlineValue(program) {
  if (program?.registrationDeadline) {
    const explicitDate = startOfDay(program.registrationDeadline);
    return toDateInputValue(explicitDate);
  }

  const start = startOfDay(program?.dateFrom);
  if (!start) return "";
  start.setDate(start.getDate() - 1);
  return toDateInputValue(start);
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
