import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, List, Search, Leaf } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: 'Scan Tumbuhan',
      description: 'Ambil foto tumbuhan dan dapatkan identifikasi otomatis dengan AI',
      path: '/scan',
      color: 'bg-blue-500'
    },
    {
      icon: List,
      title: 'Database Tumbuhan',
      description: 'Jelajahi koleksi lengkap berbagai jenis tumbuhan',
      path: '/plants',
      color: 'bg-green-500'
    },
    {
      icon: Search,
      title: 'Pencarian Cepat',
      description: 'Cari tumbuhan berdasarkan nama atau karakteristik',
      path: '/plants',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Leaf className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              Identifikasi Tumbuhan
              <span className="text-green-600"> dengan AI</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Temukan dan pelajari berbagai jenis tumbuhan dengan teknologi kecerdasan buatan. 
              Ambil foto, dapatkan informasi lengkap, dan perluas pengetahuan botanis Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/scan" 
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Camera size={20} />
                <span>Mulai Scan</span>
              </Link>
              <Link 
                to="/plants" 
                className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors flex items-center justify-center space-x-2"
              >
                <List size={20} />
                <span>Lihat Database</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Jelajahi berbagai fitur yang memudahkan Anda dalam mengidentifikasi dan mempelajari tumbuhan
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all"
                >
                  <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <Link
                    to={feature.path}
                    className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Coba Sekarang
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Spesies Tumbuhan</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-100">Akurasi Identifikasi</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Tersedia Kapan Saja</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
