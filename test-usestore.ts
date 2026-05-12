import { create, useStore } from "zustand";
import { temporal } from "zundo";

const store = create()(temporal((set) => ({ count: 0 })));
try {
  useStore(store.temporal);
  console.log("Success");
} catch (e) {
  console.error("Error:", e);
}
