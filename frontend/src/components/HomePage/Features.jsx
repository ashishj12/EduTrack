import React from 'react';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

const Features = () => {
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
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose EduTrack?</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center space-y-4 p-6 rounded-lg hover:shadow-lg transition">
            <div className="flex justify-center">{feature.icon}</div>
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
