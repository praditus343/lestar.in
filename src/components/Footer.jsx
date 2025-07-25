import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiInstagram, FiGithub } from "react-icons/fi";
import bannerImage from '../assets/logo.svg';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-white py-8 mt-12"
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start">
        <div className="flex flex-col space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3"
          >
            <img 
              src={bannerImage} 
              alt="Lestar.in Logo" 
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-green-400">Lestar.in</span>
          </Link>
          <div className="text-gray-400 text-sm">
            Identify plants easily and accurately
          </div>
          <div className="text-gray-400 text-sm">&copy; 2025 Lestar.in. All rights reserved.</div>
        </div>
        <div className="flex space-x-16 mt-8 md:mt-0">
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              {[
                { path: "/", name: "Home" }, 
                { path: "/plants", name: "Plant List" }, 
                { path: "/scan", name: "Scan Plants" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white font-medium cursor-pointer transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-4">Social Media</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white font-medium flex items-center space-x-2 transition-colors"
                >
                  <FiInstagram className="text-xl" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white font-medium flex items-center space-x-2 transition-colors"
                >
                  <FiGithub className="text-xl" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;