// src/App.js
import React, { useEffect, useState } from "react";
import useFormStore from "./stateManagementController/zustland_hook";
import FormPage from "./components/form_page";
import "./app.css";
import { ThreeDots } from "react-loader-spinner";

function App() {
  const [config, setConfig] = useState(null);
  const initializeForm = useFormStore((state) => state.initializeForm);
  const [remainingTime, setRemainingTime] = useState(0);
  const resetForm = useFormStore((state) => state.resetForm);
  useEffect(() => {
    // Function to fetch form configuration
    const fetchFormConfig = async () => {
      console.log("USE EFFECT CALLED");
      try {
        const response = await fetch(
          "https://landeedbackend.onrender.com/api/formConfig"
        );

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }

        const configData = await response.json();

        setConfig(configData);
        initializeForm(configData); // Parse JSON from the response
        setRemainingTime(configData.formConfig.timeout);
        console.log("Form Configuration:", configData);
        // You can now use configData in your application
      } catch (error) {
        console.error("Fetch error:", error); // Handle errors
      }
    };

    // Call the fetch function
    fetchFormConfig();
    // setConfig({
    //   formConfig: {
    //     timeout: 30, // Timeout in seconds (30 minutes)
    //     pages: [
    //       {
    //         title: "Page 1",
    //         fields: [
    //           {
    //             name: "name",
    //             label: "Name",
    //             type: "text",
    //             required: true,
    //             validation: { type: "string" },
    //           },
    //           {
    //             name: "gender",
    //             label: "Gender",
    //             type: "select",
    //             required: true,
    //             options: ["M", "F", "Nonbinary"],
    //             validation: { type: "string" },
    //           },
    //           {
    //             name: "age",
    //             label: "Age",
    //             type: "number",
    //             required: true,
    //             validation: { type: "number", min: 0 },
    //           },
    //         ],
    //       },
    //       {
    //         title: "Page 2",
    //         fields: [
    //           {
    //             name: "profession",
    //             label: "Profession",
    //             type: "select",
    //             required: true,
    //             options: ["Owner", "Agent", "Buyer", "Seller"],
    //             allowCustomInput: true,
    //             validation: { type: "string" },
    //           },
    //           {
    //             name: "services",
    //             label: "What services do you need?",
    //             type: "text",
    //             required: false,
    //             validation: { type: "string" },
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // });
    // initializeForm({
    //   formConfig: {
    //     timeout: 30, // Timeout in seconds (30 minutes)
    //     pages: [
    //       {
    //         title: "Page 1",
    //         fields: [
    //           {
    //             name: "name",
    //             label: "Name",
    //             type: "text",
    //             required: true,
    //             validation: { type: "string" },
    //           },
    //           {
    //             name: "gender",
    //             label: "Gender",
    //             type: "select",
    //             required: true,
    //             options: ["M", "F", "Nonbinary"],
    //             validation: { type: "string" },
    //           },
    //           {
    //             name: "age",
    //             label: "Age",
    //             type: "number",
    //             required: true,
    //             validation: { type: "number", min: 0 },
    //           },
    //         ],
    //       },
    //       {
    //         title: "Page 2",
    //         fields: [
    //           {
    //             name: "profession",
    //             label: "Profession",
    //             type: "select",
    //             required: true,
    //             options: ["Owner", "Agent", "Buyer", "Seller"],
    //             allowCustomInput: true,
    //             validation: { type: "string" },
    //           },
    //           {
    //             name: "services",
    //             label: "What services do you need?",
    //             type: "text",
    //             required: false,
    //             validation: { type: "string" },
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // });
  }, [initializeForm]);
  // useEffect(() => {
  //   // Only set remaining time when config is available
  //   if (config) {
  //     setRemainingTime(config.formConfig.timeout);
  //   }
  // }, [config]);
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

  if (!config)
    return (
      <div className="loader">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#6366f1"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );

  return (
    <div className="App">
      <div className="content">
        {/* Display remaining time at the top of the page */}
        <div className="timer">
          <h2>Time Remaining: {formatTime(remainingTime)}</h2>
        </div>

        {/* Render the form pages */}
        <FormPage config={config} />
      </div>
    </div>
  );
}

export default App;
