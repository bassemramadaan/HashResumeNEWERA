export type Tab =
  | "basics"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "finish"
  | "review";

export interface TabItem {
  id: Tab;
  label: string;
  shortLabel: string;
  icon: any; // We can use React.ElementType in actual code, but importing it is fine
  tourId?: string;
}
