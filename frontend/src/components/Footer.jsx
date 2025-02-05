const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6 sm:px-12 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-xl font-bold mb-4">EduTrack</h4>
          <p className="text-gray-400">Streamline attendance tracking with advanced facial recognition technology.</p>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4">Quick Links</h4>
          <div className="space-y-2">
            <a href="#" className="text-gray-400 hover:text-white block">Home</a>
            <a href="#" className="text-gray-400 hover:text-white block">Features</a>
            <a href="#" className="text-gray-400 hover:text-white block">About</a>
            <a href="#" className="text-gray-400 hover:text-white block">Contact</a>
          </div>
        </div>
        <div>
          <h4 className="text-xl font-bold mb-4">Contact</h4>
          <p className="text-gray-400">support@edutrack.india</p>
          <p className="text-gray-400">+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="container mx-auto px-6 sm:px-12 mt-8 pt-4 border-t border-gray-800 text-center">
        <p className="text-gray-500">© 2024 EduTrack. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
