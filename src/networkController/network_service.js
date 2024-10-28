// src/services/fetchFormConfig.js
import endpoints from "../config/endpoints";
export const fetchFormConfig = async () => {
  try {
    const response = await fetch(endpoints.formConfig);

    // Check if the response is okay (status in the range 200-299)
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const configData = await response.json();
    return configData;
  } catch (error) {
    console.error("Failed to fetch form config:", error);
    throw error; // re-throw the error to handle it in the component
  }
};
export const submitForm = async (formData) => {
  try {
    const response = await fetch(endpoints.submitForm, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: formData }),
    });

    return response;
  } catch (error) {
    console.error("Failed to submit form:", error);
    throw error; // re-throw the error to handle it in the component
  }
};
