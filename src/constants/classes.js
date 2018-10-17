import red from '@material-ui/core/colors/red';
import indigo from '@material-ui/core/colors/indigo';
import moment from 'moment';
import map from 'lodash/map';
import forEach from 'lodash/forEach';

const SCU = 'Santa Clara University';

const schools = [
  {
    school: SCU,
    color: red[900],
    location: 'Santa Clara, CA',
    degree: 'Master of Science',
    major: 'Computer Engineering',
    minor: 'with an Emphasis in Software Engineering',
    graduation: 'December 2016',
    gpa: 3.7,
    years: [
      {
        year: 'Year 1 (Senior Year)',
        quarters: [
          {
            quarter: 'Fall Quarter (2014)',
            start: moment('2014-09'),
            end: moment('2014-12'),
            classes: ['Web Search & Info Retrieval', 'Software Ethics'],
          },
          {
            quarter: 'Winter Quarter (2015)',
            start: moment('2015-01'),
            end: moment('2015-04'),
            classes: [
              'Software Development Process Management',
              'Object Oriented Analysis and Design Programming',
              'Software Quality Assurance and Testing',
            ],
          },
          {
            quarter: 'Spring Quarter (2015)',
            start: moment('2015-04'),
            end: moment('2015-07'),
            classes: ['Software Architecture', 'Web Programming II'],
          },
        ],
      },
      {
        year: 'Year 2',
        quarters: [
          {
            quarter: 'Fall Quarter (2015)',
            classes: ['Truth, Deduction & Computation'],
          },
          {
            quarter: 'Winter Quarter (2016)',
            classes: [
              'Formal Methods in Software Engineering',
              'Internet of Things',
              'User Experience Research',
            ],
          },
          {
            quarter: 'Spring Quarter (2016)',
            classes: [
              'Computer Forensics',
              'Computer Forensics Lab',
              'Wireless & Mobile Networks',
            ],
          },
          {
            quarter: 'Fall Quarter (2016)',
            classes: ['Distributed Systems'],
          },
        ],
      },
    ],
  },
  {
    school: SCU,
    color: red[900],
    location: 'Santa Clara, CA',
    degree: 'Bachelor of Science',
    major: 'Computer Science & Engineering',
    minor: 'with a Minor in Mathematics',
    graduation: 'June 2015',
    honors: 'Dean’s List: Sept. 2012 – Graduation',
    gpa: 3.7,
    years: [
      {
        year: 'Freshman Year',
        quarters: [
          {
            quarter: 'Fall Quarter (2011)',
            classes: [
              'Introduction to Programming',
              'Intro to Engineering',
              'Calculus & Analytic Geometry IV',
              'General Chemistry I',
              'Cosmology & Controversy (Critical Thinking & Writing I)',
            ],
          },
          {
            quarter: 'Winter Quarter (2012)',
            classes: [
              'Advanced Programming',
              'Differential Equations',
              'Physics for Scientists and Engineers I',
              'Cosmology & Controversy (Critical Thinking & Writing II)',
            ],
          },
          {
            quarter: 'Spring Quarter (2012)',
            classes: [
              'Abstract Data Types & Data Structures',
              'Discrete Mathematics',
              'Probability & Statistics',
              'Physics for Scientists and Engineers II',
            ],
          },
        ],
      },
      {
        year: 'Sophomore Year',
        quarters: [
          {
            quarter: 'Fall Quarter (2012)',
            classes: [
              'Introduction to Logic Design',
              'Physics for Scientists and Engineers III',
              'Ways of Understanding Religion',
              'Global Music/Cultural Politics (Cultures and Ideas I)',
            ],
          },
          {
            quarter: 'Winter Quarter (2013)',
            classes: [
              'Form Specification & Advanced Data Structures',
              'Linear Algebra',
              'Pop Music, Race, & American Culture',
              'Global Music/Cultural Politics (Cultures and Ideas II)',
            ],
          },
          {
            quarter: 'Spring Quarter (2013)',
            classes: [
              'Intro to Embedded Systems',
              'Electric Circuits I',
              'Ethics in Technology',
              'Intro to Comparative Politics',
            ],
          },
        ],
      },
      {
        year: 'Junior Year',
        quarters: [
          {
            quarter: 'Fall Quarter (2013)',
            classes: [
              'Web Programming I',
              'Operating Systems',
              'Advanced Linear Algebra',
              'Religion in America',
            ],
          },
          {
            quarter: 'Winter Quarter (2014)',
            classes: [
              'Mobile Application Development (Android)',
              'Computer Networks',
              'Prin Des & Impl Prog Lang',
              'Human Services',
            ],
          },
          {
            quarter: 'Spring Quarter (2014)',
            classes: [
              'Intro: 3D Animation & Modeling',
              'Theory of Algorithms',
              'Digital Integrated Circuit Design',
              'Combinatorics',
            ],
          },
        ],
      },
      {
        year: 'Senior Year',
        quarters: [
          {
            quarter: 'Fall Quarter (2014)',
            classes: [
              'Web Search & Info Retrieval',
              'Software Ethics',
              'Software Engineering',
              'Theology of Marriage',
              'Design Project I',
              'Applied Engineering Communications I',
            ],
          },
          {
            quarter: 'Winter Quarter (2015)',
            classes: [
              'Software Development Process Management',
              'Object Oriented Analysis and Design Programming',
              'Software Quality Assurance and Testing',
              'Formal Language Theory and Compiler Construction',
              'Design Project II',
              'Applied Engineering Communications II',
            ],
          },
          {
            quarter: 'Spring Quarter (2015)',
            classes: [
              'Software Architecture',
              'Web Programming II',
              'Computer Architecture',
              'Design Project III',
              'Applied Engineering Communications III',
            ],
          },
        ],
      },
    ],
  },
  {
    school: 'Stanford University',
    color: red[500],
    location: 'Stanford, CA',
    degree:
      'Stanford Continuing Studies & Undergrad High School Summer Visitor',
    gpa: 3.8,
    years: [
      {
        year: 'Undergrad High School Summer Visitor',
        quarters: [
          {
            quarter: 'Summer (2010)',
            classes: [
              'PHYS 50: Astronomy Laboratory and Observational Astronomy',
              'POL 1Z: Introduction to International Relations',
            ],
          },
        ],
      },
      {
        year: 'Stanford Continuing Studies',
        quarters: [
          {
            quarter: 'Summer (2017)',
            classes: [
              'WSP 314: Alfred Hitchcock and the Subversive World of Film Noir',
            ],
          },
        ],
      },
    ],
  },
  {
    degree: 'Activities',
    subtitle: 'Extracurriculars',
    years: [
      {
        year: 'Hackathons',
        quarters: [
          {
            quarter: 'Accenture Hackathon Games',
            classes: [
              'Date: Oct. 18-19, 2014',
              'Prizes: Best Use of the PubNub API, Best Use of the Amazon Store API',
              'Project: “feedbat”, an image-sharing web application for mobile devices to get anonymous feedback on various images (likes / dislikes / comments)',
            ],
          },
        ],
      },
      {
        year: 'Honors Societies',
        quarters: [
          {
            quarter: 'Tau Beta Pi',
            classes: [
              'The Engineering Honors Society',
              'November 2014 - Present',
            ],
          },
          {
            quarter: 'Upsilon Pi Epsilon',
            classes: [
              'Computing and Information Honor Society',
              'May 2015 - Present',
            ],
          },
          {
            quarter: 'Order of the Engineer',
            classes: ['May 2015 - Present'],
          },
          {
            quarter: 'Dean’s List',
            classes: [
              'top 10% of GPAs',
              'September 2012 – Graduation (December 2016)',
            ],
          },
        ],
      },
      {
        year: 'Clubs and Activities',
        quarters: [
          {
            quarter: 'Salsa Clara',
            classes: [
              'Coach and Choreographer 2016 - 2017',
              'September 2014 - May 2017',
            ],
          },
          {
            quarter: 'Association for Computing Machinery',
            classes: [
              'Vice President 2012-2013',
              'September 2011 - December 2016',
            ],
          },
          {
            quarter: 'Coders Club',
            classes: ['April 2012 - June 2013'],
          },
          {
            quarter: 'Solar Decathlon 2013 Competition',
            classes: ['Control Systems Team', 'March 2012 - June 2013'],
          },
          {
            quarter: 'Intramural Soccer and Volleyball',
            classes: ['Team Captain 2014 - 2016', 'January 2012 - June 2016'],
          },
        ],
      },
      {
        year: 'Activities and Interests',
        quarters: [
          {
            quarter: '',
            classes: [
              'Cars',
              'Piano',
              'Hiking',
              'Programming',
              'Salsa Dancing',
              'International Travel',
              'Video Games (DOTA 2)',
            ],
          },
        ],
      },
    ],
  },
  {
    school: "The King's Academy",
    color: indigo[500],
    location: 'Sunnyvale, CA',
    degree: 'High School Diploma',
    graduation: 'June 2011',
    honors:
      'National Honors Society, California Scholarship Federation, Principal’s Honor Roll',
    gpa: 4.16,
    years: [
      {
        year: 'Freshman Year',
        quarters: [
          {
            quarter: 'Fall Semester (2007)',
            classes: [
              'Algebra 2 Honors',
              'Biology Honors',
              'English 9 Honors - Literature & Composition',
              'French 2',
              'Bible 9 - The Christian Life',
              'Physical Education',
              'Broadcasting',
            ],
          },
          {
            quarter: 'Spring Semester (2008)',
            classes: [
              'Algebra 2 Honors',
              'Biology Honors',
              'English 9 Honors - Literature & Composition',
              'French 2',
              'Art Ceramics',
              'Physical Education',
              'Broadcasting',
            ],
          },
        ],
      },
      {
        year: 'Sophomore Year',
        quarters: [
          {
            quarter: 'Fall Semester (2008)',
            classes: [
              'Pre-Calculus Honors',
              'Chemistry',
              'World History & Geography Honors',
              'English 10 Honors - World Literature & Composition',
              'French 3',
              'Physical Education',
              'Study Hall',
            ],
          },
          {
            quarter: 'Spring Semester (2009)',
            classes: [
              'Pre-Calculus Honors',
              'Chemistry',
              'World History & Geography Honors',
              'English 10 Honors - World Literature & Composition',
              'French 3',
              'Physical Education',
              'Bible 10 - The Christian Life',
            ],
          },
        ],
      },
      {
        year: 'Junior Year',
        quarters: [
          {
            quarter: 'Fall Semester (2009)',
            classes: [
              'Calculus',
              'Physics Honors',
              'AP US History',
              'English 11 Honors - American Literature & Composition',
              'French 4 - Language & Culture',
              'Bible 11 - Biblical Worldviews',
              'Study Hall',
            ],
          },
          {
            quarter: 'Spring Semester (2010)',
            classes: [
              'Calculus',
              'Physics Honors',
              'AP US History',
              'English 11 Honors - American Literature & Composition',
              'French 4 - Language & Culture',
              'Bible 11 - Biblical Worldviews',
              'Study Hall',
            ],
          },
        ],
      },
      {
        year: 'Senior Year',
        quarters: [
          {
            quarter: 'Fall Semester (2010)',
            classes: [
              'AP Calculus BC',
              'Anatomy & Physiology',
              'Government & Politics Honors',
              'English 12 - British Literature & Composition',
              'French 5 - Language & Culture',
              'Bible 12 - Comparative Religions',
              'Film Studies',
            ],
          },
          {
            quarter: 'Spring Semester (2011)',
            classes: [
              'AP Calculus BC',
              'Anatomy & Physiology',
              'Economics Honors',
              'English 12 - British Literature & Composition',
              'French 5 - Language & Culture',
              'Bible 12 - Apologetics: Defending Your Faith',
              'Film Studies',
            ],
          },
        ],
      },
    ],
  },
];

const timeline = [];

forEach(
  schools[0].years,
  (year) => {
    forEach(year.quarters, (quarter) => {
      forEach(quarter.classes, (course) => {
        quarter.start && timeline.push({
          start: quarter.start,
          end: quarter.end,
          title: course,
          color: red[900],
          course,
        });
      });
    });
  },
);

export const classTimeline = timeline.sort((a, b) => a.start.diff(b.start, 'months'));
export default schools;
