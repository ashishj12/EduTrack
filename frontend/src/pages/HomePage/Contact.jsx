import React from "react";
import { Mail, Phone } from "lucide-react";

const Contact = () => {
  const teamMembers = [
    {
      name: "Lokendra Singh",
      role: "ML Enginner",
      email: "sbcet@edutrack.com",
      phone: "+91 8209874519",
    },
    {
      name: "Uttam Kumar",
      role: "Data Analytics ",
      email: "sbcet@edutrack.com",
      phone: "+91 7393000914",
    },
    {
      name: "Ashish Kumar",
      role: "Backend and Frontend Developer",
      email: "sbcet@edutrack.com",
      phone: "+91 8690869917",
    },
    {
      name: "Tanish Saini",
      role: "Backend and Frontend Developer",
      email: "sbcet@edutrack.com",
      phone: "+91 9782150028",
    },
    {
      name: "Utkarsh Verma",
      role: "UI/UX Designer",
      email: "sbcet@edutrack.com",
      phone: "+91 8824557829",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Contact Our Team</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
            <p className="text-gray-600 mb-2">{member.role}</p>
            <div className="flex justify-center items-center space-x-2 mb-2">
              <Mail className="text-blue-600" size={20} />
              <a href={`mailto:${member.email}`} className="text-gray-700 hover:text-blue-600">
                {member.email}
              </a>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <Phone className="text-blue-600" size={20} />
              <span className="text-gray-700">{member.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact;
