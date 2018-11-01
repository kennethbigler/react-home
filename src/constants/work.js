// colors
import cyan from '@material-ui/core/colors/cyan';
import lightBlue from '@material-ui/core/colors/lightBlue';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
// functions
import moment from 'moment';
import reduce from 'lodash/reduce';
import includes from 'lodash/includes';
import forEach from 'lodash/forEach';
// images
import ciscoLogo from '../images/cisco_logo.gif';
import gigNowLogo from '../images/gignow.png';
import SHFBLogo from '../images/SHFB_logo.jpg';
import netappLogo from '../images/netapp_logo.svg.png';
import vengefulLogo from '../images/vengefulgames_logo.png';
import teslaLogo from '../images/tesla_motors_logo.svg.png';
import hoverboardLogo from '../images/hoverboard_logo.png';
import {// tech constants
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
} from './tech';
// Parents: Main

// skills constants
const PM = 'Project Management';
const INT = 'Managed Intern';

const workExp = [
  {
    isJob: true,
    color: blue[500],
    company: 'GigNow',
    parent: 'Ernst & Young',
    short: 'GN',
    location: 'Palo Alto, CA',
    title: 'Frontend Engineer, Global Innovation Ventures',
    website: 'https://www.gignow.com/',
    start: moment('2018-03'),
    end: moment(),
    src: gigNowLogo,
    alt: 'GigNow Logo',
    expr: [
      `Help build startup ventures within EY, leveraging agile methodologies and developing primarily in ${REACT}`,
      'Add new features which helped scale the application to over double its Users, Contracts, and Countries',
      'Implement React Hot Reloading, Mixpanel Data Tracking, and stricter ESLint configuration to improve code style',
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
    isJob: true,
    color: green[800],
    company: 'Second Harvest Food Bank',
    short: 'SHFB',
    location: 'Santa Clara, CA',
    title: 'Volunteer Team Leader',
    website: 'https://www.shfb.org/',
    start: moment('2009-09'),
    end: moment(),
    src: SHFBLogo,
    alt: 'Second Harvest Food Bank Logo',
    expr: [
      'Instruct and supervise between 10 and 40 volunteers regarding food sorting, packaging and distribution',
      'Food is then distributed to smaller organizations that help the homeless and disadvantaged',
    ],
    tech: [],
    skills: ['Leadership', 'Coordination'],
  },
  {
    isJob: true,
    color: lightBlue[700],
    company: 'Cisco Systems',
    short: 'CSCO',
    location: 'San Jose, CA',
    title: 'Software Engineer III, Core Software Group',
    website:
      'https://www.cisco.com/c/en/us/solutions/enterprise-networks/dna-analytics-assurance.html',
    start: moment('2017-04'),
    end: moment('2018-03'),
    src: ciscoLogo,
    alt: 'Cisco Systems Logo',
    expr: [
      'Developed web applications to process and display data on network health and analytics',
      'Created several Proof of Concept integrations with Cisco DNA-Center and several acquisitions',
      'Wrote Time Series Analysis Pipelines in JSON to create aggregations of network packets over a fixed or rolling window',
    ],
    tech: [REACT, RR, JAVA, ESLINT, JS, HTML, SASS, CSS, BS4],
    skills: [INT],
  },
  {
    isJob: true,
    color: cyan[900],
    company: 'Hoverboard Technologies',
    parent: 'Equalia',
    short: 'HB',
    location: 'Mountain View, CA',
    title: 'Software Engineer',
    website: 'https://www.hoverboard.com/',
    start: moment('2016-10'),
    end: moment('2017-04'),
    src: hoverboardLogo,
    alt: 'Hoverboard Logo',
    expr: [
      'Developed multi-platform software tools to view riding statistics of the hoverboard stored in AWS',
      'Managed a team in India creating the Android application, and tested the app by creating realistic data simulations',
      'Programed the LED light patterns around the rim of the Hoverboard',
    ],
    tech: [
      ANGULAR,
      AWS,
      PYTHON2,
      MOMENT,
      JS,
      HTML,
      SASS,
      CSS,
      BS3,
    ],
    skills: [PM, INT],
  },
  {
    isJob: true,
    color: red[700],
    company: 'Tesla, Inc.',
    short: 'TSLA',
    location: 'Fremont, CA',
    title: 'Application Developer Master\'s Intern, IT Applications',
    website: 'https://www.tesla.com/',
    start: moment('2015-06-02'),
    end: moment('2016-06'),
    src: teslaLogo,
    alt: 'Tesla Logo',
    expr: [
      'Developed web applications to track all welds on the Model X and Model 3',
      'Improve the accessibility and responsive design of existing web applications and websites',
      'Gathered requirements, and created new software tools to track weld joints on Tesla Models, improving vehicle safety',
    ],
    tech: [ANGULAR, ASP2, CSHARP, SQL, JS, HTML, SASS, CSS, BS3],
  },
  {
    isJob: true,
    color: blueGrey[900],
    company: 'Midnight Game Club, LLC',
    short: 'MGC',
    location: 'Sunnyvale, CA',
    title: 'Application Developer and Project Manager',
    website: 'http://www.midnightgameclub.com/',
    start: moment('2014-08'),
    end: moment('2015-11'),
    notes: '(Spare Time)',
    src: vengefulLogo,
    alt: 'Midnight Game Club Logo',
    expr: [
      'Developed functional HTML and CSS pages from the mockup images provided from the designers',
      'Managed a team of 3 other developers to meet requirements by the deadlines',
      'Designed improvements to the look and feel, and improve the overall experience of the game',
    ],
    tech: [JS, HTML, CSS],
    skills: [PM],
  },
  {
    isJob: true,
    color: blue[800],
    company: 'NetApp',
    short: 'NTAP',
    location: 'Sunnyvale, CA',
    title: 'Web Technologist Contractor, Solutions and Process Enablement',
    website: 'https://www.netapp.com/us/index.aspx',
    start: moment('2012-08'),
    end: moment('2015-06'),
    src: netappLogo,
    alt: 'NetApp Logo',
    expr: [
      'Developed web applications to enable various processes and managed task assignment on web projects',
      'Presented status of projects with upper management and provided solutions on how to resolve roadblocks',
      'Migrated between CMS’s, supported new WordPress Intranet, and generated graphics in Photoshop',
    ],
    tech: [ANGULAR, JS, HTML, CSS],
    skills: ['WordPress', 'Adobe Creative Cloud', 'Joomla', PM],
  },
  {
    isJob: false,
    color: red[900],
    company: 'Santa Clara University Bachelor\'s',
    short: 'SCU-B',
    location: 'Santa Clara, CA',
    title: 'Undergrad / Grad Student',
    website: 'https://www.scu.edu/',
    start: moment('2011-09'),
    end: moment('2015-06'),
  },
  {
    isJob: false,
    color: red[900],
    company: 'SCU Master\'s',
    short: 'SCU-M',
    location: 'Santa Clara, CA',
    title: 'Undergrad / Grad Student',
    website: 'https://www.scu.edu/',
    start: moment('2015-06'),
    end: moment('2016-12'),
  },
];

const getSummary = key => reduce(
  workExp,
  (acc, job) => {
    forEach(job[key], (item) => {
      if (!includes(acc, item)) {
        acc.push(item);
      }
    });
    return acc;
  },
  [],
);

export const techSummary = getSummary('tech');
export const skillSummary = getSummary('skills');

export default workExp;
