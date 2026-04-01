import React from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useOnboardingStore } from "../store/useOnboardingStore";

const OnboardingTour = () => {
  const { isActive, skipOnboarding } = useOnboardingStore();

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      title: "Welcome to Hash Resume!",
      content:
        "Let us show you around the editor to help you build your professional resume in minutes.",
      disableBeacon: true,
    },
    {
      target: '[data-tour="personal-info"]',
      title: "1. Personal Information",
      content:
        "Start by filling in your contact details and a professional summary.",
      placement: "top",
    },
    {
      target: '[data-tour="experience-section"]',
      title: "2. Work Experience",
      content:
        "Add your professional history. Use our AI tools to polish your bullet points.",
      placement: "top",
    },
    {
      target: '[data-tour="skills-section"]',
      title: "3. Skills & Expertise",
      content:
        "List your technical and soft skills. AI can suggest relevant skills for your role.",
      placement: "top",
    },
    {
      target: '[data-tour="review-section"]',
      title: "4. ATS Review",
      content:
        "Check your ATS score and get actionable feedback to improve your resume.",
      placement: "top",
    },
    {
      target: '[data-tour="preview-pane"]',
      title: "5. Real-time Preview",
      content:
        "See your changes instantly as you type. What you see is what you get!",
      placement: "left",
    },
    {
      target: '[data-tour="export-button"]',
      title: "6. Export & Apply",
      content:
        "Once you are happy with your resume, download it as a professional PDF.",
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
          textAlign: "left",
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
          marginRight: "16px",
          fontWeight: "bold",
          color: "#64748b",
        },
        buttonSkip: {
          color: "#94a3b8",
          fontWeight: "600",
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip",
      }}
    />
  );
};

export default OnboardingTour;
