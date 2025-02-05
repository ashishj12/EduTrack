import React from "react";
import { Mail, Phone } from "lucide-react";

const Contact = () => {
  const teamMembers = [
    {
      name: "Rahul Sharma",
      role: "CEO",
      email: "rahul@edutrack.com",
      phone: "+91 9876543210",
    },
    {
      name: "Priya Patel",
      role: "CTO",
      email: "priya@edutrack.com",
      phone: "+91 9988776655",
    },
    {
      name: "Amit Kumar",
      role: "Head of Product",
      email: "amit@edutrack.com",
      phone: "+91 9123456789",
    },
    {
      name: "Sneha Gupta",
      role: "Design Lead",
      email: "sneha@edutrack.com",
      phone: "+91 9087654321",
    },
    {
      name: "Vikram Singh",
      role: "Marketing Director",
      email: "vikram@edutrack.com",
      phone: "+91 9234567890",
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
