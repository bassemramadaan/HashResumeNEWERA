import React from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useOnboardingStore } from '../store/useOnboardingStore';

const OnboardingTour = () => {
  const { isActive, skipOnboarding } = useOnboardingStore();

  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to Hash Resume!',
      content: 'Let us show you around the editor to help you build your professional resume in minutes.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="personal-info"]',
      title: '1. Personal Information',
      content: 'Start by filling in your contact details and a professional summary.',
      placement: 'top',
    },
    {
      target: '[data-tour="experience-section"]',
      title: '2. Work Experience',
      content: 'Add your professional history. Use our AI tools to polish your bullet points.',
      placement: 'top',
    },
    {
      target: '[data-tour="skills-section"]',
      title: '3. Skills & Expertise',
      content: 'List your technical and soft skills. AI can suggest relevant skills for your role.',
      placement: 'top',
    },
    {
      target: '[data-tour="review-section"]',
      title: '4. ATS Review',
      content: 'Check your ATS score and get actionable feedback to improve your resume.',
      placement: 'top',
    },
    {
      target: '[data-tour="preview-pane"]',
      title: '5. Real-time Preview',
      content: 'See your changes instantly as you type. What you see is what you get!',
      placement: 'left',
    },
    {
      target: '[data-tour="export-button"]',
      title: '6. Export & Apply',
      content: 'Once you are happy with your resume, download it as a professional PDF.',
      placement: 'bottom',
    }
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
          primaryColor: '#f16529',
          zIndex: 10000,
          backgroundColor: '#ffffff',
          textColor: '#0f172a',
          arrowColor: '#ffffff',
        },
        tooltipContainer: {
          textAlign: 'left',
          borderRadius: '16px',
          padding: '10px',
        },
        buttonNext: {
          borderRadius: '9999px',
          fontWeight: 'bold',
          padding: '10px 20px',
        },
        buttonBack: {
          marginRight: '10px',
          fontWeight: 'bold',
          color: '#64748b',
        },
        buttonSkip: {
          color: '#94a3b8',
        }
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip',
      }}
    />
  );
};

export default OnboardingTour;
