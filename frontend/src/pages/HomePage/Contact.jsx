import React from "react";
import { Mail, Phone } from "lucide-react"; 
import { Link } from "react-router-dom"; 

const Contact = () => {
  const teamMembers = [
    {
      name: "Lokendra Singh",
      role: "ML Engineer",
      email: "edutrack086@gmail.com",
      phone: "+91 8209874519",
    },
    {
      name: "Uttam Kumar",
      role: "Data Analytics ",
      email: "edutrack086@gmail.com",
      phone: "+91 7393000914",
    },
    {
      name: "Ashish Kumar",
      role: "Website Developer",
      email: "edutrack086@gmail.com",
      phone: "+91 8690869917",
    },
    {
      name: "Tanishk Saini",
      role: "App Developer",
      email: "edutrack086@gmail.com",
      phone: "+91 9782150028",
    },
    {
      name: "Utkarsh Verma",
      role: "UI/UX Designer",
      email: "edutrack086@gmail.com",
      phone: "+91 8824557829",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white shadow-md">
        <div className="container mx-auto px-6 sm:px-12 flex justify-between items-center py-4">
          <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary cursor-pointer">
              EduTrack
            </Link>          
          </div>

          {/* Navbar Links */}
          <div className={`md:flex space-x-8`}>
            <Link
              to="/"
              className="text-gray-700 hover:text-primary transition">
              Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 sm:px-12 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Contact Our Team
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600 mb-2">{member.role}</p>
              <div className="flex justify-center items-center space-x-2 mb-2">
                <Mail className="text-blue-600" size={20} />
                <a
                  href={`mailto:${member.email}`}
                  className="text-gray-700 hover:text-blue-600">
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

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <span className="text-2xl font-bold text-primary">EduTrack</span>
            <p className="mt-2 text-gray-400">
              Revolutionizing Attendance Management
            </p>
          </div>

          <div className="mt-8 md:mt-0 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 EduTrack. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
