import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { temporal } from "zundo";

const initialData = { name: "test" };
export const useResumeStore = create()(
  temporal(
    persist(
      (set) => ({
        data: initialData
      }),
      { name: "test" }
    )
  )
);
console.log(Object.keys(useResumeStore));
