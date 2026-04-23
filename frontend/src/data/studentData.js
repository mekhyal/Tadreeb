import programImage from "../assets/program-image.jpg";

export const studentPrograms = [
  {
    id: 1,
    title: "Web Design Program",
    category: "UI/UX",
    shortDescription:
      "Learn modern UI layout, design basics, and responsive web principles.",
    fullDescription:
      "This program helps students improve practical and creative web design skills. Participants work on layout structure, responsive design, interface thinking, and presentation quality.",
    startDate: "2026-02-10",
    endDate: "2026-02-25",
    openTo: "Fourth Year",
    company: "KUNIV",
    location: "KUNIV Campus, Design Building, Room 204",
    rules: [
      "Applicants should attend all sessions.",
      "Basic design knowledge is preferred.",
      "Submitted work must be original.",
    ],
    status: "Register",
    applied: false,
    image: programImage,
  },
  {
    id: 2,
    title: "Frontend Training",
    category: "Web Development",
    shortDescription:
      "Build websites with React, responsive design, and component thinking.",
    fullDescription:
      "Students will practice modern frontend development using reusable components, routing, layouts, and responsive techniques.",
    startDate: "2026-03-05",
    endDate: "2026-03-28",
    openTo: "Third Year",
    company: "Microsoft",
    location: "Innovation Center, Kuwait City",
    rules: [
      "Applicants should know HTML and CSS basics.",
      "Attendance is required for all workshops.",
      "Final project submission is mandatory.",
    ],
    status: "Register",
    applied: false,
    image: programImage,
  },
  {
    id: 3,
    title: "UI/UX Internship",
    category: "UI/UX",
    shortDescription:
      "Understand user flows, wireframing, accessibility, and interface quality.",
    fullDescription:
      "This opportunity introduces students to interface design workflows, usability review, visual structure, and user-centered design principles.",
    startDate: "2026-04-15",
    endDate: "2026-04-30",
    openTo: "Fourth Year",
    company: "Google",
    location: "Design Hub, Kuwait",
    rules: [
      "Portfolio is a plus.",
      "Participants must attend all sessions.",
      "Team collaboration is expected.",
    ],
    status: "Complete",
    applied: false,
    image: programImage,
  },
  {
    id: 4,
    title: "Software Program",
    category: "Software",
    shortDescription:
      "Practice software problem solving, teamwork, and development workflow.",
    fullDescription:
      "Students will work on structured software tasks, version control, teamwork, and practical workflow experience in a guided environment.",
    startDate: "2026-05-08",
    endDate: "2026-05-27",
    openTo: "Second Year",
    company: "IBM",
    location: "Tech Building, Room 108",
    rules: [
      "Basic programming knowledge is required.",
      "Assignments should be submitted on time.",
      "Participation in group activities is required.",
    ],
    status: "Register",
    applied: false,
    image: programImage,
  },
  {
    id: 5,
    title: "Web Design Internship",
    category: "Web Development",
    shortDescription:
      "Improve visual design, layout systems, and presentation quality.",
    fullDescription:
      "A practical internship that focuses on visual hierarchy, clean layouts, responsive design, and professional design delivery.",
    startDate: "2026-03-15",
    endDate: "2026-04-01",
    openTo: "Fourth Year",
    company: "Amazon",
    location: "Creative Studio, Floor 2",
    rules: [
      "Applicants must commit to all sessions.",
      "Design software familiarity is recommended.",
      "Work must be original.",
    ],
    status: "Register",
    applied: true,
    image: programImage,
  },
  {
    id: 6,
    title: "Product Design Program",
    category: "UI/UX",
    shortDescription:
      "Explore design systems, product thinking, and user-centered workflows.",
    fullDescription:
      "This program helps students understand the relationship between product goals, user needs, and interface decision-making.",
    startDate: "2026-07-20",
    endDate: "2026-08-10",
    openTo: "Third Year",
    company: "Adobe",
    location: "Innovation Lab, Room 401",
    rules: [
      "Attendance is required.",
      "Students should participate in workshops.",
      "All outputs should be original.",
    ],
    status: "Register",
    applied: false,
    image: programImage,
  },
  {
    id: 7,
    title: "Backend Development Program",
    category: "Software",
    shortDescription:
      "Practice APIs, routing, databases, and clean backend structure.",
    fullDescription:
      "Students will build backend thinking through API design, data flow, routes, middleware, and basic database integration concepts.",
    startDate: "2026-09-09",
    endDate: "2026-09-26",
    openTo: "Third Year",
    company: "Oracle",
    location: "Lab 5, Main Campus",
    rules: [
      "Programming fundamentals are required.",
      "Attendance is required.",
      "Final mini-project is mandatory.",
    ],
    status: "Register",
    applied: false,
    image: programImage,
  },
  {
    id: 8,
    title: "Mobile App Design Bootcamp",
    category: "Mobile",
    shortDescription:
      "Design mobile-first interfaces with practical UI thinking.",
    fullDescription:
      "Students will design and prototype mobile experiences with practical exercises in layout, hierarchy, usability, and flow.",
    startDate: "2026-10-04",
    endDate: "2026-10-22",
    openTo: "Second Year",
    company: "Apple",
    location: "Design Lab 3",
    rules: [
      "Applicants should join all sessions.",
      "Design activity participation is required.",
      "Original work only.",
    ],
    status: "Register",
    applied: false,
    image: programImage,
  },
  {
    id: 9,
    title: "Data Visualization Program",
    category: "Data",
    shortDescription:
      "Learn to communicate data clearly through visual storytelling.",
    fullDescription:
      "This program introduces students to visual data communication, dashboard thinking, chart design, and presentation clarity.",
    startDate: "2026-11-01",
    endDate: "2026-11-20",
    openTo: "Fourth Year",
    company: "Tableau",
    location: "Business Center, Hall B",
    rules: [
      "Applicants should be committed to attendance.",
      "Basic spreadsheet familiarity is useful.",
      "Team participation is required.",
    ],
    status: "Register",
    applied: false,
    image: programImage,
  },
];

export const applicationData = [
  {
    id: 1,
    company: "Google",
    opportunity: "UI/UX Internship",
    status: "Review",
    note: "Application under review",
  },
  {
    id: 2,
    company: "Microsoft",
    opportunity: "Frontend Training",
    status: "Accepted",
    note: "Check your email for next steps",
  },
  {
    id: 3,
    company: "Amazon",
    opportunity: "Web Design Internship",
    status: "Rejected",
    note: "You can apply again next cycle",
  },
  {
    id: 4,
    company: "IBM",
    opportunity: "Software Program",
    status: "Review",
    note: "Interview may be scheduled soon",
  },
];