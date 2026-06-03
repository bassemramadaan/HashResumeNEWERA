const fs = require('fs');
let file = "src/store/useResumeStore.ts";
let content = fs.readFileSync(file, "utf8");

content = content.replace(
`export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({`,
`export const useResumeStore = create<ResumeStore>()(
  temporal(
    persist(
      (set, get) => ({`
);

fs.writeFileSync(file, content);
