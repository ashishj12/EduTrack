import React from "react";
import { ChevronRight } from "lucide-react";
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';  // Importing icons for Features

const Home = () => {
  const features = [
    {
      icon: <CheckCircle2 className="text-blue-600 w-12 h-12" />,
      title: "Accurate Recognition",
      description: "Advanced facial recognition technology ensures precise attendance tracking with 99% accuracy."
    },
    {
      icon: <Clock className="text-blue-600 w-12 h-12" />,
      title: "Time-Saving",
      description: "Automate attendance tracking and save valuable time for both faculty and students."
    },
    {
      icon: <ShieldCheck className="text-blue-600 w-12 h-12" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security measures protect sensitive data and ensure privacy."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="container mx-auto px-6 sm:px-12 py-16 flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-12">
        {/* Left Side Text and Buttons */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight">
            Revolutionize Your Attendance System with Image-Based Recognition
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl">
            Save time and increase accuracy with automated attendance tracking using advanced facial recognition technology.
          </p>
          <div className="flex space-x-6 mt-6">
            <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center">
              Student Login <ChevronRight className="ml-2" />
            </button>
            <button className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-blue-50 transition flex items-center">
              Faculty Login <ChevronRight className="ml-2" />
            </button>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="w-full md:w-1/2">
          <img
            src="https://img.freepik.com/free-photo/standard-quality-control-collage_23-2149631014.jpg?t=st=1738722658~exp=1738726258~hmac=b66e8bfbdeb2139d616632fed242ae9bab490ed3b7800ad4f670a3643af45423&w=740"
            alt="EduTrack Interface"
            className="w-full rounded-lg shadow-xl"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 sm:px-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Why Choose EduTrack?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {/* Map through the features */}
            {features.map((feature, index) => (
              <div key={index} className="p-6 bg-white shadow-lg rounded-lg space-y-4">
                <div className="flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section (Rest of Benefits) */}
      
    </div>
  );
};

export default Home;
