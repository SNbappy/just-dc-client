import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* About Column */}
          <div>
            <h3 className="font-heading font-bold text-2xl mb-4">JUST Debate Club</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering voices, sharpening minds, and building leaders through the art of debate since 2008.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-primary bg-opacity-20 hover:bg-primary rounded-lg flex items-center justify-center transition-all">
                <FaFacebook className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary bg-opacity-20 hover:bg-primary rounded-lg flex items-center justify-center transition-all">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary bg-opacity-20 hover:bg-primary rounded-lg flex items-center justify-center transition-all">
                <FaInstagram className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary bg-opacity-20 hover:bg-primary rounded-lg flex items-center justify-center transition-all">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="#" className="w-10 h-10 bg-primary bg-opacity-20 hover:bg-primary rounded-lg flex items-center justify-center transition-all">
                <FaYoutube className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-300 hover:text-primary transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-300 hover:text-primary transition-colors">Gallery</Link>
              </li>
              <li>
                <Link to="/members" className="text-gray-300 hover:text-primary transition-colors">Members</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">Debate Guidelines</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">Tournament Rules</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">Training Materials</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">Past Events</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">Achievements</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  Jashore University of Science & Technology, Jashore-7408, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a href="mailto:info@justdebateclub.org" className="text-gray-300 hover:text-primary transition-colors">
                  info@justdebateclub.org
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href="tel:+8801234567890" className="text-gray-300 hover:text-primary transition-colors">
                  +880 1234-567890
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} JUST Debate Club. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
