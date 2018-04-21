import hoverboardLogo from '../images/hoverboard_logo.png';
import teslaLogo from '../images/tesla_motors_logo.svg.png';
import vengefulLogo from '../images/vengefulgames_logo.png';
import netappLogo from '../images/netapp_logo.svg.png';
import SHFBLogo from '../images/SHFB_logo.jpg';
import eyLogo from '../images/ey_logo.png';
import ciscoLogo from '../images/cisco_logo.gif';
import * as colors from 'material-ui/styles/colors';
import moment from 'moment';
// Parents: Main
const REACT = 'React.js';
const REACT15 = 'React.js 15.6';
const REACT16 = 'React.js 16.3';
const ANGULAR = 'Angular.js 1.X';
const ES2015 = 'ECMAScript 2015';
const ES2016 = 'ECMAScript 2016';
const HTML = 'HTML5';
const CSS = 'CSS3';
const JS = 'JavaScript';
const BS3 = 'Bootstrap 3';
const BS4 = 'Bootstrap 4';
const RR4 = 'React Router 4';

const workExp = [
  {
    isJob: true,
    color: colors.yellowA700,
    company: 'GigNow',
    parent: 'Ernst & Young',
    short: 'GN',
    location: 'Palo Alto, CA',
    title: 'Frontend Engineer, Global Innovation Group',
    website: 'https://www.gignow.com/',
    start: moment('2018-03'),
    end: moment(),
    src: eyLogo,
    alt: 'Ernst & Young Logo',
    expr: [
      `Help build startup ventures within EY, leveraging agile methodologies and development primarily in ${REACT}`
    ],
    tech: [REACT16, RR4, ES2016, JS, HTML, CSS]
  },
  {
    isJob: true,
    color: colors.green800,
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
      'Food is then distributed to smaller organizations that help the homeless and disadvantaged'
    ],
    tech: ['Leadership', 'Coordination']
  },
  {
    isJob: true,
    color: colors.blue600,
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
      `Processed and displayed data about network health using Java REST APIs and ${REACT}`,
      'Created several Proof of Concept integrations with Cisco DNA-Center and several acquisitions',
      'Wrote Time Series Analysis Pipelines in JSON to create aggregations of network packets over a fixed or rolling window'
    ],
    tech: [REACT15, RR4, ES2015, JS, 'Java 8', BS4, HTML, CSS]
  },
  {
    isJob: true,
    color: colors.blueGrey500,
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
      `Developed web applications using ${ANGULAR} and the AWS SDK for JavaScript in the Browser`,
      'Tested the Android App by creating realistic data simulators, and managed the team in India doing development',
      'Programed applications to run the lights on the Hoverboard in a Python-like language'
    ],
    tech: [
      ANGULAR,
      'AWS SDK for JavaScript in the Browser',
      JS,
      'Python 2',
      BS3,
      HTML,
      CSS
    ]
  },
  {
    isJob: true,
    color: colors.red500,
    company: 'Tesla, Inc.',
    short: 'TSLA',
    location: 'Fremont, CA',
    title: 'Application Developer Intern, IT Applications',
    website: 'https://www.tesla.com/',
    start: moment('2015-06'),
    end: moment('2016-06'),
    src: teslaLogo,
    alt: 'Tesla Logo',
    expr: [
      `Developed web applications using ${ANGULAR} and ASP.NET MVC with a SQL database`,
      'Gathered requirements, created new software tools, and improved tools already used by various departments',
      'Redesigned intranet pages to improve accessibility and incorporate responsive design elements'
    ],
    tech: [ANGULAR, JS, 'ASP.NET 2.0 MVC', 'C#', 'SQL', BS3, HTML, CSS]
  },
  {
    isJob: true,
    color: colors.blueGrey900,
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
      'Managed a team of 3 other developers to meet requirements by the deadlines',
      'Converted mockup images from the designers into functional HTML and CSS pages',
      'Designed improvements to the look and feel, and improve the overall experience of the game'
    ],
    tech: ['Project Management', JS, HTML, CSS]
  },
  {
    isJob: true,
    color: colors.indigo500,
    company: 'NetApp',
    short: 'NTAP',
    location: 'Sunnyvale, CA',
    title: 'Web Technologist, Solutions and Process Enablement',
    website: 'https://www.netapp.com/us/index.aspx',
    start: moment('2012-08'),
    end: moment('2015-06'),
    src: netappLogo,
    alt: 'NetApp Logo',
    expr: [
      `Developed web-based applications using ${ANGULAR} to enable various processes and train users`,
      'Communicated status of projects with upper management and how to resolve roadblocks',
      'Supported HR Intranet using WordPress; updated code, created graphics, and managed web projects',
      'Designed and created new websites, migrated between CMS’s, and maintained existing websites',
      'Created graphics using Adobe Creative Cloud'
    ],
    tech: [
      'WordPress',
      'Adobe Creative Cloud',
      ANGULAR,
      JS,
      'Joomla',
      HTML,
      CSS
    ]
  },
  {
    isJob: false,
    color: colors.red800,
    company: 'Santa Clara University',
    short: 'SCU',
    location: 'Santa Clara, CA',
    title: 'Undergrad / Grad Student',
    website: 'https://www.scu.edu/',
    start: moment('2011-09'),
    end: moment('2016-12')
  }
];

export const techSummary = workExp
  .reduce((acc, job) => {
    if (job.tech) {
      for (const tech of job.tech) {
        if (acc.indexOf(tech) === -1) {
          acc.push(tech);
        }
      }
    }
    return acc;
  }, [])
  .sort();

export default workExp;
