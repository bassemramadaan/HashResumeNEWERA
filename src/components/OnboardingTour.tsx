import React from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { useLanguageStore } from "../store/useLanguageStore";

const OnboardingTour = () => {
  const { isActive, skipOnboarding } = useOnboardingStore();
  const { language } = useLanguageStore();

  const isAr = language === "ar";

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      title: isAr ? "مرحباً بك في Hash Resume!" : "Welcome to Hash Resume!",
      content: isAr 
        ? "دعنا نأخذك في جولة سريعة في المحرر لمساعدتك في بناء سيرتك الذاتية الاحترافية في دقائق."
        : "Let us show you around the editor to help you build your professional resume in minutes.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="personal-info"]',
      title: isAr ? "1. المعلومات الشخصية" : "1. Personal Information",
      content: isAr
        ? "ابدأ بإدخال بيانات الاتصال الخاصة بك وملخص احترافي."
        : "Start by filling in your contact details and a professional summary.",
      placement: "top",
    },
    {
      target: '[data-tour="experience-section"]',
      title: isAr ? "2. خبرات العمل" : "2. Work Experience",
      content: isAr
        ? "أضف تاريخك المهني. استخدم أدوات الذكاء الاصطناعي لتحسين النقاط."
        : "Add your professional history. Use our AI tools to polish your bullet points.",
      placement: "top",
    },
    {
      target: '[data-tour="skills-section"]',
      title: isAr ? "3. المهارات والخبرات" : "3. Skills & Expertise",
      content: isAr
        ? "أضف مهاراتك التقنية والشخصية. يمكن للذكاء الاصطناعي اقتراح مهارات مناسبة لدورك."
        : "List your technical and soft skills. AI can suggest relevant skills for your role.",
      placement: "top",
    },
    {
      target: '[data-tour="review-section"]',
      title: isAr ? "4. مراجعة ATS" : "4. ATS Review",
      content: isAr
        ? "تحقق من درجة ATS الخاصة بك واحصل على ملاحظات قابلة للتنفيذ لتحسين سيرتك الذاتية."
        : "Check your ATS score and get actionable feedback to improve your resume.",
      placement: "top",
    },
    {
      target: '[data-tour="preview-pane"]',
      title: isAr ? "5. معاينة فورية" : "5. Real-time Preview",
      content: isAr
        ? "شاهد تغييراتك فوراً أثناء الكتابة. ما تراه هو ما ستحصل عليه!"
        : "See your changes instantly as you type. What you see is what you get!",
      placement: "left",
    },
    {
      target: '[data-tour="export-button"]',
      title: isAr ? "6. التصدير والتقديم" : "6. Export & Apply",
      content: isAr
        ? "بمجرد أن تكون راضياً عن سيرتك الذاتية، قم بتحميلها كملف PDF احترافي."
        : "Once you are happy with your resume, download it as a professional PDF.",
      placement: "bottom",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      skipOnboarding();
    }
  };

  if (!isActive) return null;

  return (
    <Joyride
      steps={steps}
      run={isActive}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#ff4d2d",
          zIndex: 10000,
          backgroundColor: "#ffffff",
          textColor: "#0f172a",
          arrowColor: "#ffffff",
          overlayColor: "rgba(15, 23, 42, 0.4)",
        },
        tooltip: {
          borderRadius: "24px",
          padding: "24px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
        tooltipContainer: {
          textAlign: isAr ? "right" : "left",
        },
        tooltipTitle: {
          fontWeight: 900,
          fontSize: "1.25rem",
          marginBottom: "8px",
          color: "#0f172a",
        },
        tooltipContent: {
          padding: "16px 0",
          color: "#475569",
          lineHeight: 1.6,
          fontSize: "1rem",
        },
        buttonNext: {
          borderRadius: "16px",
          fontWeight: "bold",
          padding: "12px 24px",
          backgroundColor: "#ff4d2d",
        },
        buttonBack: {
          marginRight: isAr ? "0" : "16px",
          marginLeft: isAr ? "16px" : "0",
          fontWeight: "bold",
          color: "#64748b",
        },
        buttonSkip: {
          color: "#94a3b8",
          fontWeight: "600",
        },
      }}
      locale={{
        back: isAr ? "السابق" : "Back",
        close: isAr ? "إغلاق" : "Close",
        last: isAr ? "إنهاء" : "Finish",
        next: isAr ? "التالي" : "Next",
        skip: isAr ? "تخطي" : "Skip",
      }}
    />
  );
};

export default OnboardingTour;
