import hoverboardLogo from '../images/hoverboard_logo.png';
import teslaLogo from '../images/tesla_motors_logo.svg.png';
import vengefulLogo from '../images/vengefulgames_logo.png';
import netappLogo from '../images/netapp_logo.svg.png';
import SHFBLogo from '../images/SHFB_logo.jpg';
import ciscoLogo from '../images/cisco_logo.gif';
import moment from 'moment';

export default [
  {
    isJob: true,
    company: 'Cisco Systems',
    location: 'San Jose, CA',
    title: 'Software Engineer III',
    start: moment('2017-04-01'),
    end: moment(),
    src: ciscoLogo,
    alt: 'Cisco Systems Logo',
    expr: [
      'Front End Development using ReactJS, HTML, and CSS to process and display data from REST API\'s about network health',
      'Write Time Series Analysis Pipelines to create aggregations of network packets over a fixed or rolling window'
    ]
  },
  {
    isJob: true,
    company: 'Second Harvest Food Bank',
    location: 'Santa Clara, CA',
    title: 'Volunteer Team Leader',
    start: moment('2010-09-01'),
    end: moment(),
    src: SHFBLogo,
    alt: 'Second Harvest Food Bank Logo',
    expr: [
      'Instruct and supervise between 10 and 40 volunteers regarding food sorting, packaging and distribution',
      'Food is then distributed to smaller organizations that help the homeless and disadvantaged'
    ]
  },
  {
    isJob: true,
    company: 'Hoverboard Technologies',
    location: 'Mountain View, CA',
    title: 'Software Engineer',
    start: moment('2016-10-01'),
    end: moment('2017-04-01'),
    src: hoverboardLogo,
    alt: 'Hoverboard Logo',
    expr: [
      'Develop web applications using AngularJS, Bootstrap, and AWS SDK for JavaScript in the Browser',
      'Manage the team in India creating the Android application through testing and creating Hoverboard Simulators',
      'Program applications to run the lights on the Hoverboard using Python syntax'
    ]
  },
  {
    isJob: true,
    company: 'Tesla, Inc.',
    location: 'Fremont, CA',
    title: 'Application Developer Intern, IT Applications',
    start: moment('2015-06-01'),
    end: moment('2016-06-30'),
    src: teslaLogo,
    alt: 'Tesla Logo',
    expr: [
      'Develop web applications using AngularJS and ASP.NET MVC with a SQL database',
      'Gather requirements, create new software tools, and improve tools already used by various departments',
      'Redesign intranet pages to improve accessibility and incorporate responsive design elements'
    ]
  },
  {
    isJob: true,
    company: 'Midnight Game Club, LLC',
    location: 'Sunnyvale, CA',
    title: 'Project Manager and Application Developer',
    start: moment('2014-08-01'),
    end: moment('2015-11-30'),
    notes: '(Spare Time)',
    src: vengefulLogo,
    alt: 'Midnight Game Club Logo',
    expr: [
      'Manage a team of 3 other developers to meet requirements by the deadlines',
      'Create functional HTML and CSS pages from the mockup images provided from the designers',
      'Design Improvements to the look and feel, and improve the overall experience of the game'
    ]
  },
  {
    isJob: true,
    company: 'NetApp',
    location: 'Sunnyvale, CA',
    title: 'Web Technologist, Solutions and Process Enablement',
    start: moment('2012-08-01'),
    end: moment('2015-06-01'),
    src: netappLogo,
    alt: 'NetApp Logo',
    expr: [
      'Develop web-based applications to enable various processes, as well as train users',
      'Communicate status of projects with upper management and how to resolve roadblocks',
      'Support HR Intranet using WordPress; updating code, creating graphics and managing web projects',
      'Design and create new websites, migrate between CMS’s, as well as maintain and improve existing websites',
      'Create/update graphics using Adobe CS, resolve technical issues, educate department content owners on their choices'
    ]
  },
  {
    isJob: false,
    company: 'Santa Clara University',
    location: 'Santa Clara, CA',
    title: 'Undergrad / Grad Student',
    start: moment('2011-09-01'),
    end: moment('2016-12-31')
  }
];
