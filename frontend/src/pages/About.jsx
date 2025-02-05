import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 py-16 pl-6 lg:pl-16">
      {/* Container */}
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-4">About EduTrack</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            EduTrack is at the forefront of revolutionizing attendance tracking with advanced facial recognition technology. 
            Our goal is to make attendance management seamless, accurate, and secure for educational institutions worldwide.
          </p>
        </div>

        {/* Our Mission Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-semibold text-blue-600 mb-6">Our Mission</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Our mission is to streamline attendance tracking by eliminating manual processes and leveraging cutting-edge 
            technology for high accuracy and efficiency. We aim to reduce administrative burden and provide educational institutions 
            with an easy-to-use, reliable solution to manage attendance in real time.
          </p>
        </section>

        {/* Our Values Section */}
        <section className="bg-blue-50 p-8 rounded-lg shadow-md mb-16">
          <h3 className="text-3xl font-semibold text-blue-600 mb-6">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-4">🔒</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Security</h4>
              <p className="text-gray-600">
                We prioritize security, ensuring sensitive data is kept private and protected at all times.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-4">⏰</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Efficiency</h4>
              <p className="text-gray-600">
                Our system saves time and effort by automating the attendance process, so you can focus on what matters most.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-4">🤖</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h4>
              <p className="text-gray-600">
                We are constantly evolving, using AI and machine learning to improve accuracy and reliability.
              </p>
            </div>
          </div>
        </section>

        {/* Our Technology Section */}
        <section>
          <h3 className="text-3xl font-semibold text-blue-600 mb-6 text-center">The Technology Behind EduTrack</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            EduTrack uses state-of-the-art facial recognition technology paired with AI-driven algorithms to ensure
            a seamless and highly accurate attendance process. Our platform is built to handle high traffic and
            integrate easily into existing infrastructure at educational institutions.
          </p>
        </section>

        {/* Our Vision Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-semibold text-blue-600 mb-6">Our Vision</h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            At EduTrack, we envision a future where traditional methods of attendance tracking are replaced by seamless,
            automated, and secure systems. We strive to make institutions more efficient and provide students and faculty
            with a better experience.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
