// src/App.js
import React, { useEffect, useState } from "react";
import useFormStore from "./stateManagementController/zustland_hook";
import FormPage from "./components/form_page";

function App() {
  const [config, setConfig] = useState(null);
  const initializeForm = useFormStore((state) => state.initializeForm);
  const [remainingTime, setRemainingTime] = useState(0);
  const resetForm = useFormStore((state) => state.resetForm);
  useEffect(() => {
    // Fetch config from the backend
    // fetch("/api/formConfig")
    //   .then((res) => res.json())
    //   .then((configData) => {
    //     setConfig(configData);
    //     initializeForm(configData);
    //   });
    setConfig({
      formConfig: {
        timeout: 30, // Timeout in seconds (30 minutes)
        pages: [
          {
            title: "Page 1",
            fields: [
              {
                name: "name",
                label: "Name",
                type: "text",
                required: true,
                validation: { type: "string" },
              },
              {
                name: "gender",
                label: "Gender",
                type: "select",
                required: true,
                options: ["M", "F", "Nonbinary"],
                validation: { type: "string" },
              },
              {
                name: "age",
                label: "Age",
                type: "number",
                required: true,
                validation: { type: "number", min: 0 },
              },
            ],
          },
          {
            title: "Page 2",
            fields: [
              {
                name: "profession",
                label: "Profession",
                type: "select",
                required: true,
                options: ["Owner", "Agent", "Buyer", "Seller"],
                allowCustomInput: true,
                validation: { type: "string" },
              },
              {
                name: "services",
                label: "What services do you need?",
                type: "text",
                required: false,
                validation: { type: "string" },
              },
            ],
          },
        ],
      },
    });
    initializeForm({
      formConfig: {
        timeout: 30, // Timeout in seconds (30 minutes)
        pages: [
          {
            title: "Page 1",
            fields: [
              {
                name: "name",
                label: "Name",
                type: "text",
                required: true,
                validation: { type: "string" },
              },
              {
                name: "gender",
                label: "Gender",
                type: "select",
                required: true,
                options: ["M", "F", "Nonbinary"],
                validation: { type: "string" },
              },
              {
                name: "age",
                label: "Age",
                type: "number",
                required: true,
                validation: { type: "number", min: 0 },
              },
            ],
          },
          {
            title: "Page 2",
            fields: [
              {
                name: "profession",
                label: "Profession",
                type: "select",
                required: true,
                options: ["Owner", "Agent", "Buyer", "Seller"],
                allowCustomInput: true,
                validation: { type: "string" },
              },
              {
                name: "services",
                label: "What services do you need?",
                type: "text",
                required: false,
                validation: { type: "string" },
              },
            ],
          },
        ],
      },
    });
  }, [initializeForm]);
  useEffect(() => {
    // Only set remaining time when config is available
    if (config) {
      setRemainingTime(config.formConfig.timeout);
    }
  }, [config]);
  // Timer countdown effect
  useEffect(() => {
    if (!remainingTime) return;

    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          // Reset form and redirect to the first page when timer reaches 0
          setRemainingTime(config.formConfig.timeout);
          clearInterval(interval);
          resetForm();
          console.log(config.formConfig.timeout);
          return config.formConfig.timeout;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [remainingTime, resetForm, config]);

  // Helper function to format remaining time in mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (!config) return <p>Loading...</p>;

  return (
    <div className="App">
      {/* Display remaining time at the top of the page */}
      <div className="timer">
        <h2>Time Remaining: {formatTime(remainingTime)}</h2>
      </div>

      {/* Render the form pages */}
      <FormPage config={config} />
    </div>
  );
}

export default App;
