// src/components/FormField.js
import React from "react";
import useFormStore from "../stateManagementController/zustland_hook";

function FormField({ field }) {
  const { name, label, type, options, allowCustomInput } = field;
  const setFormData = useFormStore((state) => state.setFormData);
  const formData = useFormStore((state) => state.formData);

  const handleChange = (event) => {
    setFormData(name, event.target.value);
  };

  return (
    <div>
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
        <select value={formData[name] || ""} onChange={handleChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {allowCustomInput && <option value="custom">Custom</option>}
        </select>
      )}
      {allowCustomInput && formData[name] === "custom" && (
        <input
          type="text"
          placeholder="Enter custom value"
          onChange={(e) => setFormData(name, e.target.value)}
        />
      )}
    </div>
  );
}

export default FormField;
