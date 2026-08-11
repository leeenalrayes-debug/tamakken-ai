import type { ExperienceLevel } from "@/types/interview";

import type { en } from "./en";

/**
 * Arabic UI copy, written in a natural Saudi tech-product tone rather than
 * stiff Modern Standard Arabic. Kept structurally identical to en.ts
 * (enforced by the `typeof en` annotation) so every key is translated.
 */
export const ar: typeof en = {
  header: {
    logoAria: "تمكين AI — رجوع لأعلى الصفحة",
    navHome: "الرئيسية",
    navHowItWorks: "طريقة العمل",
    navAbout: "عن الخدمة",
    startPractice: "ابدأ التدريب",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
  },
  hero: {
    badge: "تجهيز للمقابلات بالذكاء الاصطناعي",
    titleLine1: "تدرّب بذكاء.",
    titleLine2: "قابل بثقة أكبر.",
    description:
      "جهّز نفسك بأسئلة مقابلة مخصصة لك، مع إجابات مثالية وتوجيهات تساعدك تخصصها لك.",
    features: [
      "أسئلة مخصصة لوظيفتك",
      "أسئلة من الذكاء الاصطناعي",
      "توجيهات لتخصيص إجاباتك",
    ],
  },
  howItWorks: {
    badge: "بسيط وسهل",
    title: "كيف تعمل؟",
    subtitle: "3 خطوات بسيطة توصّلك لمقابلة أقوى وأكثر ثقة.",
    steps: [
      {
        title: "أخبرنا عن وظيفتك",
        description:
          "اكتب المسمى الوظيفي، اختر مستوى الخبرة، وأضف تفاصيل الوظيفة إذا تحب.",
      },
      {
        title: "احصل على أسئلة مقابلة بالذكاء الاصطناعي",
        description:
          "بتحصل على 3 أسئلة مخصصة لك، كل سؤال فيه إجابة مثالية وتوجيهات تساعدك تخصصها لنفسك.",
      },
      {
        title: "تدرّب بثقة",
        description:
          "راجع الأسئلة، وإذا تحب تكمّل، اطلب مجموعة جديدة لنفس الوظيفة في أي وقت.",
      },
    ],
  },
  generateIntro: {
    badge: "مخصص. ذكي. فعّال.",
    titleLine1: "يلا نجهز",
    titleLine2: "مقابلتك المثالية",
    description: "أخبرنا عن الوظيفة، وإحنا نجهز لك أسئلة مقابلة على مقاسك.",
  },
  form: {
    cardTitle: "أخبرنا عن الوظيفة",
    cardDescription: "بنجهز لك أسئلة مقابلتك على مقاسك.",
    jobTitleLabel: "المسمى الوظيفي",
    jobTitlePlaceholder: "مثل: مهندس برمجيات",
    experienceLevelLabel: "مستوى الخبرة",
    experienceLevelPlaceholder: "اختر مستوى خبرتك",
    jobDescriptionLabel: "تفاصيل الوظيفة",
    optional: "(اختياري)",
    jobDescriptionPlaceholder: "الصق تفاصيل الوظيفة هنا...",
    submitButton: "ابدأ إنشاء الأسئلة",
    validation: {
      jobTitleRequired: "لازم تكتب المسمى الوظيفي.",
      experienceLevelRequired: "لازم تختار مستوى الخبرة.",
    },
  },
  experienceLevels: {
    "Entry Level": "حديث التخرج",
    Junior: "مبتدئ",
    "Mid-Level": "متوسط الخبرة",
    Senior: "خبير",
    Lead: "قائد فريق",
    Manager: "مدير",
  } satisfies Record<ExperienceLevel, string>,
  loading: {
    generating: "جاري تجهيز أسئلتك...",
    regenerating: "جاري تجهيز جولة جديدة...",
  },
  errorAlert: {
    dismiss: "إغلاق",
  },
  errors: {
    generic: "صار خطأ، حاول مرة ثانية.",
    network: "ما قدرنا نوصل للخادم. تأكد من اتصالك وحاول مرة ثانية.",
  },
  results: {
    heading: "أسئلة مقابلتك",
    idealAnswer: "الإجابة المثالية",
    whyStrong: "ليش هذي الإجابة قوية",
    howToPersonalize: "كيف تخصصها لك",
  },
  continuePractice: {
    greatJob: "🎉 أحسنت!",
    heading: "أنهيت جولة المقابلة.",
    description: "إذا ودك تتدرب أكثر، اضغط الزر بالأسفل لتوليد 3 أسئلة جديدة.",
    badges: [
      "أسئلة جديدة كل مرة",
      "نفس الوظيفة ومستوى الخبرة",
      "زيد ثقتك بالمقابلات",
    ],
    button: "توليد 3 أسئلة جديدة",
    footnote: "الأسئلة الجديدة ما تتكرر مع اللي قبلها.",
  },
  footer: {
    poweredBy: "بدعم من Meta",
  },
  errorBoundary: {
    heading: "صار في خطأ",
    description: "صار خطأ ما توقعناه. حاول مرة ثانية.",
    tryAgain: "حاول مرة ثانية",
  },
  languageSwitcher: {
    label: "اللغة",
    en: "English",
    ar: "العربية",
  },
};
