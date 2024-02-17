import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Assuming react-router-dom is used for routing

interface FormData {
  first_name: string;
  last_name: string;
  headline: string;
  current_company: string;
  highest_education: string;
  country_of_residence: string;
  residence: string;
  email_address: string;
  phone_number: string;
  date_of_birth: string;
  personal_website_link: string;
}

const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    headline: "",
    current_company: "",
    highest_education: "",
    country_of_residence: "",
    residence: "",
    email_address: "",
    phone_number: "",
    date_of_birth: "",
    personal_website_link: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_key, value]) => value !== "")
      );

      const response = await axios.post(
        "http://localhost:8001/user/profile",
        filteredData,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setFormData((prevState) => ({
        ...prevState,
        ...filteredData, // Update only the fields that were sent
      }));
      navigate("/profile");
    } catch (error) {
      console.error("Error while submitting form:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col justify-center items-center text-white w-1/2 h-3/4 mx-auto">
      <Link to="/profile" className=" top-0 left-0 mt-4 ml-4">
        <button
          type="submit"
          className="btn-submit bg-lBlue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </Link>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md mx-auto bg-black text-white rounded-lg shadow-md p-8"
      >
        <div className="mb-4">
          <label htmlFor="first_name" className="block mb-2">
            First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="last_name" className="block mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="headline" className="block mb-2">
            Headline
          </label>
          <input
            type="text"
            id="headline"
            name="headline"
            value={formData.headline}
            onChange={handleChange}
            placeholder="Enter your headline"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="current_company" className="block mb-2">
            Company
          </label>
          <input
            type="text"
            id="current_company"
            name="current_company"
            value={formData.current_company}
            onChange={handleChange}
            placeholder="Enter your company name"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="highest_education" className="block mb-2">
            Institute
          </label>
          <input
            type="text"
            id="highest_education"
            name="highest_education"
            value={formData.highest_education}
            onChange={handleChange}
            placeholder="Enter your institute name"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="country_of_residence" className="block mb-2">
            Country
          </label>
          <input
            type="text"
            id="country_of_residence"
            name="country_of_residence"
            value={formData.country_of_residence}
            onChange={handleChange}
            placeholder="Enter your country of residence"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="residence" className="block mb-2">
            Residence
          </label>
          <input
            type="text"
            id="residence"
            name="residence"
            value={formData.residence}
            onChange={handleChange}
            placeholder="Enter your residence"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email_address" className="block mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email_address"
            name="email_address"
            value={formData.email_address}
            onChange={handleChange}
            placeholder="Enter your email address"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone_number" className="block mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date_of_birth" className="block mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            placeholder="Select your date of birth"
            className="input-field w-full mb-2 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="personal_website_link" className="block mb-2">
            Portfolio LInk
          </label>
          <input
            type="url"
            id="personal_website_link"
            name="personal_website_link"
            value={formData.personal_website_link}
            onChange={handleChange}
            placeholder="Enter your website link"
            className="input-field w-full mb-10 p-2 border border-gray-400 rounded text-black placeholder-gray-500"
          />
        </div>

        <button
          type="submit"
          className="btn-submit bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
