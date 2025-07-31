import { useState } from 'react';
import { BASE_URL } from '../../utils';

const EmergencyContact = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    relation: '',
    contact_name: '',
    phone_number: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setError('');
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (!formData[key]) {
        setError(`Please fill in the "${key.replace('_', ' ')}" field.`);
        return;
      }
    }

    try {
      const response = await fetch(`${BASE_URL}/emergency_contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Something went wrong');
      }

      setSubmitted(true);
      setFormData({
        user_id: '',
        relation: '',
        contact_name: '',
        phone_number: '',
        email: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Emergency Contact Form</h2>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {submitted && <p className="text-green-600 text-sm mb-3"> Contact submitted successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          value={formData.user_id}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="relation"
          placeholder="Relation (e.g. Mother)"
          value={formData.relation}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="contact_name"
          placeholder="Contact Name"
          value={formData.contact_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Contact
        </button>
      </form>
    </div>
  );
};

export default EmergencyContact;

