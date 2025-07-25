import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Leaf, Heart, Info, Star, Shield } from 'lucide-react';

const PlantModal = ({ plant, isOpen, onClose }) => {
  if (!plant) return null;

  const getConservationStatusInfo = (status) => {
    const statusMap = {
      'EN': { 
        label: 'Endangered', 
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'Species facing a very high risk of extinction'
      },
      'VU': { 
        label: 'Vulnerable', 
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        description: 'Species facing a high risk of extinction'
      },
      'CR': { 
        label: 'Critically Endangered', 
        color: 'bg-red-200 text-red-900 border-red-300',
        description: 'Species facing an extremely high risk of extinction'
      },
      'LC': { 
        label: 'Least Concern', 
        color: 'bg-green-100 text-green-800 border-green-200',
        description: 'Species with stable populations'
      },
      'NT': { 
        label: 'Near Threatened', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Species close to qualifying for threatened status'
      }
    };
    return statusMap[status] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      description: 'Conservation status information not available'
    };
  };

  const conservationInfo = getConservationStatusInfo(plant.conservationStatus);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-20 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>

              {/* Main Content */}
              <div className="p-8 bg-white">
                
                {/* Header Section */}
                <div className="relative mb-12">
                  {/* Decorative Background Shape - Organic like homepage */}
                  <div className="absolute -top-8 -right-12 w-64 h-32 bg-green-100/60 rounded-full blur-2xl"></div>
                  
                  {/* Center Image */}
                  <div className="flex justify-center relative">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                      className="relative"
                    >
                      {/* Main Image with clean styling */}
                      <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                        <img
                          src={plant.imageUrl}
                          alt={plant.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&crop=center';
                          }}
                        />
                      </div>
                      
                      {/* Plant Name Card - Clean design */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl p-6 shadow-lg border border-gray-200 min-w-max"
                      >
                        <h2 className="font-bold text-2xl text-gray-800 text-center mb-2">{plant.name}</h2>
                        <p className="text-sm italic text-gray-600 text-center">{plant.scientificName}</p>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>

                {/* Information Cards - Clean and minimal */}
                <div className="space-y-8 mt-16">
                  
                  {/* Description Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="bg-green-800 rounded-full p-3">
                        <Info className="text-white" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Description</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {plant.description}
                    </p>
                  </motion.div>

                  {/* Two Column Layout for other info */}
                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Region & Habitat */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="bg-green-800 rounded-full p-3">
                          <MapPin className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Endemic Region</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-semibold">
                            {plant.region}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                          This plant is endemic to {plant.region}, Indonesia. Found in tropical rainforests and unique ecosystems of this region.
                        </p>
                      </div>
                    </motion.div>

                    {/* Conservation Status */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                    >
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="bg-green-800 rounded-full p-3">
                          <Shield className="text-white" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Conservation Status</h3>
                      </div>
                      <div className="space-y-4">
                        <div className={`p-4 rounded-xl border ${conservationInfo.color}`}>
                          <div className="font-semibold mb-2">{conservationInfo.label}</div>
                          <p className="text-sm">{conservationInfo.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Benefits & Uses Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="bg-green-800 rounded-full p-3">
                        <Heart className="text-white" size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">Benefits & Uses</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {plant.benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                          className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl"
                        >
                          <div className="w-2 h-2 bg-green-800 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-700">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Plant Information Summary - 2 columns only */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.4 }}
                      className="bg-blue-50 border border-blue-200 rounded-2xl p-6"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Leaf className="text-blue-600" size={20} />
                        </div>
                        <h4 className="font-semibold text-blue-800">Scientific Name</h4>
                      </div>
                      <p className="text-blue-700 italic font-medium">{plant.scientificName}</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.4 }}
                      className="bg-green-50 border border-green-200 rounded-2xl p-6"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <MapPin className="text-green-600" size={20} />
                        </div>
                        <h4 className="font-semibold text-green-800">Endemic Region</h4>
                      </div>
                      <p className="text-green-700 font-medium">{plant.region}, Indonesia</p>
                    </motion.div>
                  </div>

                  {/* Bottom Action Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="bg-gray-50 rounded-2xl p-8"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                      <div className="flex items-center space-x-6">
                        <div className="bg-green-800 text-white px-6 py-3 rounded-full">
                          <span className="font-semibold">
                            Endemic Plant of Indonesia
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-green-800">
                          <Star size={20} />
                          <span className="font-semibold">Verified Species</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-800 hover:bg-green-900 text-white px-8 py-3 rounded-md font-semibold transition-colors"
                        >
                          Add to Favorites
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-white hover:bg-gray-50 text-green-800 px-8 py-3 rounded-md font-semibold border-2 border-green-800 transition-colors"
                        >
                          Learn More
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>

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