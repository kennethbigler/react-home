import { indigo } from "@mui/material/colors";
import intuitLogo from "../images/companies/intuit_logo.png";

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

export const currentJob: Job = {
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
};
