import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, RotateCcw, Search, CheckCircle, AlertCircle, Info, Leaf, Heart, X } from 'lucide-react';
import { identifyPlant, getPlantCareTips } from '../utils/gemini';

const Scan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [showCareTips, setShowCareTips] = useState(false);
  const [careTips, setCareTips] = useState(null);
  const [loadingTips, setLoadingTips] = useState(false);
  
  // Camera states
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setSelectedFile(file);
        setScanResult(null);
        setError(null);
        setShowCareTips(false);
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please select a valid image file (JPG, PNG, WEBP)');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
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

  // Camera functions
  const startCamera = async () => {
    try {
      setCameraError(null);
      setError(null);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile if available
        } 
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      // Wait for video element to be available
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      let errorMessage = 'Cannot access camera. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please grant camera access permission in your browser.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'Camera not found on your device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Your browser does not support camera access.';
      } else {
        errorMessage += 'A technical error occurred.';
      }
      
      setCameraError(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        // Create a file from the blob
        const file = new File([blob], `captured-plant-${Date.now()}.jpg`, { 
          type: 'image/jpeg' 
        });
        
        // Convert to data URL for preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
          setSelectedFile(file);
          setScanResult(null);
          setError(null);
          setShowCareTips(false);
          
          // Stop camera after capture
          stopCamera();
        };
        reader.readAsDataURL(file);
      }
    }, 'image/jpeg', 0.8);
  };

  const startScan = async () => {
    if (!selectedFile) return;
    
    setIsScanning(true);
    setScanResult(null);
    setError(null);

    try {
      console.log('Starting plant identification...');
      console.log('Selected file:', selectedFile);
      
      const result = await identifyPlant(selectedFile);
      console.log('Identification result:', result);
      
      if (result.success) {
        console.log('Identification successful:', result.data);
        setScanResult(result.data);
        setError(null);
      } else {
        console.error('Identification failed:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError('An error occurred while identifying the plant. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const loadCareTips = async () => {
    if (!scanResult?.name) return;
    
    setLoadingTips(true);
    setError(null);
    
    try {
      console.log('Loading care tips for:', scanResult.name);
      const result = await getPlantCareTips(scanResult.name);
      console.log('Care tips result:', result);
      
      if (result.success) {
        setCareTips(result.data);
        setShowCareTips(true);
      } else {
        console.error('Failed to load care tips:', result.error);
        setError('Failed to load care tips: ' + result.error);
      }
    } catch (err) {
      console.error('Care tips error:', err);
      setError('An error occurred while loading care tips');
    } finally {
      setLoadingTips(false);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setScanResult(null);
    setError(null);
    setIsScanning(false);
    setShowCareTips(false);
    setCareTips(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Close camera modal when component unmounts
  useState(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with organic background */}
      <section className="relative bg-gradient-to-br from-green-50/40 to-white py-12 sm:py-16 lg:py-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/60 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-100/40 rounded-full translate-y-32 -translate-x-32 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >          
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Scan Plants
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Take photos of plants and get automatic identification with AI technology. 
              Discover the botanical world around you with just a click.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

        {/* Camera Modal */}
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-full overflow-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Take Plant Photo</h3>
                <button
                  onClick={stopCamera}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              {cameraError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-6">{cameraError}</p>
                  <button
                    onClick={stopCamera}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative bg-black rounded-2xl overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-64 md:h-96 object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white border-opacity-50 m-4 rounded-xl flex items-center justify-center">
                      <div className="text-white text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Position the plant within the frame</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={capturePhoto}
                      className="bg-green-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-900 transition-colors flex items-center space-x-2 shadow-lg"
                    >
                      <Camera size={20} />
                      <span>Take Photo</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transition-colors shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Upload Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              {/* Image Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragOver
                    ? 'border-green-800 bg-green-50 scale-105'
                    : selectedImage
                    ? 'border-green-800 bg-green-50'
                    : 'border-gray-300 hover:border-green-800 hover:bg-green-50/30'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {selectedImage ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Selected plant"
                        className="w-full h-72 object-cover rounded-2xl mx-auto shadow-xl"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-800 text-white p-2 rounded-full shadow-lg">
                        <CheckCircle size={20} />
                      </div>
                    </div>
                    <p className="text-green-800 font-semibold text-lg">Photo ready for analysis!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-10 h-10 text-green-800" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-800 mb-3">
                        Drop photo here or click to upload
                      </p>
                      <p className="text-gray-600">
                        Supports JPG, PNG, or WEBP (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3"
                >
                  <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                  <p className="text-red-700">{error}</p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-800 text-white py-4 rounded-2xl font-semibold hover:bg-green-900 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Upload size={20} />
                  <span>Upload Photo</span>
                </button>
                <button
                  onClick={startCamera}
                  className="bg-green-800 text-white py-4 rounded-2xl font-semibold hover:bg-green-900 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Camera size={20} />
                  <span>Take Photo</span>
                </button>
              </div>

              {/* Scan Button */}
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-3"
                >
                  <button
                    onClick={startScan}
                    disabled={isScanning}
                    className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-5 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-green-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {isScanning ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>AI is analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        <span>Analyze with Gemini AI</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetScan}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <RotateCcw size={18} />
                    <span>Reset</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Results Card */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Search className="text-green-800" size={20} />
                </div>
                <span>AI Identification Results</span>
              </h3>

              {!selectedImage && !scanResult && !isScanning && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Leaf className="w-10 h-10 text-green-800" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Ready to identify plants
                  </h4>
                  <p className="text-gray-500 mb-1">
                    Upload a plant photo to start AI identification
                  </p>
                  <p className="text-sm text-gray-400">
                    Powered by Google Gemini AI
                  </p>
                </div>
              )}

              {isScanning && (
                <div className="text-center py-16">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-green-200 rounded-2xl"></div>
                    <div className="absolute inset-0 border-4 border-green-800 rounded-2xl border-t-transparent animate-spin"></div>
                    <div className="absolute inset-3 bg-green-100 rounded-xl flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-green-800" />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    AI is analyzing your photo
                  </h4>
                  <p className="text-gray-500">
                    Our advanced Gemini AI is processing the image...
                  </p>
                </div>
              )}

              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Success Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-green-800">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={18} />
                      </div>
                      <span className="font-semibold">Identification Successful!</span>
                    </div>
                  </div>

                  {/* Check if it's not endemic - show only "Not an endemic plant" */}
                  {scanResult.endemicStatus === 'Not an endemic plant' ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-600 mb-2">
                        Not an endemic plant
                      </h4>
                      <p className="text-gray-500 text-sm">
                        This plant is not identified as endemic to Indonesia
                      </p>
                    </div>
                  ) : (
                    /* Show full details for endemic plants */
                    <>
                      {/* Main Plant Info Card */}
                      <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-green-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Leaf className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 text-xl mb-1">
                              {scanResult.name}
                            </h4>
                            <p className="text-green-800 italic text-sm font-medium mb-2">
                              {scanResult.scientificName}
                            </p>
                            <p className="text-gray-600 text-sm mb-3">
                              Family: {scanResult.family}
                            </p>
                            
                            {/* Endemic Status Badge */}
                            {scanResult.endemicStatus === 'Endemic plant' && (
                              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-800 text-white shadow-lg">
                                🌿 Endemic Plant of Indonesia
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Confidence Meter */}
                        <div className="mt-6 p-4 bg-white rounded-xl border border-green-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                            <span className={`text-sm font-bold ${
                              scanResult.confidence >= 80 ? 'text-green-600' :
                              scanResult.confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {scanResult.confidence}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-500 ${
                                scanResult.confidence >= 80 ? 'bg-green-500' :
                                scanResult.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${scanResult.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h5 className="font-semibold text-gray-800 mb-3">Description</h5>
                        <p className="text-gray-600 leading-relaxed">
                          {scanResult.description}
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600">🏞️</span>
                            </div>
                            <h5 className="font-semibold text-gray-800">Habitat</h5>
                          </div>
                          <p className="text-gray-600 text-sm">{scanResult.habitat}</p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                              <span className="text-purple-600">🌍</span>
                            </div>
                            <h5 className="font-semibold text-gray-800">Origin</h5>
                          </div>
                          <p className="text-gray-600 text-sm">{scanResult.origin || 'Unknown'}</p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                              <span className="text-orange-600">📍</span>
                            </div>
                            <h5 className="font-semibold text-gray-800">Distribution</h5>
                          </div>
                          <p className="text-gray-600 text-sm">{scanResult.distribution || 'Unknown'}</p>
                        </div>
                        
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                              <span className="text-green-600">🍃</span>
                            </div>
                            <h5 className="font-semibold text-gray-800">Edible</h5>
                          </div>
                          <p className={`text-sm font-medium ${scanResult.isEdible ? 'text-green-600' : 'text-red-600'}`}>
                            {scanResult.isEdible ? '✅ Yes, edible' : '❌ Not edible'}
                          </p>
                        </div>
                      </div>

                      {/* Conservation Status */}
                      {scanResult.conservationStatus && (
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                              <span className="text-amber-600">⚠️</span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-amber-800">Conservation Status</h5>
                              <p className="text-amber-700 font-medium">{scanResult.conservationStatus}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Characteristics & Uses */}
                      <div className="space-y-4">
                        {scanResult.characteristics && scanResult.characteristics.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h5 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-green-600">🔍</span>
                              </div>
                              <span>Characteristics</span>
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {scanResult.characteristics.map((char, index) => (
                                <span
                                  key={index}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {char}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {scanResult.uses && scanResult.uses.length > 0 && (
                          <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h5 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600">🛠️</span>
                              </div>
                              <span>Uses</span>
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {scanResult.uses.map((use, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                  {use}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Care Tips Button */}
                      <div className="pt-4">
                        <button 
                          onClick={loadCareTips}
                          disabled={loadingTips}
                          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-4 rounded-2xl font-semibold hover:from-green-700 hover:to-green-900 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          {loadingTips ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Loading care tips...</span>
                            </>
                          ) : (
                            <>
                              <Heart size={20} />
                              <span>Get Care Tips</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Care Tips Section */}
            {showCareTips && careTips && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Heart className="text-red-500" size={20} />
                  </div>
                  <span>Care Tips for {scanResult?.name}</span>
                </h3>

                <div className="space-y-6">
                  {/* Essential Care Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-blue-600 text-lg">💧</span>
                        </div>
                        <h4 className="font-semibold text-blue-800">Watering</h4>
                      </div>
                      <p className="text-blue-700 text-sm leading-relaxed">{careTips.watering}</p>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                          <span className="text-yellow-600 text-lg">☀️</span>
                        </div>
                        <h4 className="font-semibold text-yellow-800">Light Requirements</h4>
                      </div>
                      <p className="text-yellow-700 text-sm leading-relaxed">{careTips.sunlight}</p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <span className="text-green-600 text-lg">🌱</span>
                        </div>
                        <h4 className="font-semibold text-green-800">Soil Type</h4>
                      </div>
                      <p className="text-green-700 text-sm leading-relaxed">{careTips.soil}</p>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                          <span className="text-orange-600 text-lg">🌡️</span>
                        </div>
                        <h4 className="font-semibold text-orange-800">Temperature</h4>
                      </div>
                      <p className="text-orange-700 text-sm leading-relaxed">{careTips.temperature}</p>
                    </div>
                  </div>

                  {/* Additional Care Information */}
                  <div className="space-y-4">
                    {careTips.humidity && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600">💨</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">Humidity</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{careTips.humidity}</p>
                      </div>
                    )}

                    {careTips.fertilizer && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600">🌿</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">Fertilizing</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{careTips.fertilizer}</p>
                      </div>
                    )}

                    {careTips.pruning && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600">✂️</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">Pruning</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{careTips.pruning}</p>
                      </div>
                    )}
                  </div>

                  {/* Lists */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {careTips.commonProblems && careTips.commonProblems.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600">⚠️</span>
                          </div>
                          <h4 className="font-semibold text-red-800">Common Problems</h4>
                        </div>
                        <ul className="space-y-2">
                          {careTips.commonProblems.map((problem, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-red-500 mt-1 text-xs">●</span>
                              <span className="text-red-700 text-sm leading-relaxed">{problem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {careTips.tips && careTips.tips.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600">💡</span>
                          </div>
                          <h4 className="font-semibold text-green-800">Pro Tips</h4>
                        </div>
                        <ul className="space-y-2">
                          {careTips.tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-green-500 mt-1 text-xs">●</span>
                              <span className="text-green-700 text-sm leading-relaxed">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {careTips.seasonalCare && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600">🗓️</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">Seasonal Care</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{careTips.seasonalCare}</p>
                      </div>
                    )}

                    {careTips.propagation && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600">🌱</span>
                          </div>
                          <h4 className="font-semibold text-gray-800">Propagation</h4>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{careTips.propagation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tips for Best Results */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 rounded-3xl p-8">
              <h4 className="font-bold text-blue-800 mb-6 flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Info size={20} className="text-blue-600" />
                </div>
                <span className="text-lg">Tips for Best Results</span>
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <p className="text-blue-700 text-sm">Take photos with good lighting conditions</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <p className="text-blue-700 text-sm">Ensure the plant is clearly visible and in focus</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <p className="text-blue-700 text-sm">Include leaves, flowers, or characteristic parts</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <p className="text-blue-700 text-sm">Avoid blurry or too dark photos</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">5</span>
                    </div>
                    <p className="text-blue-700 text-sm">Close-up photos provide more accurate results</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">6</span>
                    </div>
                                        <p className="text-blue-700 text-sm">Take from multiple angles for optimal results</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </section>
    </div>
  );
};

export default Scan;