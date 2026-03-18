import { describe, it, expect, beforeEach } from 'vitest';
import { useResumeStore } from '../store/useResumeStore';

describe('Resume Store', () => {
  beforeEach(() => {
    useResumeStore.getState().resetData();
  });

  it('should update personal info', () => {
    const { updatePersonalInfo } = useResumeStore.getState();
    updatePersonalInfo({ fullName: 'John Doe' });
    
    expect(useResumeStore.getState().data.personalInfo.fullName).toBe('John Doe');
  });

  it('should add and remove experience', () => {
    const { addExperience, removeExperience } = useResumeStore.getState();
    
    addExperience({
      company: 'Test Co',
      position: 'Dev',
      startDate: '2020-01',
      endDate: 'Present',
      description: 'Test desc'
    });
    
    expect(useResumeStore.getState().data.experience.length).toBe(1);
    expect(useResumeStore.getState().data.experience[0].company).toBe('Test Co');
    
    const id = useResumeStore.getState().data.experience[0].id;
    removeExperience(id);
    
    expect(useResumeStore.getState().data.experience.length).toBe(0);
  });

  it('should reorder sections', () => {
    const { reorderSections } = useResumeStore.getState();
    const newOrder: any = ['experience', 'summary', 'education'];
    
    reorderSections(newOrder);
    
    expect(useResumeStore.getState().data.settings.sectionOrder).toEqual(newOrder);
  });
});
