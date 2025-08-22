import {
  work,
  volunteer,
  school,
  REACT,
  TS,
  JS,
  CSS,
  HTML,
  RUBY,
  JAVA,
  ANGULAR,
  ASP2,
} from "../work";
import type { Job } from "../work";

describe("constants | work", () => {
  describe("tech constants", () => {
    it("exports all tech constants with correct values", () => {
      expect(REACT).toBe("React.js");
      expect(TS).toBe("TypeScript");
      expect(JS).toBe("JavaScript");
      expect(CSS).toBe("CSS3");
      expect(HTML).toBe("HTML5");
      expect(RUBY).toBe("Ruby on Rails 5");
      expect(JAVA).toBe("Java 8");
      expect(ANGULAR).toBe("Angular.js 1.X");
      expect(ASP2).toBe("ASP.NET 2.0 MVC");
    });
  });

  describe("work array", () => {
    it("exports work array with correct structure", () => {
      expect(Array.isArray(work)).toBe(true);
      expect(work.length).toBeGreaterThan(0);
    });

    it("has valid Job objects in work array", () => {
      work.forEach((job) => {
        expect(job).toHaveProperty("company");
        expect(job).toHaveProperty("location");
        expect(job).toHaveProperty("title");
        expect(job).toHaveProperty("time");
        expect(job).toHaveProperty("color");

        expect(typeof job.company).toBe("string");
        expect(typeof job.location).toBe("string");
        expect(typeof job.title).toBe("string");
        expect(typeof job.time).toBe("string");
        expect(typeof job.color).toBe("string");

        // Optional properties
        if (job.parent) expect(typeof job.parent).toBe("string");
      });
    });

    it("contains expected companies in work array", () => {
      const companies = work.map((job) => job.company);
      expect(companies).toContain("Intuit");
      expect(companies).toContain("GigNow");
      expect(companies).toContain("Cisco Systems");
    });
  });

  describe("volunteer array", () => {
    it("exports volunteer array with correct structure", () => {
      expect(Array.isArray(volunteer)).toBe(true);
      expect(volunteer.length).toBeGreaterThan(0);
    });

    it("has valid Job objects in volunteer array", () => {
      volunteer.forEach((job) => {
        expect(job).toHaveProperty("company");
        expect(job).toHaveProperty("location");
        expect(job).toHaveProperty("title");
        expect(job).toHaveProperty("time");
        expect(job).toHaveProperty("color");
      });
    });

    it("contains expected organizations in volunteer array", () => {
      const companies = volunteer.map((job) => job.company);
      expect(companies).toContain("Midnight Game Club");
      expect(companies).toContain("Second Harvest Food Bank");
    });
  });

  describe("school array", () => {
    it("exports school array with correct structure", () => {
      expect(Array.isArray(school)).toBe(true);
      expect(school.length).toBeGreaterThan(0);
    });

    it("has valid Job objects in school array", () => {
      school.forEach((job) => {
        expect(job).toHaveProperty("company");
        expect(job).toHaveProperty("location");
        expect(job).toHaveProperty("title");
        expect(job).toHaveProperty("time");
        expect(job).toHaveProperty("color");
      });
    });

    it("contains expected schools in school array", () => {
      const companies = school.map((job) => job.company);
      expect(companies).toContain("SCU MS");
      expect(companies).toContain("Santa Clara University BS");
    });

    it("has correct chronological order (MS before BS)", () => {
      const msIndex = school.findIndex((job) => job.company === "SCU MS");
      const bsIndex = school.findIndex(
        (job) => job.company === "Santa Clara University BS",
      );
      expect(msIndex).toBeLessThan(bsIndex);
    });
  });

  describe("Job interface compliance", () => {
    it("all work jobs comply with Job interface", () => {
      work.forEach((job: Job) => {
        expect(job.company).toBeDefined();
        expect(job.location).toBeDefined();
        expect(job.title).toBeDefined();
        expect(job.time).toBeDefined();
        expect(job.color).toBeDefined();
      });
    });

    it("validates specific job data accuracy", () => {
      const intuitJob = work.find((job) => job.company === "Intuit");
      expect(intuitJob).toBeDefined();
      expect(intuitJob?.title).toBe("Head of Accessibility Engineering");
      expect(intuitJob?.time).toBe("2019 - Present");
      expect(intuitJob?.location).toBe("Mountain View, CA");
    });
  });

  describe("data integrity", () => {
    it("has no duplicate entries", () => {
      const allJobs = [...work, ...volunteer, ...school];
      const jobKeys = allJobs.map(
        (job) => `${job.company}-${job.title}-${job.time}`,
      );
      const uniqueKeys = new Set(jobKeys);
      expect(jobKeys.length).toBe(uniqueKeys.size);
    });

    it("has valid color values", () => {
      const allJobs = [...work, ...volunteer, ...school];
      const colorRegex = /^(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\(.*\)|[a-z]+)$/;
      allJobs.forEach((job) => {
        expect(job.color).toMatch(colorRegex);
      });
    });
  });
});
