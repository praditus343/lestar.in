import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Leaf, Heart, Info } from 'lucide-react';

const PlantModal = ({ plant, isOpen, onClose }) => {
  if (!plant) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="min-h-screen px-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-1/2">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>

                {/* Details Section */}
                <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto max-h-[90vh] lg:max-h-none">
                  <div className="space-y-6">
                    {/* Header */}
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {plant.name}
                      </h2>
                      <p className="text-lg text-gray-500 italic mb-4">
                        {plant.scientificName}
                      </p>
                      <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {plant.category.charAt(0).toUpperCase() + plant.category.slice(1)}
                      </span>
                    </div>

                    {/* Description */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Info className="text-blue-500" size={20} />
                        <h3 className="text-lg font-semibold text-gray-800">Deskripsi</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {plant.description}
                      </p>
                    </div>

                    {/* Characteristics */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Leaf className="text-green-500" size={20} />
                        <h3 className="text-lg font-semibold text-gray-800">Karakteristik</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plant.characteristics.map((char, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Habitat */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="text-red-500" size={20} />
                        <h3 className="text-lg font-semibold text-gray-800">Habitat</h3>
                      </div>
                      <p className="text-gray-600">
                        {plant.habitat}
                      </p>
                    </div>

                    {/* Uses */}
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Heart className="text-pink-500" size={20} />
                        <h3 className="text-lg font-semibold text-gray-800">Kegunaan</h3>
                      </div>
                      <ul className="space-y-1">
                        {plant.uses.map((use, index) => (
                          <li key={index} className="text-gray-600 flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            <span>{use}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                      <button className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                        Simpan ke Favorit
                      </button>
                      <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Bagikan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PlantModal;
