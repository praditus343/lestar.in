import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye } from 'lucide-react';
import PlantModal from '../components/PlantModal';

const Plants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Data dummy tumbuhan
  const plantsData = [
    {
      id: 1,
      name: 'Mawar Merah',
      scientificName: 'Rosa rubiginosa',
      category: 'bunga',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      description: 'Mawar merah adalah simbol cinta dan kasih sayang. Bunga ini memiliki aroma yang harum dan kelopak yang indah.',
      characteristics: ['Berduri', 'Harum', 'Berbunga sepanjang tahun'],
      habitat: 'Taman, kebun, daerah beriklim sedang',
      uses: ['Dekorasi', 'Parfum', 'Obat tradisional']
    },
    {
      id: 2,
      name: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      category: 'hias',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      description: 'Tanaman hias populer dengan daun berlubang yang unik. Mudah dirawat dan cocok untuk interior.',
      characteristics: ['Daun berlubang', 'Merambat', 'Tahan naungan'],
      habitat: 'Hutan tropis, dalam ruangan',
      uses: ['Dekorasi interior', 'Pembersih udara']
    },
    {
      id: 3,
      name: 'Lidah Buaya',
      scientificName: 'Aloe vera',
      category: 'obat',
      image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400',
      description: 'Tanaman sukulen dengan gel yang bermanfaat untuk kesehatan kulit dan pengobatan.',
      characteristics: ['Sukulen', 'Berdaging tebal', 'Tahan kekeringan'],
      habitat: 'Daerah kering, gurun',
      uses: ['Obat luka', 'Kosmetik', 'Perawatan kulit']
    },
    {
      id: 4,
      name: 'Lavender',
      scientificName: 'Lavandula angustifolia',
      category: 'herbal',
      image: 'https://images.unsplash.com/photo-1571424530218-b1c5c26a7ae2?w=400',
      description: 'Tanaman herbal dengan aroma menenangkan, sering digunakan untuk aromaterapi dan relaksasi.',
      characteristics: ['Harum', 'Bunga ungu', 'Tahan kekeringan'],
      habitat: 'Mediterania, daerah kering',
      uses: ['Aromaterapi', 'Teh herbal', 'Obat penenang']
    },
    {
      id: 5,
      name: 'Kaktus Pir Berduri',
      scientificName: 'Opuntia ficus-indica',
      category: 'sukulen',
      image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400',
      description: 'Kaktus dengan bentuk pipih seperti pir, memiliki duri dan buah yang dapat dimakan.',
      characteristics: ['Berduri', 'Bentuk pipih', 'Berbuah'],
      habitat: 'Gurun, daerah kering',
      uses: ['Makanan', 'Obat tradisional', 'Dekorasi']
    },
    {
      id: 6,
      name: 'Basil',
      scientificName: 'Ocimum basilicum',
      category: 'herbal',
      image: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?w=400',
      description: 'Tanaman herbal aromatik yang sering digunakan dalam masakan dan memiliki khasiat obat.',
      characteristics: ['Aromatik', 'Daun hijau', 'Mudah tumbuh'],
      habitat: 'Daerah tropis, kebun',
      uses: ['Bumbu masakan', 'Obat tradisional', 'Teh herbal']
    }
  ];

  const categories = [
    { value: 'all', label: 'Semua' },
    { value: 'bunga', label: 'Bunga' },
    { value: 'hias', label: 'Tanaman Hias' },
    { value: 'obat', label: 'Tanaman Obat' },
    { value: 'herbal', label: 'Herbal' },
    { value: 'sukulen', label: 'Sukulen' }
  ];

  const filteredPlants = plantsData.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Database Tumbuhan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jelajahi koleksi lengkap berbagai jenis tumbuhan dengan informasi detail
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nama tumbuhan atau nama ilmiah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredPlants.length} dari {plantsData.length} tumbuhan
          </p>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant, index) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedPlant(plant)}
            >
              <div className="relative">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {categories.find(cat => cat.value === plant.category)?.label}
                </div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <Eye className="text-white" size={24} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {plant.name}
                </h3>
                <p className="text-sm text-gray-500 italic mb-2">
                  {plant.scientificName}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {plant.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-green-600 font-medium text-sm">
                    Lihat Detail
                  </span>
                  <div className="flex space-x-1">
                    {plant.characteristics.slice(0, 2).map((char, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Tidak ada tumbuhan yang ditemukan dengan kriteria pencarian Anda.
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
