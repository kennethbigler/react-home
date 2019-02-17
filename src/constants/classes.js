import red from '@material-ui/core/colors/red';
import indigo from '@material-ui/core/colors/indigo';
import blue from '@material-ui/core/colors/blue';
import moment from 'moment';
import forEach from 'lodash/forEach';

const SCU = 'Santa Clara University';
const FALL = 'fall';
const WINTER = 'winter';
const SPRING = 'spring';

const getStart = (quarter, yy) => {
  switch (quarter) {
    case FALL: return moment(`20${yy}-09`);
    case WINTER: return moment(`20${yy}-01`);
    case SPRING: return moment(`20${yy}-04`);
    default: return console.warn('Error');
  }
};

const getEnd = (quarter, yy) => {
  switch (quarter) {
    case FALL: return moment(`20${yy}-12`);
    case WINTER: return moment(`20${yy}-03`);
    case SPRING: return moment(`20${yy}-07`);
    default: return console.warn('Error');
  }
};

const schools = [
  {
    color: blue[500],
    degree: 'Hackathons',
    subtitle: '',
    years: [
      {
        year: 'GigNow - Hacking the Gig Economy Now',
        quarters: [
          {
            quarter: 'GraphHoppers (2018)',
            classes: [
              {
                catalog: 'Date',
                name: 'Nov. 16, 2018',
              },
              {
                catalog: 'Prizes',
                name: '1st Place',
              },
              {
                catalog: 'Project',
                name: 'initial implementation of GraphQL to replace GigNow APIs',
              },
            ],
          },
        ],
      },
      {
        year: 'Accenture Hackathon Games',
        quarters: [
          {
            quarter: 'Feedbat (2014)',
            classes: [
              {
                catalog: 'Date',
                name: 'Oct. 18 - 19, 2014',
              },
              {
                catalog: 'Prizes',
                name: 'Best Use of the PubNub API, Best Use of the Amazon Store API',
              },
              {
                catalog: 'Project',
                name: '“feedbat”, an image-sharing web application for mobile devices to get anonymous feedback on various images (likes / dislikes / comments)',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    school: SCU,
    color: red[900],
    location: 'Santa Clara, CA',
    degree: 'Master of Science',
    major: 'Computer Engineering',
    minor: 'with an Emphasis in Software Engineering',
    graduation: 'December 2016',
    honors: 'Dean’s List: Sept. 2012 – December 2016 (Graduation)',
    gpa: 3.7,
    years: [
      {
        year: 'Year 2',
        quarters: [
          {
            quarter: 'Fall Quarter (2015)',
            start: getStart(FALL, 15),
            end: getEnd(FALL, 15),
            classes: [{ catalog: 'COEN 260', name: 'Truth, Deduction & Computation' }],
          },
          {
            quarter: 'Winter Quarter (2016)',
            start: getStart(WINTER, 16),
            end: getEnd(WINTER, 16),
            classes: [
              { catalog: 'COEN 385', name: 'Formal Methods in Software Engineering' },
              { catalog: 'COEN 296', name: 'Topics in Computer Science & Engineering - Internet of Things' },
              { catalog: 'COEN 296', name: 'Topics in Computer Science & Engineering - User Experience Research' },
            ],
          },
          {
            quarter: 'Spring Quarter (2016)',
            start: getStart(SPRING, 16),
            end: getEnd(SPRING, 16),
            classes: [
              { catalog: 'COEN 252', name: 'Computer Forensics' },
              { catalog: 'COEN 252L', name: 'Computer Forensics Lab' },
              { catalog: 'COEN 331', name: 'Wireless & Mobile Networks' },
            ],
          },
          {
            quarter: 'Fall Quarter (2016)',
            start: getStart(FALL, 16),
            end: getEnd(FALL, 16),
            classes: [{ catalog: 'COEN 317', name: 'Distributed Computing' }],
          },
        ],
      },
      {
        year: 'Year 1 (Senior Year)',
        quarters: [
          {
            quarter: 'Fall Quarter (2014)',
            start: getStart(FALL, 14),
            end: getEnd(FALL, 14),
            classes: [
              { catalog: 'COEN 272', name: 'Web Search & Info Retrieval' },
              { catalog: 'COEN 288', name: 'Software Ethics' },
            ],
          },
          {
            quarter: 'Winter Quarter (2015)',
            start: getStart(WINTER, 15),
            end: getEnd(WINTER, 15),
            classes: [
              { catalog: 'COEN 287', name: 'Software Development Process Management' },
              { catalog: 'COEN 275', name: 'Object Oriented Analysis and Design Programming' },
              { catalog: 'COEN 286', name: 'Software Quality Assurance and Testing' },
            ],
          },
          {
            quarter: 'Spring Quarter (2015)',
            start: getStart(SPRING, 15),
            end: getEnd(SPRING, 15),
            classes: [
              { catalog: 'COEN 386', name: 'Software Architecture' },
              { catalog: 'COEN 278', name: 'Web Programming II' },
            ],
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
    honors: 'Dean’s List: Sept. 2012 – December 2016 (Graduation)',
    gpa: 3.7,
    years: [
      {
        year: 'Senior Year',
        quarters: [
          {
            quarter: 'Fall Quarter (2014)',
            start: getStart(FALL, 14),
            end: getEnd(FALL, 14),
            classes: [
              { catalog: 'COEN 272', name: 'Web Search & Info Retrieval' },
              { catalog: 'COEN 288', name: 'Software Ethics' },
              { catalog: 'COEN 174+L', name: 'Software Engineering' },
              { catalog: 'COEN 194', name: 'Design Project I' },
              { catalog: 'TESP 124', name: 'Theology of Marriage' },
              { catalog: 'ENGL 181', name: 'Applied Engineering Communications I' },
            ],
          },
          {
            quarter: 'Winter Quarter (2015)',
            start: getStart(WINTER, 15),
            end: getEnd(WINTER, 15),
            classes: [
              { catalog: 'COEN 287', name: 'Software Development Process Management' },
              { catalog: 'COEN 275', name: 'Object Oriented Analysis and Design Programming' },
              { catalog: 'COEN 286', name: 'Software Quality Assurance and Testing' },
              { catalog: 'COEN 175+L', name: 'Formal Language Theory and Compiler Construction' },
              { catalog: 'COEN 195', name: 'Design Project II' },
              { catalog: 'ENGL 182A', name: 'Applied Engineering Communications IIA' },
              { catalog: 'ENGR 170', name: 'Improv for Engineers' },
            ],
          },
          {
            quarter: 'Spring Quarter (2015)',
            start: getStart(SPRING, 15),
            end: getEnd(SPRING, 15),
            classes: [
              { catalog: 'COEN 386', name: 'Software Architecture' },
              { catalog: 'COEN 278', name: 'Web Programming II' },
              { catalog: 'COEN 122+L', name: 'Computer Architecture' },
              { catalog: 'COEN 196', name: 'Design Project III' },
              { catalog: 'ENGL 182B', name: 'Applied Engineering Communications IIB' },
            ],
          },
        ],
      },
      {
        year: 'Junior Year',
        quarters: [
          {
            quarter: 'Fall Quarter (2013)',
            start: getStart(FALL, 13),
            end: getEnd(FALL, 13),
            classes: [
              { catalog: 'COEN 161+L', name: 'Web Programming I' },
              { catalog: 'COEN 177+L', name: 'Operating Systems' },
              { catalog: 'MATH 103', name: 'Advanced Linear Algebra' },
              { catalog: 'RSOC 51', name: 'Religion in America' },
            ],
          },
          {
            quarter: 'Winter Quarter (2014)',
            start: getStart(WINTER, 14),
            end: getEnd(WINTER, 14),
            classes: [
              { catalog: 'COEN 168', name: 'Mobile Application Development - Android' },
              { catalog: 'COEN 146+L', name: 'Computer Networks' },
              { catalog: 'COEN 171', name: 'Prin Des & Impl Prog Lang' },
              { catalog: 'SOCI 165', name: 'Human Services' },
            ],
          },
          {
            quarter: 'Spring Quarter (2014)',
            start: getStart(SPRING, 14),
            end: getEnd(SPRING, 14),
            classes: [
              { catalog: 'COEN 165', name: 'Intro: 3D Animation & Modeling' },
              { catalog: 'COEN 179', name: 'Theory of Algorithms' },
              { catalog: 'ELEN 153+L', name: 'Digital Integrated Circuit Design' },
              { catalog: 'MATH 176', name: 'Combinatorics' },
            ],
          },
        ],
      },
      {
        year: 'Sophomore Year',
        quarters: [
          {
            quarter: 'Fall Quarter (2012)',
            start: getStart(FALL, 12),
            end: getEnd(FALL, 12),
            classes: [
              { catalog: 'COEN 21+L', name: 'Introduction to Logic Design' },
              { catalog: 'PHYS 33+L', name: 'Physics for Scientists and Engineers III' },
              { catalog: 'RSOC 9', name: 'Ways of Understanding Religion' },
              { catalog: 'MUSC 11A', name: 'Cultures and Ideas I - Global Music/Cultural Politics' },
            ],
          },
          {
            quarter: 'Winter Quarter (2013)',
            start: getStart(WINTER, 13),
            end: getEnd(WINTER, 13),
            classes: [
              { catalog: 'COEN 70+L', name: 'Form Specification & Advanced Data Structures' },
              { catalog: 'MATH 53', name: 'Linear Algebra' },
              { catalog: 'MUSC 134', name: 'Pop Music, Race, & American Culture' },
              { catalog: 'MUSC 12A', name: 'Cultures and Ideas II - Global Music/Cultural Politics' },
            ],
          },
          {
            quarter: 'Spring Quarter (2013)',
            start: getStart(SPRING, 13),
            end: getEnd(SPRING, 13),
            classes: [
              { catalog: 'COEN 20+L', name: 'Intro to Embedded Systems' },
              { catalog: 'ELEN 50+L', name: 'Electric Circuits I' },
              { catalog: 'ENGR 19', name: 'Ethics in Technology' },
              { catalog: 'POLI 2', name: 'Intro to Comparative Politics' },
            ],
          },
        ],
      },
      {
        year: 'Freshman Year',
        quarters: [
          {
            quarter: 'Fall Quarter (2011)',
            start: getStart(FALL, 11),
            end: getEnd(FALL, 11),
            classes: [
              { catalog: 'COEN 10+L', name: 'Introduction to Programming' },
              { catalog: 'ENGR 1', name: 'Intro to Engineering' },
              { catalog: 'MATH 14', name: 'Calculus & Analytic Geometry IV' },
              { catalog: 'CHEM 11+L', name: 'General Chemistry I' },
              { catalog: 'ENGL 1A', name: 'Critical Thinking & Writing I - Cosmology & Controversy' },
            ],
          },
          {
            quarter: 'Winter Quarter (2012)',
            start: getStart(WINTER, 12),
            end: getEnd(WINTER, 12),
            classes: [
              { catalog: 'COEN 11+L', name: 'Advanced Programming' },
              { catalog: 'AMTH 106', name: 'Differential Equations' },
              { catalog: 'PHYS 31', name: 'Physics for Scientists and Engineers I' },
              { catalog: 'ENGL 2A', name: 'Critical Thinking & Writing II - Cosmology & Controversy' },
            ],
          },
          {
            quarter: 'Spring Quarter (2012)',
            start: getStart(SPRING, 12),
            end: getEnd(SPRING, 12),
            classes: [
              { catalog: 'COEN 12+L', name: 'Abstract Data Types & Data Structures' },
              { catalog: 'COEN 19', name: 'Discrete Mathematics' },
              { catalog: 'AMTH 108', name: 'Probability & Statistics' },
              { catalog: 'PHYS 32+L', name: 'Physics for Scientists and Engineers II' },
            ],
          },
        ],
      },
    ],
  },
  {
    degree: 'Extracurriculars',
    subtitle: '',
    years: [
      {
        year: 'Honors Societies',
        quarters: [
          {
            quarter: 'Tau Beta Pi',
            classes: [
              { name: 'The Engineering Honors Society' },
              { name: 'November 2014 - Present' },
            ],
          },
          {
            quarter: 'Upsilon Pi Epsilon',
            classes: [
              { name: 'Computing and Information Honor Society' },
              { name: 'May 2015 - Present' },
            ],
          },
          {
            quarter: 'Order of the Engineer',
            classes: [{ name: 'May 2015 - Present' }],
          },
          {
            quarter: 'Dean’s List',
            classes: [
              { name: 'top 10% of GPAs' },
              { name: 'September 2012 – December 2016 (Graduation)' },
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
              { name: 'Coach and Choreographer 2016 - 2017' },
              { name: 'September 2014 - May 2017' },
            ],
          },
          {
            quarter: 'Association for Computing Machinery',
            classes: [
              { name: 'Vice President 2012-2013' },
              { name: 'September 2011 - December 2016' },
            ],
          },
          {
            quarter: 'Coders Club',
            classes: [{ name: 'April 2012 - June 2013' }],
          },
          {
            quarter: 'Solar Decathlon 2013 Competition',
            classes: [
              { name: 'Control Systems Team' },
              { name: 'March 2012 - June 2013' },
            ],
          },
          {
            quarter: 'Intramural Soccer and Volleyball',
            classes: [
              { name: 'Team Captain 2014 - 2016' },
              { name: 'January 2012 - June 2016' },
            ],
          },
        ],
      },
      {
        year: 'Activities and Interests',
        quarters: [
          {
            quarter: '',
            classes: [
              { name: 'Cars' },
              { name: 'Piano' },
              { name: 'Hiking' },
              { name: 'Programming' },
              { name: 'Salsa Dancing' },
              { name: 'International Travel' },
              { name: 'Video Games (DOTA 2)' },
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
        year: 'Stanford Continuing Studies',
        quarters: [
          {
            quarter: 'Summer (2017)',
            classes: [
              {
                catalog: 'WSP 314',
                name: 'Alfred Hitchcock and the Subversive World of Film Noir',
              },
            ],
          },
        ],
      },
      {
        year: 'Undergrad High School Summer Visitor',
        quarters: [
          {
            quarter: 'Summer (2010)',
            classes: [
              {
                catalog: 'PHYS 50',
                name: 'Astronomy Laboratory and Observational Astronomy',
              },
              {
                catalog: 'POL 1Z',
                name: 'Introduction to International Relations',
              },
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
        year: 'Senior Year',
        quarters: [
          {
            quarter: 'Fall Semester (2010)',
            classes: [
              { name: 'AP Calculus BC' },
              { name: 'Anatomy & Physiology' },
              { name: 'Government & Politics Honors' },
              { name: 'English 12 - British Literature & Composition' },
              { name: 'French 5 - Language & Culture' },
              { name: 'Bible 12 - Comparative Religions' },
              { name: 'Film Studies' },
            ],
          },
          {
            quarter: 'Spring Semester (2011)',
            classes: [
              { name: 'AP Calculus BC' },
              { name: 'Anatomy & Physiology' },
              { name: 'Economics Honors' },
              { name: 'English 12 - British Literature & Composition' },
              { name: 'French 5 - Language & Culture' },
              { name: 'Bible 12 - Apologetics: Defending Your Faith' },
              { name: 'Film Studies' },
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
              { name: 'Calculus' },
              { name: 'Physics Honors' },
              { name: 'AP US History' },
              { name: 'English 11 Honors - American Literature & Composition' },
              { name: 'French 4 - Language & Culture' },
              { name: 'Bible 11 - Biblical Worldviews' },
              { name: 'Study Hall' },
            ],
          },
          {
            quarter: 'Spring Semester (2010)',
            classes: [
              { name: 'Calculus' },
              { name: 'Physics Honors' },
              { name: 'AP US History' },
              { name: 'English 11 Honors - American Literature & Composition' },
              { name: 'French 4 - Language & Culture' },
              { name: 'Bible 11 - Biblical Worldviews' },
              { name: 'Study Hall' },
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
              { name: 'Pre-Calculus Honors' },
              { name: 'Chemistry' },
              { name: 'World History & Geography Honors' },
              { name: 'English 10 Honors - World Literature & Composition' },
              { name: 'French 3' },
              { name: 'Physical Education' },
              { name: 'Study Hall' },
            ],
          },
          {
            quarter: 'Spring Semester (2009)',
            classes: [
              { name: 'Pre-Calculus Honors' },
              { name: 'Chemistry' },
              { name: 'World History & Geography Honors' },
              { name: 'English 10 Honors - World Literature & Composition' },
              { name: 'French 3' },
              { name: 'Physical Education' },
              { name: 'Bible 10 - The Christian Life' },
            ],
          },
        ],
      },
      {
        year: 'Freshman Year',
        quarters: [
          {
            quarter: 'Fall Semester (2007)',
            classes: [
              { name: 'Algebra 2 Honors' },
              { name: 'Biology Honors' },
              { name: 'English 9 Honors - Literature & Composition' },
              { name: 'French 2' },
              { name: 'Bible 9 - The Christian Life' },
              { name: 'Physical Education' },
              { name: 'Broadcasting' },
            ],
          },
          {
            quarter: 'Spring Semester (2008)',
            classes: [
              { name: 'Algebra 2 Honors' },
              { name: 'Biology Honors' },
              { name: 'English 9 Honors - Literature & Composition' },
              { name: 'French 2' },
              { name: 'Art Ceramics' },
              { name: 'Physical Education' },
              { name: 'Broadcasting' },
            ],
          },
        ],
      },
    ],
  },
];

const timeline = [];

forEach(schools, (school) => {
  forEach(school.years, (year) => {
    forEach(year.quarters, (quarter) => {
      forEach(quarter.classes, (course) => {
        quarter.start && timeline.push({
          start: quarter.start,
          end: quarter.end,
          title: course,
          color: red[900],
          course: course.catalog,
        });
      });
    });
  });
});

export const classTimeline = timeline.sort((a, b) => a.start.diff(b.start, 'months'));
export default schools;
