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
      <section className="flex min-h-screen items-center justify-center px-4 py-8 lg:px-12">
        <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-3">
          {/* Kiri: Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 text-center lg:text-left relative z-20"
          >
            <h1 className="text-4xl font-bold text-gray-800 lg:text-5xl">LESTARI.IN</h1>
            <p className="text-base text-gray-600 max-w-md">
              Temukan dan pelajari berbagai jenis tumbuhan dengan teknologi kecerdasan buatan. Ambil foto, dapatkan informasi lengkap, dan perluas pengetahuan botanis Anda.
            </p>
          </motion.div>

          {/* Tengah: Gambar Anggrek */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex h-[450px] items-center justify-center"
          >
            <div className="absolute w-[600px] h-[800px] bg-green-100/80 rounded-[100px] -top-80 z-0" />
            <img
              src={anggrekImage}
              alt="Bunga Anggrek Bulan"
              className="absolute w-[200%] h-[200%] object-contain translate-x-16 -translate-y-0 z-10"
            />
          </motion.div>

          {/* Kanan: Deskripsi */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-center text-left -translate-x-32 relative z-20"
          >
            <h3 className="mb-2 text-xl font-bold text-gray-800">Bunga Anggrek Bulan</h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Anggrek Bulan atau dalam nama ilmiahnya <em>Phalaenopsis amabilis</em>, adalah salah satu bunga nasional Indonesia yang menyandang predikat sebagai Puspa Pesona
            </p>
            <a
              href="#"
              className="font-semibold text-green-800 hover:text-green-900 border-b-2 border-green-300 inline-block w-fit"
            >
              Read More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Section: Lihat Tumbuhan */}
      <section className="bg-green-50/60 py-20 px-4 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Kiri: Teks */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-center lg:text-left"
          >
            <h2 className="text-4xl font-bold text-gray-800">Lihat Tumbuhan</h2>
            <p className="text-lg text-gray-600">
              Jelajahi kekayaan flora endemik yang tersebar di seluruh nusantara melalui direktori lengkap kami. Lebih dari itu, temukan keajaiban yang tumbuh lebih dekat dari yang Anda duga.
            </p>
            <Link
              to="/plants"
              className="inline-block rounded-md bg-green-800 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-900"
            >
              Coba Sekarang
            </Link>
          </motion.div>

          {/* Kanan: Ilustrasi dengan background kanan lihat.png */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex h-80 items-center justify-center lg:h-96"
          >
            {/* Background menggunakan kanan lihat.png */}
           <img
              src={kananLihatImage}
              alt="Background Kanan Lihat"
              className="absolute w-[180%] h-[180%] object-contain translate-x-80"
            />
            
            {/* Gambar lihat.png yang menimpa di atas */}
            <img
              src={lihatImage}
              alt="Lihat Tumbuhan"
              className="absolute w-[180%] h-[180%] object-contain translate-x-80"
            />
          </motion.div>
        </div>
      </section>

      {/* Section: Scan Tumbuhan */}
      <section className="bg-white py-20 px-4 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Kiri: Ilustrasi dengan background gelombang */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative flex h-80 items-center justify-center lg:h-96"
          >
            {/* Background bergelombang seperti pada gambar */}
            <div 
              className="absolute w-[800px] h-[400px] bg-green-100/80 -top+10 -left-80"
              style={{
                borderRadius: "0 150px 150px 0"
              }}
            />
            
            {/* Gambar scan.png */}
            <img
              src={scanImage}
              alt="Scan Tumbuhan"
              className="absolute w-[140%] h-[140%] object-contain translate-x-0"
            />
          </motion.div>

          {/* Kanan: Teks */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 text-center lg:text-left"
          >
            <h2 className="text-4xl font-bold text-gray-800">Scan Tumbuhan</h2>
            <p className="text-lg text-gray-600">
              Ambil foto tumbuhan dan dapatkan identifikasi otomatis dengan AI
            </p>
            <Link
              to="/scan"
              className="inline-block rounded-md bg-green-800 px-8 py-3 font-semibold text-white transition-colors hover:bg-green-900"
            >
              Coba Sekarang
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Home;