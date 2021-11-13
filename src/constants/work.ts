import {
  cyan,
  lightBlue,
  green,
  blue,
  blueGrey,
  red,
  indigo,
  yellow,
} from "@mui/material/colors";
import dateObj, { DateObj } from "../apis/DateHelper";
import {
  REACT,
  ANGULAR,
  HTML,
  CSS,
  JS,
  BS3,
  BS4,
  RR,
  JASMINE,
  SASS,
  MOMENT,
  ESLINT,
  COMPOSE,
  MIXPANEL,
  RELOADER,
  JAVA,
  AWS,
  PYTHON2,
  ASP2,
  CSHARP,
  SQL,
  JEST,
} from "./tech";
import ciscoLogo from "../images/cisco_logo.gif";
import gigNowLogo from "../images/gignow_logo.png";
import SHFBLogo from "../images/SHFB_logo.jpg";
import netappLogo from "../images/netapp_logo.svg.png";
import vengefulLogo from "../images/vengefulgames_logo.png";
import teslaLogo from "../images/tesla_motors_logo.svg.png";
import hoverboardLogo from "../images/hoverboard_logo.png";
import intuitLogo from "../images/intuit_logo.png";

export const WORK = "work";
export const VOLUNTEER = "volunteer";
export const SCHOOL = "school";

// skills constants
const PM = "Project Management";
const INT = "Managed Intern";

export interface Job {
  alt?: string;
  color: string;
  company: string;
  end: DateObj;
  expr?: string[];
  inverted?: boolean;
  location: string;
  notes?: string;
  parent?: string;
  short: string;
  skills?: string[];
  src?: string;
  start: DateObj;
  tech?: string[];
  title: string;
  type: "work" | "volunteer" | "school";
  website: string;
  [prop: string]: string | string[] | DateObj | boolean | number | undefined;
}

