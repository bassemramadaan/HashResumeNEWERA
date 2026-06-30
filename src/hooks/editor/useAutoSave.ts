import { useState, useEffect } from 'react';
import { ResumeData } from '../../types/resume';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function useAutoSave(data: ResumeData) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  useEffect(() => {
    setSaveStatus('saving');
    
    const endTimer = setTimeout(() => {
      try {
        setSaveStatus('saved');
        
        // After 2.5 seconds of showing "Saved", revert to "idle" (All changes saved)
        setTimeout(() => {
          setSaveStatus(current => current === 'saved' ? 'idle' : current);
        }, 2500);
      } catch (error) {
        setSaveStatus('error');
      }
    }, 600);
    
    return () => clearTimeout(endTimer);
  }, [data]);

  return { saveStatus };
}
