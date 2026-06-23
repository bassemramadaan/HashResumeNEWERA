import type { ResumeData } from "../types/resume";

export const sampleData: ResumeData = {
  name: "Sarah Mitchell",
  title: "Senior Product Designer",
  contact: {
    city: "London",
    country: "UK",
    phone: "+44 7700 900000",
    email: "sarah.mitchell@email.com",
    linkedin: "linkedin.com/in/sarahmitchell",
    portfolio: "sarahmitchell.design"
  },
  summary: [
    "Led end-to-end design of 8 enterprise SaaS products serving 200,000+ users across 14 countries",
    "Reduced user drop-off by 52% through data-driven UX redesign validated by 600+ usability test sessions"
  ],
  skills: ["Figma", "Framer", "UX Research", "Design Systems", "Prototyping", "User Testing", "Accessibility", "React", "TypeScript", "SQL"],
  experience: [
    {
      company: "Atlassian",
      role: "Senior Product Designer",
      startDate: "Mar 2022",
      endDate: "Present",
      location: "London, UK",
      bullets: [
        "Designed Jira's new dashboard system adopted by 3.2M monthly active users, increasing task completion rate by 38%",
        "Established a 240-component design system used across 6 product teams, reducing design-to-dev handoff time by 4 days per sprint",
        "Conducted 80+ moderated user research sessions across US, EU, and APAC markets to validate redesign decisions",
        "Mentored a team of 4 junior designers through weekly critiques and structured career development plans"
      ]
    },
    {
      company: "Spotify",
      role: "Product Designer",
      startDate: "Jun 2019",
      endDate: "Feb 2022",
      location: "Stockholm, Sweden",
      bullets: [
        "Redesigned the podcast discovery experience, contributing to a 29% increase in monthly podcast listeners globally",
        "Shipped 12 A/B tested feature experiments reaching 40M+ users with an average 11% conversion improvement per cycle",
        "Partnered with engineering and data science to define instrumentation standards for design KPI measurement"
      ]
    },
    {
      company: "IDEO",
      role: "UX Designer",
      startDate: "Aug 2017",
      endDate: "May 2019",
      location: "San Francisco, CA",
      bullets: [
        "Delivered human-centered design solutions for Fortune 500 clients in healthcare, fintech, and retail sectors",
        "Facilitated 30+ design sprints across cross-functional client teams of 8–15 stakeholders"
      ]
    }
  ],
  projects: [
    {
      name: "AccessKit — Open Source Accessibility Toolkit",
      description: "Built a library of 60 WCAG 2.2 AA-compliant Figma components used by 800+ designers worldwide",
      tech: "Figma, React, Storybook",
      link: "github.com/sarahmitchell/accesskit"
    }
  ],
  education: [
    {
      institution: "Royal College of Art",
      degree: "Master of Arts",
      field: "Interaction Design",
      startYear: "2015",
      endYear: "2017",
      gpa: "Distinction"
    },
    {
      institution: "University of Manchester",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startYear: "2012",
      endYear: "2015"
    }
  ],
  certifications: [
    {
      name: "Google UX Design Professional Certificate",
      issuer: "Google / Coursera",
      date: "2022"
    }
  ]
};
