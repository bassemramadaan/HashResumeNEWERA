import { create } from "zustand";
import { temporal } from "zundo";

const useResumeStore = create()(temporal((set) => ({ count: 0 })));
console.log(useResumeStore.temporal);
