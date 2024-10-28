// src/App.js
import React, { useEffect, useState } from "react";
import useFormStore from "./stateManagementController/zustland_hook";
import FormPage from "./components/form_page";
import "./app.css";
import { ThreeDots } from "react-loader-spinner";
import FormSuccess from "./components/form_success";
function App() {
  const [config, setConfig] = useState(null);
  const initializeForm = useFormStore((state) => state.initializeForm);
  const [remainingTime, setRemainingTime] = useState(0);
  const resetForm = useFormStore((state) => state.resetForm);
  const isLoading = useFormStore((state) => state.isLoadingGlobal);
  const setLoadingState = useFormStore((state) => state.setLoadingData);
  const isSubmitted = useFormStore((state) => state.isSubmitted);
  useEffect(() => {
    setLoadingState(true);
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
        setLoadingState(false);
        console.log("Form Configuration:", configData);
        // You can now use configData in your application
      } catch (error) {
        console.error("Fetch error:", error); // Handle errors
      }
    };

    // Call the fetch function
    fetchFormConfig();
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

  if (isLoading)
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
  if (config != null && !isLoading && !isSubmitted)
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
  if (isSubmitted) return <FormSuccess></FormSuccess>;
}

export default App;
