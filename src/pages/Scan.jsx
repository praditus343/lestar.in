import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, RotateCcw, Search, CheckCircle, AlertCircle } from 'lucide-react';

const Scan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Dummy scan results
  const dummyResults = [
    {
      name: 'Mawar Merah',
      scientificName: 'Rosa rubiginosa',
      confidence: 95,
      description: 'Mawar merah dengan kelopak yang indah dan aroma yang harum.',
      characteristics: ['Berduri', 'Harum', 'Berbunga'],
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400'
    },
    {
      name: 'Monstera Deliciosa',
      scientificName: 'Monstera deliciosa',
      confidence: 88,
      description: 'Tanaman hias dengan daun berlubang yang unik.',
      characteristics: ['Daun berlubang', 'Merambat'],
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
    }
  ];

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const startScan = () => {
    if (!selectedImage) return;
    
    setIsScanning(true);
    setScanResult(null);

    // Simulate AI processing
    setTimeout(() => {
      const randomResult = dummyResults[Math.floor(Math.random() * dummyResults.length)];
      setScanResult(randomResult);
      setIsScanning(false);
    }, 3000);
  };

  const resetScan = () => {
    setSelectedImage(null);
    setScanResult(null);
    setIsScanning(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const capturePhoto = () => {
    // In a real app, this would open camera
    alert('Fitur kamera akan tersedia dalam versi mobile app');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Scan Tumbuhan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload foto tumbuhan atau ambil foto langsung untuk mendapatkan identifikasi otomatis dengan AI
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* Image Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-green-500 bg-green-50'
                  : selectedImage
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-300 hover:border-green-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected plant"
                    className="w-full h-64 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-green-600 font-medium">Foto siap untuk di-scan!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop foto di sini atau klik untuk upload
                    </p>
                    <p className="text-gray-500">
                      Mendukung JPG, PNG, atau WEBP (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Upload size={20} />
                <span>Upload Foto</span>
              </button>
              <button
                onClick={capturePhoto}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Camera size={20} />
                <span>Ambil Foto</span>
              </button>
            </div>

            {/* Scan Button */}
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <button
                  onClick={startScan}
                  disabled={isScanning}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isScanning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Menganalisis...</span>
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      <span>Mulai Identifikasi</span>
                    </>
                  )}
                </button>
                <button
                  onClick={resetScan}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <RotateCcw size={18} />
                  <span>Reset</span>
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Search className="text-green-600" size={20} />
                <span>Hasil Identifikasi</span>
              </h3>

              {!selectedImage && !scanResult && (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Upload foto tumbuhan untuk memulai identifikasi
                  </p>
                </div>
              )}

              {isScanning && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    AI sedang menganalisis foto Anda...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Proses ini membutuhkan waktu beberapa detik
                  </p>
                </div>
              )}

              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Success Header */}
                  <div className="flex items-center space-x-2 text-green-600 mb-4">
                    <CheckCircle size={20} />
                    <span className="font-medium">Identifikasi Berhasil!</span>
                  </div>

                  {/* Result Card */}
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <img
                        src={scanResult.image}
                        alt={scanResult.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {scanResult.name}
                        </h4>
                        <p className="text-gray-500 italic text-sm">
                          {scanResult.scientificName}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${scanResult.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              {scanResult.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                      {scanResult.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {scanResult.characteristics.map((char, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Lihat Detail Lengkap
                  </button>
                </motion.div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-800 mb-3">Tips untuk Hasil Terbaik:</h4>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• Ambil foto dengan pencahayaan yang baik</li>
                <li>• Pastikan tumbuhan terlihat jelas dan fokus</li>
                <li>• Sertakan daun, bunga, atau bagian karakteristik</li>
                <li>• Hindari foto yang blur atau terlalu gelap</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
