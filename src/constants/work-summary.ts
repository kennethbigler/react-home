import { indigo } from "@mui/material/colors";
import intuitLogo from "../images/companies/intuit_logo.webp";

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
    "Head of Accessibility Engineering",
    "Aug 2022 - Present",
    "* Lead accessibility engineering across Intuit's product portfolio (QuickBooks, TurboTax, Mailchimp, and the Intuit Design System), combining hands-on React/TypeScript development with org-wide standards, tooling, and enablement.",
    "* Built ids-accessibility AI tooling enforcing WCAG 2.2 AA across 86+ success criteria; benchmark testing showed a ~79% drop in axe-core violations.",
    "* Built an AI platform that auto-generates Playwright + axe accessibility tests by default, and upgraded org-wide automation libraries from WCAG 2.1 to 2.2.",
    "* Delivered custom team trainings that produced lasting accessibility-defect reductions (−77% and −46% on two engineering teams), sustained for over 6 months.",
    "* Led 50+ audits and 100+ resolved tickets per year; primary technical contact for many customers.",
    '* Delivered bi-monthly internal trainings, including a "Hands On with Claude" session reached 800+ designers and PMs, and spoke at the CSUN Assistive Technology Conference, Disability:IN, and Bloomberg.',
    "",
    "Senior Software Engineer (Intuit Design System)",
    "Jul 2019 - Aug 2022",
    "* Built and scaled the Intuit Design System — the shared React/TypeScript component library and tooling used across Intuit's products — with a focus on release engineering, developer experience, and platform reliability.",
    "* Architected the IDS release pipeline and CI/CD — safe branching model, automated releases, and parallelized pipelines — and raised component test coverage by 18%.",
    "* Led Intuit's first production Module Federation plugin and the Decentralized Runtime initiative, and drove the team's Innersource readiness.",
    "* First engineer on the team to adopt TypeScript and PostCSS; led the TS-adoption initiative that cut open bugs from 40+ to under 10.",
    "* Led the component migrations, technology refreshes, and mentored new hires and QuickBooks Design System engineers; served as scrum master, reducing the backlog from hundreds of stale items to under 30.",
  ],
  tech: [REACT, TS, JS, CSS, HTML],
};
