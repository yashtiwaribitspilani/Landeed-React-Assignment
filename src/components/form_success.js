import React from "react";
import "./form_success.css"; // Import the CSS file

const FormSuccess = () => {
  const handleRefill = () => {
    window.location.reload(); // Change to your form URL
  };

  return (
    <div className="form-success-container">
      <div className="form-success-icon">✅</div>
      <h1 className="form-success-title">Form Submitted Successfully!</h1>
      <p className="form-success-message">
        Thank you for filling out the form. Your response has been recorded.
      </p>
      <button className="form-success-button" onClick={handleRefill}>
        Re-fill Form
      </button>
      <div className="form-success-footer-note">
        <p>
          Need to submit a different response? Click the button above to re-fill
          the form.
        </p>
      </div>
    </div>
  );
};

export default FormSuccess;
