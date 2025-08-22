import {
  cyan,
  lightBlue,
  green,
  blueGrey,
  red,
  indigo,
  yellow,
} from "@mui/material/colors";
import ciscoLogo from "../images/companies/cisco_logo.gif";
import gigNowLogo from "../images/companies/gignow_logo.png";
import SHFBLogo from "../images/companies/SHFB_logo.jpg";
import netappLogo from "../images/companies/netapp_logo.svg";
import vengefulLogo from "../images/companies/vengefulgames_logo.png";
import teslaLogo from "../images/companies/tesla_logo.png";
import hoverboardLogo from "../images/companies/hoverboard_logo.png";
import intuitLogo from "../images/companies/intuit_logo.png";

// tech constants
export const REACT = "React.js";
export const TS = "TypeScript";
export const JS = "JavaScript";
export const CSS = "CSS3";
export const HTML = "HTML5";
export const RUBY = "Ruby on Rails 5";
export const JAVA = "Java 8";
export const ANGULAR = "Angular.js 1.X";
export const ASP2 = "ASP.NET 2.0 MVC";

export interface Job {
  alt?: string;
  color: string;
  company: string;
  expr?: string[];
  inverted?: boolean;
  location: string;
  parent?: string;
  src?: string;
  tech?: string[];
  time: string;
  title: string;
}

export const work: Job[] = [
  {
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
    tech: [REACT, TS, JS, CSS, HTML],
  },
  {
    color: yellow[600],
    inverted: true,
    company: "GigNow",
    parent: "Ernst & Young",
    location: "Palo Alto, CA",
    title: "Frontend Software Engineer, Global Innovation Ventures",
    time: "2018 - 2019",
    src: gigNowLogo,
    alt: "GigNow Logo",
    expr: [
      `Help build startup ventures within EY, leveraging agile methodologies and developing primarily in ${REACT}`,
      "Add new features which helped scale the application to over double its Users, Contracts, and Countries",
      "Implement React Hot Reloading, Mixpanel Data Tracking, and stricter ESLint configuration to improve code style",
    ],
    tech: [REACT, JS, CSS, HTML, RUBY],
  },
  {
    color: lightBlue[700],
    inverted: true,
    company: "Cisco Systems",
    location: "San Jose, CA",
    title: "Full Stack Software Engineer III, Core Software Group",
    time: "2017 - 2018",
    src: ciscoLogo,
    alt: "Cisco Systems Logo",
    expr: [
      "Developed web applications to process and display data on network health and analytics",
      "Created several Proof of Concept integrations with Cisco DNA-Center and several acquisitions",
      "Wrote Time Series Analysis Pipelines in JSON to create aggregations of network packets over a fixed or rolling window",
    ],
    tech: [REACT, JS, CSS, HTML, JAVA],
  },
  {
    color: cyan[900],
    company: "Hoverboard Technologies",
    parent: "Equalia",
    location: "Mountain View, CA",
    title: "Frontend Software Engineer",
    time: "2016 - 2017",
    src: hoverboardLogo,
    alt: "Hoverboard Logo",
    expr: [
      "Developed multi-platform software tools to view riding statistics of the hoverboard stored in AWS",
      "Managed a team in India creating the Android application, and tested the app by creating realistic data simulations",
      "Programed the LED light patterns around the rim of the Hoverboard",
    ],
    tech: [ANGULAR, JS, CSS, HTML],
  },
  {
    color: red[700],
    company: "Tesla, Inc.",
    location: "Fremont, CA",
    title: "Full Stack Software Engineering Master's Intern, Supply Chain Team",
    time: "2015 - 2016",
    src: teslaLogo,
    alt: "Tesla Logo",
    expr: [
      "Developed web applications to track all welds on the Model X and Model 3",
      "Improve the accessibility and responsive design of existing web applications and websites",
      "Gathered requirements, and created new software tools to track weld joints on Tesla Models, improving vehicle safety",
    ],
    tech: [ANGULAR, JS, CSS, HTML, ASP2],
  },
  {
    color: "black",
    company: "NetApp",
    location: "Sunnyvale, CA",
    title:
      "Frontend Web Developer (Contractor), HRSolutions and Process Enablement Team",
    time: "2012 - 2015",
    src: netappLogo,
    alt: "NetApp Logo",
    expr: [
      "Developed web applications to enable various processes and managed task assignment on web projects",
      "Presented status of projects with upper management and provided solutions on how to resolve roadblocks",
      "Migrated between CMS’s, supported new WordPress Intranet, and generated graphics in Photoshop",
    ],
    tech: [ANGULAR, JS, CSS, HTML],
  },
];

export const volunteer: Job[] = [
  {
    color: blueGrey[900],
    company: "Midnight Game Club",
    location: "Sunnyvale, CA",
    title: "Frontend Software Engineer and Project Manager",
    time: "2014 - 2015 (Spare Time)",
    src: vengefulLogo,
    alt: "Midnight Game Club Logo",
    expr: [
      "Developed functional HTML and CSS pages from the mockup images provided from the designers",
      "Managed a team of 3 other developers to meet requirements by the deadlines",
      "Designed improvements to the look and feel, and improve the overall experience of the game",
    ],
    tech: [JS, CSS, HTML],
  },
  {
    color: green[800],
    company: "Second Harvest Food Bank",
    location: "Santa Clara, CA",
    title: "Volunteer Team Leader",
    time: "2009 - 2016",
    src: SHFBLogo,
    alt: "Second Harvest Food Bank Logo",
    expr: [
      "Instruct and supervise between 10 and 40 volunteers regarding food sorting, packaging and distribution",
      "Food is then distributed to smaller organizations that help the homeless and disadvantaged",
    ],
  },
];

export const school: Job[] = [
  {
    color: red[900],
    company: "SCU MS",
    location: "Santa Clara, CA",
    title: "Grad Student",
    time: "2015 - 2016",
    expr: [
      "Major: Computer Science and Engineering, Emphasis: Software Engineering",
      "GPA: 3.7",
    ],
  },
  {
    color: red[900],
    company: "Santa Clara University BS",
    location: "Santa Clara, CA",
    title: "Undergrad Student",
    time: "2011 - 2015",
    expr: [
      "Major: Computer Science and Engineering, Minor: Mathematics",
      "GPA: 3.7",
    ],
  },
];
