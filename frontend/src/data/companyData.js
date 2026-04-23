import programSmallImage from "../assets/program-small-image.png";

export const companyStats = [
  {
    id: 1,
    title: "My Programs",
    value: 8,
    subtitle: "Active and completed",
    type: "programs",
  },
  {
    id: 2,
    title: "Requests",
    value: 27,
    subtitle: "Application requests",
    type: "requests",
  },
  {
    id: 3,
    title: "My Participants",
    value: 45,
    subtitle: "Current trainees",
    type: "participants",
  },
];

export const companyPrograms = [
  {
    id: 1,
    title: "Frontend Training",
    subtitle: "React & UI Development",
    description:
      "A practical frontend program that helps students build responsive interfaces and component-based applications.",
    rules: "Submit your work before the deadline. Attend all sessions.",
    seats: 10,
    location: "Remote",
    image: programSmallImage,
    participants: 10,
    dateFrom: "2026-02-01",
    dateTo: "2026-02-22",
    status: "Active",
  },
  {
    id: 2,
    title: "UI/UX Bootcamp",
    subtitle: "Design Thinking Program",
    description:
      "Students learn visual hierarchy, wireframing, accessibility, and practical UI design workflows.",
    rules: "Portfolio tasks are required. Weekly review attendance is mandatory.",
    seats: 12,
    location: "Kuwait City",
    image: programSmallImage,
    participants: 9,
    dateFrom: "2026-03-05",
    dateTo: "2026-03-28",
    status: "Active",
  },
  {
    id: 3,
    title: "Backend Basics",
    subtitle: "APIs and Data Flow",
    description:
      "An introductory backend program focused on routes, APIs, middleware, and database thinking.",
    rules: "Students must complete all weekly exercises.",
    seats: 15,
    location: "Remote",
    image: programSmallImage,
    participants: 15,
    dateFrom: "2026-01-10",
    dateTo: "2026-02-05",
    status: "Completed",
  },
];

export const companyParticipants = [
  {
    id: 1,
    name: "Roselle Ehrman",
    email: "roselle@gmail.com",
    studentId: "EL40012",
    year: "Third",
    major: "Computer Science",
    skills: "Design",
    program: "Frontend Training",
    dateApplied: "2-Feb-26",
    status: "Review",
    note: "Portfolio looks strong. Waiting for final confirmation.",
  },
  {
    id: 2,
    name: "Andriana",
    email: "andriana@gmail.com",
    studentId: "EL40013",
    year: "Second",
    major: "Design",
    skills: "Design",
    program: "UI/UX Bootcamp",
    dateApplied: "2-Feb-26",
    status: "Accepted",
    note: "Accepted and informed by email.",
  },
  {
    id: 3,
    name: "Vacinzo",
    email: "vacinzo@gmail.com",
    studentId: "EL40014",
    year: "Third",
    major: "Computer Science",
    skills: "Web",
    program: "Frontend Training",
    dateApplied: "2-Feb-26",
    status: "Rejected",
    note: "Did not meet attendance requirements.",
  },
  {
    id: 4,
    name: "Jone Smith",
    email: "jone@gmail.com",
    studentId: "EL40015",
    year: "Fourth",
    major: "Cybersecurity",
    skills: "Security",
    program: "Backend Basics",
    dateApplied: "2-Feb-26",
    status: "Accepted",
    note: "Good background and strong task completion.",
  },
];

export const companyOverview = [
  { label: "Review", value: 43, type: "review" },
  { label: "Accepted", value: 27, type: "accepted" },
  { label: "Rejected", value: 33, type: "rejected" },
];

export const companyProfileData = {
  companyName: "Creative Tech",
  companyId: "CT-2026-001",
  industry: "Technology",
  phone: "+965 9999 9999",
  website: "https://creativetech.com",
  companySize: "51-200",
  location: "Kuwait City",
  foundedYear: "2020",
  contactPerson: "Fatima Al-Harbi",
  internshipAvailability: "Open",
  email: "Tech123@gmail.com",
};