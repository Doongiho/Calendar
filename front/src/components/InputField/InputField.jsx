import React from "react";
import "./InputField.css";

export default function InputField({ id, type, value, onChange, placeholder, label }) {
  return (
    <div className="input-field">
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="input-box"
        placeholder={placeholder}
      />
    </div>
  );
}
