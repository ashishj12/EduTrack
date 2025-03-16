import React, { useCallback, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { CheckCircle2, Clock, ShieldCheck, Menu, X } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = useCallback((type) => {
    navigate(`/login/${type}`);
  }, [navigate]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 sm:px-12 flex justify-between items-center">
          <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-primary cursor-pointer">
              EduTrack
            </Link>  
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation links */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-primary transition font-medium">Features</a>
            <a href="#about" className="text-gray-700 hover:text-primary transition font-medium">About</a>
            <Link to="/Contact" className="hover:text-primary transition">Contact</Link> 
          </div>
        
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-full left-0 w-full animate-fadeIn">
            <div className="flex flex-col px-6 py-4 space-y-4">
              <a href="#features" className="text-gray-700 hover:text-primary py-2 transition font-medium">Features</a>
              <a href="#about" className="text-gray-700 hover:text-primary py-2 transition font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-primary py-2 transition font-medium">Contact</a>
              <hr className="border-gray-200" />
              {/* <div className="flex flex-col space-y-3">
                <button
                  onClick={() => handleLoginClick("Student")}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm w-full">
                  Student Login
                </button>
                <button
                  onClick={() => handleLoginClick("faculty")}
                  className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-blue-50 transition text-sm w-full">
                  Faculty Login
                </button>
              </div> */}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 sm:px-12 py-8 md:py-16 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
  <div className="w-full md:w-1/2 space-y-4">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">Revolutionize</span> Your Attendance System with Image-Based Recognition
    </h1>
    <p className="text-gray-600 text-lg sm:text-xl max-w-xl">
      Save time and increase accuracy with automated attendance tracking using advanced facial recognition technology.
    </p>
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
      <button
        onClick={() => handleLoginClick("Student")}
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
      >
        Student Login <ChevronRight className="ml-2" />
      </button>
      <button
        onClick={() => handleLoginClick("faculty")}
        className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-blue-50 transition flex items-center justify-center w-full sm:w-auto shadow-md hover:shadow-lg transform hover:-translate-y-1"
      >
        Faculty Login <ChevronRight className="ml-2" />
      </button>
    </div>
  </div>

  {/* Right Column - Image */}
  <div className="w-full md:w-1/2">
    <div className="relative">
      <div className="absolute -top-4 -left-4 w-28 h-28 bg-blue-100 rounded-full opacity-50 -z-10"></div>
      <div className="absolute -bottom-4 -right-4 w-28 h-28 bg-blue-100 rounded-full opacity-50 -z-10"></div>
      <img 
        src="https://img.freepik.com/free-photo/standard-quality-control-collage_23-2149631014.jpg?t=st=1738722658~exp=1738726258~hmac=b66e8bfbdeb2139d616632fed242ae9bab490ed3b7800ad4f670a3643af45423&w=740" 
        alt="EduTrack Interface" 
        className="w-full rounded-lg shadow-2xl object-cover"
      />
    </div>
  </div>
</div>


      {/* Features Section */}
      <div id="features" className="bg-white py-16 md:py-24 mt-0">
  <div className="container mx-auto px-6 sm:px-12 text-center">
    <h2 className="text-3xl sm:text-4xl font-bold mb-3">
      Why Choose <span className="text-primary">EduTrack</span>?
    </h2>
    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
      Our platform offers cutting-edge features designed to streamline attendance management
    </p>
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="p-6 bg-white shadow-lg rounded-lg space-y-4 hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="flex justify-center">{feature.icon}</div>
          <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  </div>
</div>


      {/* About Section */}
      <div id="about" className="bg-gray-50 py-8 md:py-16">
  <div className="container mx-auto px-6 lg:px-16">
    <div className="text-center mb-8">
      <span className="text-primary font-semibold text-sm uppercase tracking-wider">Learn More</span>
      <h2 className="text-4xl font-extrabold text-gray-800 mt-2 mb-4">About EduTrack</h2>
      <div className="w-16 h-1 bg-blue-600 mx-auto mb-4"></div>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        EduTrack is at the forefront of revolutionizing attendance tracking with advanced facial recognition technology. 
        Our goal is to make attendance management seamless, accurate, and secure for educational institutions worldwide.
      </p>
    </div>

    {/* Our Mission Section */}
    <section className="mb-8 flex flex-col md:flex-row items-center md:space-x-8">
      <div className="w-full md:w-1/2 mb-6 md:mb-0">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <img 
            src="https://img.freepik.com/free-vector/bill-analysis-concept-illustration_114360-19348.jpg?t=st=1742057104~exp=1742060704~hmac=395a0ad1cc2b4e5ce24ac93df213952e880de43e466aaa2b7ab8293a4242861a&w=740" 
            alt="Mission"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2">
        <h3 className="text-3xl font-semibold text-blue-600 mb-4">Our Mission</h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Our mission is to streamline attendance tracking by eliminating manual processes and leveraging cutting-edge 
          technology for high accuracy and efficiency. We aim to reduce administrative burden and provide educational institutions 
          with an easy-to-use, reliable solution to manage attendance in real time.
        </p>
      </div>
    </section>

    {/* Core Values Section */}
    <section className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-3xl font-semibold text-blue-600 mb-4 text-center">Our Core Values</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-4xl text-blue-600 mb-4 bg-blue-50 h-16 w-16 flex items-center justify-center rounded-full mx-auto">🔒</div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Security</h4>
          <p className="text-gray-600">
            We prioritize security, ensuring sensitive data is kept private and protected at all times.
          </p>
        </div>
        <div className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-4xl text-blue-600 mb-4 bg-blue-50 h-16 w-16 flex items-center justify-center rounded-full mx-auto">⏰</div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Efficiency</h4>
          <p className="text-gray-600">
            Our system saves time and effort by automating the attendance process, so you can focus on what matters most.
          </p>
        </div>
        <div className="text-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="text-4xl text-blue-600 mb-4 bg-blue-50 h-16 w-16 flex items-center justify-center rounded-full mx-auto">🤖</div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h4>
          <p className="text-gray-600">
            We are constantly evolving, using AI and machine learning to improve accuracy and reliability.
          </p>
        </div>
      </div>
    </section>

    {/* Technology Section */}
    <section className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-3xl font-semibold text-blue-600 mb-4 text-center">The Technology Behind EduTrack</h3>
      <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
      <p className="text-lg text-gray-700 leading-relaxed mb-6">
        EduTrack uses state-of-the-art facial recognition technology paired with AI-driven algorithms to ensure
        a seamless and highly accurate attendance process. Our platform is built to handle high traffic and
        integrate easily into existing infrastructure at educational institutions.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">AI Recognition</span>
        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">Cloud Processing</span>
        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">Scalability</span>
        <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">Security First</span>
      </div>
    </section>
  </div>
</div>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <span className="text-2xl font-bold text-primary">EduTrack</span>
            <p className="mt-2 text-gray-400">Revolutionizing Attendance Management
              </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <a href="#features" className="text-gray-300 hover:text-primary transition">Features</a>
            <a href="#about" className="text-gray-300 hover:text-primary transition">About</a>
            <Link to="/Contact" className="text-gray-300 hover:text-primary transition">Contact</Link> 
          </div>
          <div className="mt-8 md:mt-0 text-center">
            <p className="text-gray-400 text-sm">&copy; 2025 EduTrack. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;