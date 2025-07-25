import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, Home, List, Camera } from 'lucide-react';
import bannerImage from '../assets/logo.svg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Plant List', path: '/plants', icon: List },
    { name: 'Scan Plants', path: '/scan', icon: Camera },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={bannerImage}
              alt="Plant Identifier"
              className="w-10 h-10 object-contain"
            />
            <span 
              style={{
                color: '#333D29',
                fontFamily: 'HUMANISM-DEMO',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: '700',
                lineHeight: '150%', /* 24px */
                letterSpacing: '-0.48px'
              }}
            >
              Lestari.in
            </span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors duration-200"
                >
                  <IconComponent size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-3 py-3 text-gray-700 hover:text-green-600 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Header;