const workExp: Job[] = [
  {
    type: WORK,
    color: indigo.A400,
    company: "Intuit",
    short: "INTU",
    location: "Mountain View, CA",
    title: "Frontend Software Engineer",
    website: "https://www.intuit.com/",
    start: dateObj("2019-06"),
    end: dateObj(),
    src: intuitLogo,
    alt: "Intuit Logo",
    expr: [
      "Working as a part of the Intuit Design Systems team to create reusable, accessible, well-tested TypeScript components that are used across many of Intuit's products.",
      "Titles:",
      "Frontend Stars - Train new engineers joining Intuit on our Frontend practices",
      "Prosperity and Career Development Lead for the Next Generation Network",
      "Intuit Emergency Response Team Member",
      "Fun & Events Committee Leader",
    ],
    tech: [REACT, JEST, ESLINT, JS, HTML, SASS, CSS],
    skills: [],
  },
  {
    type: WORK,
    color: yellow[600],
    inverted: true,
    company: "GigNow",
    parent: "Ernst & Young",
    short: "GN",
    location: "Palo Alto, CA",
    title: "Frontend Software Engineer, Global Innovation Ventures",
    website: "https://www.gignow.com/",
    start: dateObj("2018-03"),
    end: dateObj("2019-06"),
    src: gigNowLogo,
    alt: "GigNow Logo",
    expr: [
      `Help build startup ventures within EY, leveraging agile methodologies and developing primarily in ${REACT}`,
      "Add new features which helped scale the application to over double its Users, Contracts, and Countries",
      "Implement React Hot Reloading, Mixpanel Data Tracking, and stricter ESLint configuration to improve code style",
    ],
    tech: [
      REACT,
      RR,
      COMPOSE,
      MIXPANEL,
      RELOADER,
      MOMENT,
      JASMINE,
      ESLINT,
      JS,
      HTML,
      SASS,
      CSS,
    ],
    skills: [INT],
  },
  {
    type: VOLUNTEER,
    color: green[800],
    company: "Second Harvest Food Bank",
    short: "SHFB",
    location: "Santa Clara, CA",
    title: "Volunteer Team Leader",
    website: "https://www.shfb.org/",
    start: dateObj("2009-09"),
    end: dateObj("2016-10"),
    src: SHFBLogo,
    alt: "Second Harvest Food Bank Logo",
    expr: [
      "Instruct and supervise between 10 and 40 volunteers regarding food sorting, packaging and distribution",
      "Food is then distributed to smaller organizations that help the homeless and disadvantaged",
    ],
    tech: [],
    skills: ["Leadership", "Coordination"],
  },
  {
    type: WORK,
    color: lightBlue[700],
    company: "Cisco Systems",
    short: "CSCO",
    location: "San Jose, CA",
    title: "Full Stack Software Engineer III, Core Software Group",
    website:
      "https://www.cisco.com/c/en/us/solutions/enterprise-networks/dna-analytics-assurance.html",
    start: dateObj("2017-04"),
    end: dateObj("2018-03"),
    src: ciscoLogo,
    alt: "Cisco Systems Logo",
    expr: [
      "Developed web applications to process and display data on network health and analytics",
      "Created several Proof of Concept integrations with Cisco DNA-Center and several acquisitions",
      "Wrote Time Series Analysis Pipelines in JSON to create aggregations of network packets over a fixed or rolling window",
    ],
    tech: [REACT, RR, JAVA, ESLINT, JS, HTML, SASS, CSS, BS4],
    skills: [INT],
  },
  {
    type: WORK,
    color: cyan[900],
    company: "Hoverboard Technologies",
    parent: "Equalia",
    short: "HB",
    location: "Mountain View, CA",
    title: "Frontend Software Engineer",
    website: "https://www.hoverboard.com/",
    start: dateObj("2016-10"),
    end: dateObj("2017-04"),
    src: hoverboardLogo,
    alt: "Hoverboard Logo",
    expr: [
      "Developed multi-platform software tools to view riding statistics of the hoverboard stored in AWS",
      "Managed a team in India creating the Android application, and tested the app by creating realistic data simulations",
      "Programed the LED light patterns around the rim of the Hoverboard",
    ],
    tech: [ANGULAR, AWS, PYTHON2, MOMENT, JS, HTML, SASS, CSS, BS3],
    skills: [PM, INT],
  },
  {
    type: WORK,
    color: red[700],
    company: "Tesla, Inc.",
    short: "TSLA",
    location: "Fremont, CA",
    title: "Full Stack Software Engineering Master's Intern, Supply Chain Team",
    website: "https://www.tesla.com/",
    start: dateObj("2015-06-02"),
    end: dateObj("2016-06"),
    src: teslaLogo,
    alt: "Tesla Logo",
    expr: [
      "Developed web applications to track all welds on the Model X and Model 3",
      "Improve the accessibility and responsive design of existing web applications and websites",
      "Gathered requirements, and created new software tools to track weld joints on Tesla Models, improving vehicle safety",
    ],
    tech: [ANGULAR, ASP2, CSHARP, SQL, JS, HTML, SASS, CSS, BS3],
  },
  {
    type: VOLUNTEER,
    color: blueGrey[900],
    company: "Midnight Game Club",
    short: "MGC",
    location: "Sunnyvale, CA",
    title: "Frontend Software Engineer and Project Manager",
    website: "http://www.midnightgameclub.com/",
    start: dateObj("2014-08"),
    end: dateObj("2015-11"),
    notes: "(Spare Time)",
    src: vengefulLogo,
    alt: "Midnight Game Club Logo",
    expr: [
      "Developed functional HTML and CSS pages from the mockup images provided from the designers",
      "Managed a team of 3 other developers to meet requirements by the deadlines",
      "Designed improvements to the look and feel, and improve the overall experience of the game",
    ],
    tech: [JS, HTML, CSS],
    skills: [PM],
  },
  {
    type: WORK,
    color: blue[800],
    company: "NetApp",
    short: "NTAP",
    location: "Sunnyvale, CA",
    title:
      "Frontend Web Developer (Contractor), HRSolutions and Process Enablement Team",
    website: "https://www.netapp.com/us/index.aspx",
    start: dateObj("2012-08"),
    end: dateObj("2015-06"),
    src: netappLogo,
    alt: "NetApp Logo",
    expr: [
      "Developed web applications to enable various processes and managed task assignment on web projects",
      "Presented status of projects with upper management and provided solutions on how to resolve roadblocks",
      "Migrated between CMS’s, supported new WordPress Intranet, and generated graphics in Photoshop",
    ],
    tech: [ANGULAR, JS, HTML, CSS],
    skills: ["WordPress", "Adobe Creative Cloud", "Joomla", PM],
  },
  {
    type: SCHOOL,
    color: red[900],
    company: "Santa Clara University BS",
    short: "BS",
    location: "Santa Clara, CA",
    title: "Undergrad Student",
    website: "https://www.scu.edu/",
    start: dateObj("2011-09"),
    end: dateObj("2015-06"),
  },
  {
    type: SCHOOL,
    color: red[900],
    company: "SCU MS",
    short: "MS",
    location: "Santa Clara, CA",
    title: "Grad Student",
    website: "https://www.scu.edu/",
    start: dateObj("2015-09"),
    end: dateObj("2016-12"),
  },
];

const getSummary = (key: "tech" | "skills"): string[] =>
  workExp.reduce((acc: string[], job: Job): string[] => {
    const arr: string[] = (job[key] as string[]) || [];
    arr.forEach((item: string) => {
      if (!acc.includes(item)) {
        acc.push(item);
      }
    });
    return acc;
  }, []);

export const techSummary: string[] = getSummary("tech");
export const skillSummary: string[] = getSummary("skills");

export default workExp;
