const FINAL_APPLICATION_STATUSES = ['Accepted', 'Rejected'];

const endOfDay = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(23, 59, 59, 999);
  return date;
};

const startOfDay = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

const getRegistrationDeadline = (program) => {
  if (!program) return null;
  if (program.registrationDeadline) return endOfDay(program.registrationDeadline);
  if (!program.dateFrom) return null;

  const fallback = endOfDay(program.dateFrom);
  if (!fallback) return null;
  fallback.setDate(fallback.getDate() - 1);
  return fallback;
};

const getAutomaticApplicationStatus = (application) => {
  if (!application) return 'Submitted';
  if (FINAL_APPLICATION_STATUSES.includes(application.status)) {
    return application.status;
  }

  const program = application.programID;
  if (!program) return application.status || 'Submitted';
  if (program.status === 'Completed') return 'Not Reviewed';

  const today = startOfDay(new Date());
  const startDate = startOfDay(program.dateFrom);
  if (startDate && today >= startDate) return 'Not Reviewed';

  const registrationDeadline = getRegistrationDeadline(program);
  if (registrationDeadline && registrationDeadline < new Date()) {
    return 'Under Review';
  }

  return 'Submitted';
};

const syncAutomaticApplicationStatuses = async (applications) => {
  const list = Array.isArray(applications) ? applications : [applications];

  await Promise.all(
    list
      .filter(Boolean)
      .map(async (application) => {
        const nextStatus = getAutomaticApplicationStatus(application);
        if (application.status !== nextStatus) {
          application.status = nextStatus;
          await application.save();
        }
      })
  );

  return applications;
};

module.exports = {
  FINAL_APPLICATION_STATUSES,
  getRegistrationDeadline,
  getAutomaticApplicationStatus,
  syncAutomaticApplicationStatuses,
};
