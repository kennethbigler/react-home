export interface SummarySchool {
  degree: string;
  honors?: string;
  location: string;
  major?: string;
  minor?: string;
  school: string;
  years: [];
}

export const scuMasters: SummarySchool = {
  school: "Santa Clara University",
  location: "Santa Clara, CA",
  degree: "Master of Science",
  major: "Computer Engineering",
  minor: "Emphasis in Software Engineering",
  honors: "Tau Beta Pi, Upsilon Pi Epsilon, Dean’s List",
  years: [],
};

export const scuBachelors: SummarySchool = {
  school: "Santa Clara University",
  location: "Santa Clara, CA",
  degree: "Bachelor of Science",
  major: "Computer Science & Engineering",
  minor: "Minor in Mathematics",
  honors: "Tau Beta Pi, Upsilon Pi Epsilon, Dean’s List",
  years: [],
};

export const stanford: SummarySchool = {
  school: "Stanford University",
  location: "Stanford, CA",
  degree: "Stanford Continuing Studies & Undergrad High School Summer Visitor",
  years: [],
};

export const kingsAcademy: SummarySchool = {
  school: "The King's Academy",
  location: "Sunnyvale, CA",
  degree: "High School Diploma",
  honors:
    "National Honors Society, California Scholarship Federation, Principal’s Honor Roll",
  years: [],
};

export const summarySchools = [
  scuMasters,
  scuBachelors,
  stanford,
  kingsAcademy,
];
