// src/components/FormPage.js
import React, { useState } from "react";
import useFormStore from "../stateManagementController/zustland_hook";
import FormField from "./form_field";
import "./form_page.css";
function FormPage({ config }) {
  const currentPage = useFormStore((state) => state.currentPage);
  const nextPage = useFormStore((state) => state.nextPage);
  const submitForm = useFormStore((state) => state.submitForm);
  const [errors, setErrors] = useState({});
  const page = config.formConfig.pages[currentPage];
  const getFormData = useFormStore((state) => state.getFormData);
  // Function to validate all fields on the page
  const validateAllFields = async () => {
    const newErrors = {};
    const allFormData = await getFormData();
    page.fields.map((field) => {
      const value = allFormData[field.name] || "";
      console.log("HERE IS THE VALUE OF THE GET FORM DATA=>", value);
      const errorMessage = validateField(value, field);
      if (errorMessage) {
        newErrors[field.name] = errorMessage;
      }
    });
    setErrors(newErrors);
    console.log(
      "HERE IS THE LENGTH OF Object.keys=>",
      Object.keys(newErrors).length
    );
    return Object.keys(newErrors).length === 0; // True if no errors
  };

  // Function to validate a single field
  const validateField = (value, field) => {
    const { name, label, validation, required, allowMultiple } = field;
    if (required && !value) {
      return `${label} is required`;
    }
    console.log(Object.keys(value).length);
    if (
      allowMultiple != null &&
      allowMultiple === true &&
      Object.keys(value).length === 0
    ) {
      console.log("COMING INSIDE HERE");
      return `${label} is required`;
    }
    if (allowMultiple != null && allowMultiple === true) {
      return "";
    }
    if (validation) {
      if (validation.type === "string" && typeof value !== "string") {
        return `${label} must be a string`;
      }
      if (validation.type === "number") {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return `${label} must be a number`;
        }
        if (validation.min !== undefined && numValue < validation.min) {
          return `${label} must be at least ${validation.min}`;
        }
        if (validation.max !== undefined && numValue > validation.max) {
          return `${label} cannot be more than ${validation.max}`;
        }
      }
    }
    return ""; // No error
  };

  const handleNext = async () => {
    const validated = await validateAllFields();
    if (validated) {
      if (currentPage < config.formConfig.pages.length - 1) {
        nextPage();
      } else {
        submitForm();
      }
    }
  };

  return (
    <div className="formPage">
      <h2>{page.title}</h2>
      {page.fields.map((field) => (
        <div key={field.name}>
          <FormField key={field.name} field={field} />
          {errors[field.name] && (
            <p className="error-message" style={{ color: "red" }}>
              {errors[field.name]}
            </p>
          )}
        </div>
      ))}
      <button onClick={handleNext}>
        {currentPage < config.formConfig.pages.length - 1 ? "Next" : "Submit"}
      </button>
    </div>
  );
}

export default FormPage;
