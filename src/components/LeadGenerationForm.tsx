// src/components/LeadGenerationForm.tsx
"use client"; // Required for event handlers and state

import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const LeadGenerationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Lead Form Data:', formData);
    // Here you would typically send the data to a backend service
    alert('Form submitted! Check the console for data.');
    // Reset form after submission
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    });
  };

  const inputStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: '5px',
    display: 'block',
    fontWeight: 'bold',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#0070f3',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" style={labelStyle}>Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" style={labelStyle}>Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="message" style={labelStyle}>Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            style={{ ...inputStyle, minHeight: '100px' }}
            required
          />
        </div>
        <button type="submit" style={buttonStyle}>Submit</button>
      </form>
    </div>
  );
};

export default LeadGenerationForm;
