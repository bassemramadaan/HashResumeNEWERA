import { useState, useRef, useEffect } from "react";
import { Tab } from "../../types/editor.types";

export function useResumeEditorState() {
  const [activeTab, setActiveTab] = useState<Tab>("basics");
  const formRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);

  const tabOrder: Tab[] = [
    "basics",
    "experience",
    "skills",
    "finish",
  ];
  
  const currentTabIndex = tabOrder.indexOf(activeTab);
  const hasNextTab = currentTabIndex >= 0 && currentTabIndex < tabOrder.length - 1;
  const hasPrevTab = currentTabIndex > 0;

  const handleNextTab = () => {
    if (hasNextTab) setActiveTab(tabOrder[currentTabIndex + 1]);
  };
  
  const handlePrevTab = () => {
    if (hasPrevTab) setActiveTab(tabOrder[currentTabIndex - 1]);
  };

  const scrollToFormTop = () => {
    formRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchEndX - touchStartRef.current;
    const diffY = touchEndY - touchStartYRef.current;
    
    if (Math.abs(diffX) > 75 && Math.abs(diffY) < 55) {
      if (diffX > 0) {
        handlePrevTab();
        scrollToFormTop();
      } else {
        handleNextTab();
        scrollToFormTop();
      }
    }
  };

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollTo({ top: 0, behavior: "instant" as any });
    }
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    formRef,
    handleTouchStart,
    handleTouchEnd,
    scrollToFormTop,
    hasNextTab,
    hasPrevTab,
    handleNextTab,
    handlePrevTab,
  };
}
