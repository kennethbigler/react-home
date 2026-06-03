import { indigo } from "@mui/material/colors";
import type { School } from "./classes";
import type { Job } from "./work";
import intuitLogo from "../images/companies/intuit_logo.png";

export const summaryJob: Job = {
  color: indigo.A400,
  company: "Intuit",
  location: "Mountain View, CA",
  title: "Head of Accessibility Engineering",
  time: "2019 - Present",
  src: intuitLogo,
  alt: "Intuit Logo",
  expr: [
    "Improving accessibility across all of Intuit (with a focus on engineering). Consult with teams on adding automation testing and improving processes.",
    "Working as a part of the Intuit Design Systems team to create reusable, accessible, well-tested TypeScript components that are used across many of Intuit's products.",
    "Titles:",
    " - Frontend Stars - Train new engineers joining Intuit on our Frontend practices",
    " - Chair for the Next Generation Network",
    " - Chair for the Intuit Abilities Network",
  ],
  tech: ["React.js", "TypeScript", "JavaScript", "CSS3", "HTML5"],
};

export const summarySchools: School[] = [
  {
    school: "Santa Clara University",
    location: "Santa Clara, CA",
    degree: "Master of Science",
    major: "Computer Engineering",
    minor: "Emphasis in Software Engineering",
    honors: "Tau Beta Pi, Upsilon Pi Epsilon, Dean’s List",
    years: [],
  },
  {
    school: "Santa Clara University",
    location: "Santa Clara, CA",
    degree: "Bachelor of Science",
    major: "Computer Science & Engineering",
    minor: "Minor in Mathematics",
    honors: "Tau Beta Pi, Upsilon Pi Epsilon, Dean’s List",
    years: [],
  },
  {
    school: "Stanford University",
    location: "Stanford, CA",
    degree:
      "Stanford Continuing Studies & Undergrad High School Summer Visitor",
    years: [],
  },
  {
    school: "The King's Academy",
    location: "Sunnyvale, CA",
    degree: "High School Diploma",
    honors:
      "National Honors Society, California Scholarship Federation, Principal’s Honor Roll",
    years: [],
  },
];
