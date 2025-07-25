import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import anggrekImage from '../assets/anggrek.png';
import lihatImage from '../assets/lihat.png';
import kananLihatImage from '../assets/kanan lihat.svg';
import scanImage from '../assets/scan.png';

const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-3">
          {/* Kiri: Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 text-center lg:text-left relative z-20 order-1 lg:order-1"
          >
            <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl lg:text-5xl">LESTARI.IN</h1>
            <p className="text-sm text-gray-600 max-w-md mx-auto lg:mx-0 sm:text-base">
              Discover and learn about various plant species with artificial intelligence technology. Take photos, get complete information, and expand your botanical knowledge.
            </p>
          </motion.div>

          {/* Tengah: Gambar Anggrek */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex h-[300px] sm:h-[350px] lg:h-[450px] items-center justify-center order-2 lg:order-2"
          >
            <div className="absolute w-[400px] h-[500px] sm:w-[500px] sm:h-[600px] lg:w-[600px] lg:h-[800px] bg-green-100/80 rounded-[80px] lg:rounded-[100px] -top-40 sm:-top-60 lg:-top-80 z-0" />
            <img
              src={anggrekImage}
              alt="Bunga Anggrek Bulan"
              className="absolute w-[150%] h-[150%] sm:w-[180%] sm:h-[180%] lg:w-[200%] lg:h-[200%] object-contain translate-x-8 sm:translate-x-12 lg:translate-x-16 -translate-y-0 z-10"
            />
          </motion.div>

          {/* Kanan: Deskripsi */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-center text-center lg:text-left -translate-x-0 sm:-translate-x-8 lg:-translate-x-32 relative z-20 order-3 lg:order-3"
          >
            <h3 className="mb-2 text-lg sm:text-xl font-bold text-gray-800">Moon Orchid</h3>
            <p className="mb-4 text-xs sm:text-sm leading-relaxed text-gray-600 max-w-md mx-auto lg:mx-0">
              Moon Orchid or scientifically known as <em>Phalaenopsis amabilis</em>, is one of Indonesia's national flowers that holds the title of Puspa Pesona (Charm Flower)
            </p>
            <a
              href="#"
              className="font-semibold text-green-800 hover:text-green-900 border-b-2 border-green-300 inline-block w-fit mx-auto lg:mx-0"
            >
              Read More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Section: Lihat Tumbuhan */}
      <section className="bg-green-50/60 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Kiri: Teks */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Explore Plants</h2>
            <p className="text-base sm:text-lg text-gray-600">
              Explore the wealth of endemic flora scattered throughout the archipelago through our comprehensive directory. Discover wonders that grow closer than you think.
            </p>
            <Link
              to="/plants"
              className="inline-block rounded-md bg-green-800 px-6 sm:px-8 py-2 sm:py-3 font-semibold text-white transition-colors hover:bg-green-900"
            >
              Try Now
            </Link>
          </motion.div>

          {/* Kanan: Ilustrasi dengan background kanan lihat.png */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex h-60 sm:h-72 lg:h-80 xl:h-96 items-center justify-center order-1 lg:order-2"
          >
            {/* Background menggunakan kanan lihat.png */}
           <img
              src={kananLihatImage}
              alt="Background Kanan Lihat"
              className="absolute w-[150%] h-[150%] sm:w-[160%] sm:h-[160%] lg:w-[180%] lg:h-[180%] object-contain translate-x-32 sm:translate-x-48 lg:translate-x-80"
            />
            
            {/* Gambar lihat.png yang menimpa di atas */}
            <img
              src={lihatImage}
              alt="Lihat Tumbuhan"
              className="absolute w-[150%] h-[150%] sm:w-[160%] sm:h-[160%] lg:w-[180%] lg:h-[180%] object-contain translate-x-32 sm:translate-x-48 lg:translate-x-80 z-10"
            />
          </motion.div>
        </div>
      </section>

      {/* Section: Scan Tumbuhan */}
      <section className="bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Kiri: Ilustrasi dengan background gelombang */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex h-60 sm:h-72 lg:h-80 xl:h-96 items-center justify-center"
          >
            {/* Background bergelombang seperti pada gambar */}
            <div 
              className="absolute w-[500px] h-[250px] sm:w-[600px] sm:h-[300px] lg:w-[800px] lg:h-[400px] bg-green-100/80 -top-5 sm:-top-8 lg:-top-10 -left-20 sm:-left-40 lg:-left-80"
              style={{
                borderRadius: "0 100px 100px 0"
              }}
            />
            
            {/* Gambar scan.png */}
            <img
              src={scanImage}
              alt="Scan Tumbuhan"
              className="absolute w-[120%] h-[120%] sm:w-[130%] sm:h-[130%] lg:w-[140%] lg:h-[140%] object-contain translate-x-0 z-10"
            />
          </motion.div>

          {/* Kanan: Teks */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 sm:space-y-6 text-center lg:text-left"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">Scan Plants</h2>
            <p className="text-base sm:text-lg text-gray-600">
              Take photos of plants and get automatic identification with AI
            </p>
            <Link
              to="/scan"
              className="inline-block rounded-md bg-green-800 px-6 sm:px-8 py-2 sm:py-3 font-semibold text-white transition-colors hover:bg-green-900"
            >
              Try Now
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;