// src/components/FormField.js
import React, { useState } from "react";
import useFormStore from "../stateManagementController/zustland_hook";
import "./form_field.css";
function FormField({ field }) {
  const { name, label, type, options, allowCustomInput } = field;
  const setFormData = useFormStore((state) => state.setFormData);
  const formData = useFormStore((state) => state.formData);
  const [isCustomInput, setCustomInput] = useState(false);
  const handleChange = (event) => {
    console.log(`HERE IS THE EVENT VALUE => ${event.target.value}`);
    if (event.target.value === "custom") {
      setCustomInput(true);
    } else {
      setCustomInput(false);
    }
    setFormData(name, event.target.value);
  };

  return (
    <div className="formField">
      <label>{label}</label>
      {type === "text" && (
        <input
          type="text"
          value={formData[name] || ""}
          onChange={handleChange}
        />
      )}
      {type === "number" && (
        <input
          type="number"
          value={formData[name] || ""}
          onChange={handleChange}
        />
      )}
      {type === "select" && (
        <select
          value={isCustomInput ? "custom" : formData[name] || ""}
          onChange={handleChange}
        >
          <option value="" disabled>
            {label}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {allowCustomInput && <option value="custom">Custom</option>}
        </select>
      )}
      {allowCustomInput && isCustomInput && (
        <input
          type="text"
          placeholder="Enter custom value"
          className="custom-input"
          onChange={(e) => {
            setFormData(name, e.target.value);
          }}
        />
      )}
    </div>
  );
}

export default FormField;
