import { CallBackProps, STATUS, Step } from 'react-joyride';
import Joyride from 'react-joyride';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { useLanguageStore } from '../store/useLanguageStore';

export default function OnboardingTour() {
  const { isActive, stopOnboarding } = useOnboardingStore();
  const { language } = useLanguageStore();

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      stopOnboarding();
    }
  };

  const steps: Step[] = [
    {
      target: '[data-tour="personal-info"]',
      content: language === 'ar' ? 'ابدأ بإدخال معلوماتك الشخصية الأساسية.' : 'Start by entering your basic personal information.',
      disableBeacon: true,
    },
    {
      target: '[data-tour="experience-section"]',
      content: language === 'ar' ? 'أضف خبراتك العملية هنا. يمكنك استخدام الذكاء الاصطناعي للمساعدة في الكتابة.' : 'Add your work experience here. You can use AI to help you write.',
    },
    {
      target: '[data-tour="skills-section"]',
      content: language === 'ar' ? 'أضف مهاراتك التقنية والشخصية.' : 'Add your technical and soft skills.',
    },
    {
      target: '[data-tour="review-section"]',
      content: language === 'ar' ? 'افحص توافق سيرتك الذاتية مع أنظمة التوظيف (ATS) وحملها.' : 'Check your resume ATS score and download it.',
    },
    {
      target: '[data-tour="preview-pane"]',
      content: language === 'ar' ? 'هنا يمكنك معاينة سيرتك الذاتية في الوقت الفعلي.' : 'Here you can preview your resume in real-time.',
      placement: 'left',
    }
  ];

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={isActive}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#f16529',
          textColor: '#334155',
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
          overlayColor: 'rgba(15, 23, 42, 0.6)',
        },
        tooltipContainer: {
          textAlign: language === 'ar' ? 'right' : 'left',
          direction: language === 'ar' ? 'rtl' : 'ltr',
        },
        buttonNext: {
          backgroundColor: '#f16529',
          borderRadius: '9999px',
          padding: '8px 16px',
          fontWeight: 'bold',
        },
        buttonBack: {
          color: '#64748b',
          marginRight: language === 'ar' ? '0' : '10px',
          marginLeft: language === 'ar' ? '10px' : '0',
        },
        buttonSkip: {
          color: '#94a3b8',
        }
      }}
      locale={{
        back: language === 'ar' ? 'السابق' : 'Back',
        close: language === 'ar' ? 'إغلاق' : 'Close',
        last: language === 'ar' ? 'إنهاء' : 'Finish',
        next: language === 'ar' ? 'التالي' : 'Next',
        skip: language === 'ar' ? 'تخطي' : 'Skip',
      }}
    />
  );
}
