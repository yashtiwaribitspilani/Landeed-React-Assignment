// src/store/useFormStore.js
import { create } from "zustand";
import { submitForm } from "../networkController/network_service";
const useFormStore = create((set, get) => ({
  isSubmitted: false,
  formData: {},
  currentPage: 0,
  timeoutDuration: null,
  timeoutId: null,
  isLoadingGlobal: false,
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

    // const timeoutId = setTimeout(() => {
    //   console.log("PRINTING AFTER 30 seconds");
    //   get().resetForm();
    //   set({ currentPage: 0 });
    // }, config.formConfig.timeout * 1000);
    // set({ timeoutId });
  },

  setFormData: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
  },
  setLoadingData: (loadingState) => {
    set((state) => ({
      isLoadingGlobal: loadingState,
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
    set({ isLoadingGlobal: true });
    console.log(formData);
    const response = await submitForm(formData);
    if (response.ok) {
      set({ isSubmitted: true });
      get().resetForm();
      set({ isLoadingGlobal: false });
    } else {
      alert("Form submission failed.");
      set({ isLoadingGlobal: false });
    }
  },
}));

export default useFormStore;
