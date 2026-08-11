import type { ExperienceLevel } from "@/types/interview";

/**
 * English UI copy. Interface text only — AI-generated interview content
 * and user input are never sourced from here.
 */
export const en = {
  header: {
    logoAria: "Tamakken AI — back to top",
    navHome: "Home",
    navHowItWorks: "How it Works",
    navAbout: "About",
    startPractice: "Start Practice",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
  hero: {
    badge: "AI-Powered Interview Preparation",
    titleLine1: "Practice smarter.",
    titleLine2: "Interview stronger.",
    description:
      "Generate personalized interview questions, ideal answers, and guidance to make them your own.",
    features: [
      "Tailored to your role",
      "AI-generated questions",
      "Personalization guidance",
    ],
  },
  howItWorks: {
    badge: "Simple by design",
    title: "How it works",
    subtitle:
      "Three steps between you and a sharper, more confident interview.",
    steps: [
      {
        title: "Tell us about your role",
        description:
          "Enter your job title, experience level, and an optional job description.",
      },
      {
        title: "Generate AI interview questions",
        description:
          "Receive three personalized interview questions, each with an ideal answer and guidance to make it your own.",
      },
      {
        title: "Practice with confidence",
        description:
          "Review the questions, then continue practicing with a fresh set for the same role whenever you're ready.",
      },
    ],
  },
  generateIntro: {
    badge: "Personalized. Smart. Effective.",
    titleLine1: "Let's create your",
    titleLine2: "perfect interview session",
    description:
      "Tell us about the role and we'll generate interview questions tailored just for you.",
  },
  form: {
    cardTitle: "Tell us about the role",
    cardDescription: "We'll tailor your interview questions to match it.",
    jobTitleLabel: "Job Title",
    jobTitlePlaceholder: "Software Engineer",
    experienceLevelLabel: "Experience Level",
    experienceLevelPlaceholder: "Select experience level",
    jobDescriptionLabel: "Job Description",
    optional: "(Optional)",
    jobDescriptionPlaceholder: "Paste the job description here...",
    submitButton: "Generate Interview Questions",
    validation: {
      jobTitleRequired: "Please enter a Job Title.",
      experienceLevelRequired: "Please select your experience level.",
    },
  },
  experienceLevels: {
    "Entry Level": "Entry Level",
    Junior: "Junior",
    "Mid-Level": "Mid-Level",
    Senior: "Senior",
    Lead: "Lead",
    Manager: "Manager",
  } satisfies Record<ExperienceLevel, string>,
  loading: {
    generating: "Generating your interview questions...",
    regenerating: "Generating a new interview session...",
  },
  errorAlert: {
    dismiss: "Dismiss error",
  },
  errors: {
    generic: "Something went wrong. Please try again.",
    network:
      "Unable to reach the server. Please check your connection and try again.",
  },
  results: {
    heading: "Your Interview Questions",
    idealAnswer: "Ideal Answer",
    whyStrong: "Why This Answer Is Strong",
    howToPersonalize: "How to Personalize This Answer",
  },
  continuePractice: {
    greatJob: "🎉 Great job!",
    heading: "You've completed this interview round.",
    description: "Would you like to practice more?",
    badges: [
      "Fresh & Unique Questions",
      "Same Job & Experience Level",
      "Build Interview Confidence",
    ],
    button: "Generate 3 More Questions",
    footnote: "New questions will not repeat previous ones.",
  },
  footer: {
    poweredBy: "Powered by Meta",
  },
  errorBoundary: {
    heading: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    tryAgain: "Try again",
  },
  languageSwitcher: {
    label: "Language",
    en: "English",
    ar: "العربية",
  },
};
