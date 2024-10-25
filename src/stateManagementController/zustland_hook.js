// src/store/useFormStore.js
import { create } from "zustand";

const useFormStore = create((set, get) => ({
  formData: {},
  currentPage: 0,
  timeoutDuration: null,
  timeoutId: null,

  initializeForm: (config) => {
    // Clear any existing timeout to avoid memory leaks
    const existingTimeoutId = get().timeoutId;
    if (existingTimeoutId) {
      clearTimeout(existingTimeoutId);
    }
    set({
      formData: {},
      currentPage: 0,
      timeoutDuration: config.formConfig.timeout,
    });

    const timeoutId = setTimeout(() => {
      console.log("PRINTING AFTER 5 seconds");
      get().resetForm();
      set({ currentPage: 0 });
    }, config.formConfig.timeout * 1000);
    set({ timeoutId });
  },

  setFormData: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
  },
  getFormData: async () => {
    const { formData } = get();
    // If a specific field is requested, return its value
    // Otherwise, return the entire formData object
    return formData;
  },
  nextPage: () => {
    set((state) => ({ currentPage: state.currentPage + 1 }));
  },

  resetForm: () => {
    clearTimeout(get().timeoutId);
    set({ formData: {}, currentPage: 0 });
  },

  submitForm: async () => {
    const { formData } = get();
    console.log(formData);
    // const response = await fetch("/api/submit", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
    // if (response.ok) {
    //   alert("Form submitted successfully!");
    //   get().resetForm();
    // } else {
    //   alert("Form submission failed.");
    // }
  },
}));

export default useFormStore;
