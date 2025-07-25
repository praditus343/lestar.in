import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Loader } from 'lucide-react';
import PlantModal from '../components/PlantModal';

const Plants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'https://lestarin-be-production.up.railway.app';

  // Region categories
  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'Sumatera', label: 'Sumatera' },
    { value: 'Jawa', label: 'Jawa' },
    { value: 'Kalimantan', label: 'Kalimantan' },
    { value: 'Sulawesi', label: 'Sulawesi' },
    { value: 'Papua', label: 'Papua' },
    { value: 'Nusa Tenggara', label: 'Nusa Tenggara' },
    { value: 'Maluku', label: 'Maluku' }
  ];

  // Fetch plants data
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let url = `${BASE_URL}/api/plants/`;
        
        // If specific region is selected, use region endpoint
        if (selectedRegion !== 'all') {
          url = `${BASE_URL}/api/plants/region/${selectedRegion}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch plants data');
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
          setPlants(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching plants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [selectedRegion]);

  // Filter plants based on search term
  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.region.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Transform API data to match PlantModal expectations
  const transformPlantData = (plant) => ({
    ...plant,
    image: plant.imageUrl,
    category: plant.region.toLowerCase(),
    characteristics: plant.benefits.slice(0, 3), // Use benefits as characteristics
    habitat: `Endemic to ${plant.region}, Indonesia`,
    uses: plant.benefits
  });

  const getConservationStatusLabel = (status) => {
    const statusMap = {
      'EN': 'Endangered',
      'VU': 'Vulnerable', 
      'CR': 'Critically Endangered',
      'LC': 'Least Concern',
      'NT': 'Near Threatened'
    };
    return statusMap[status] || status;
  };

  const getConservationColor = (status) => {
    const colorMap = {
      'EN': 'bg-red-100 text-red-800 border-red-200',
      'VU': 'bg-orange-100 text-orange-800 border-orange-200',
      'CR': 'bg-red-200 text-red-900 border-red-300',
      'LC': 'bg-green-100 text-green-800 border-green-200',
      'NT': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Endemic Plants Database
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore Indonesia's unique endemic plant species across different regions with detailed information about their conservation status and benefits
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search plant name, scientific name, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-green-800 appearance-none bg-white min-w-[200px]"
              >
                {regions.map(region => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader className="w-12 h-12 text-green-800 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading endemic plants...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <p className="text-red-600 font-semibold">Error loading plants data</p>
              <p className="text-red-500 text-sm mt-2">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredPlants.length} of {plants.length} endemic plants
              {selectedRegion !== 'all' && ` from ${selectedRegion}`}
            </p>
          </div>
        )}

        {/* Plants Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedPlant(transformPlantData(plant))}
              >
                <div className="relative">
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-56 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-green-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {plant.region}
                  </div>
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${getConservationColor(plant.conservationStatus)}`}>
                    {getConservationStatusLabel(plant.conservationStatus)}
                  </div>
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                    <Eye className="text-white" size={24} />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {plant.name}
                  </h3>
                  <p className="text-sm text-green-800 italic mb-3 font-medium">
                    {plant.scientificName}
                  </p>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-4">
                    {plant.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-800 font-semibold text-sm hover:text-green-900">
                      View Details →
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {plant.benefits.slice(0, 2).map((benefit, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredPlants.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
               Data is being completed
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or selecting a different region.
            </p>
          </div>
        )}
      </div>

      {/* Plant Modal */}
      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          isOpen={!!selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
};

export default Plants;