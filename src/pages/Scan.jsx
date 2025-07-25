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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Plant Identification
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload a plant photo and let Gemini AI identify the species, characteristics, and provide care tips
          </p>
        </motion.div>

        {/* Camera Modal */}
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-full overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Take Plant Photo</h3>
                <button
                  onClick={stopCamera}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              {cameraError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">{cameraError}</p>
                  <button
                    onClick={stopCamera}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-64 md:h-96 object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-white border-opacity-50 m-4 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Position the plant within the frame</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={capturePhoto}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Camera size={20} />
                      <span>Take Photo</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
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
                  <p className="text-green-600 font-medium">Photo ready for analysis!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Drop photo here or click to upload
                    </p>
                    <p className="text-gray-500">
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
                className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
              >
                <AlertCircle className="text-red-500" size={20} />
                <p className="text-red-700">{error}</p>
              </motion.div>
            )}

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
                <span>Upload Photo</span>
              </button>
              <button
                onClick={startCamera}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
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
                <span>AI Identification Results</span>
              </h3>

              {!selectedImage && !scanResult && !isScanning && (
                <div className="text-center py-12">
                  <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Upload a plant photo to start AI identification
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Powered by Google Gemini AI
                  </p>
                </div>
              )}

              {isScanning && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">
                    Gemini AI is analyzing the photo...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Analysis process takes a few seconds
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
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle size={20} />
                      <span className="font-medium">Identification Successful!</span>
                    </div>
                  </div>

                  {/* Check if it's not endemic - show only "Not an endemic plant" */}
                  {scanResult.endemicStatus === 'Not an endemic plant' ? (
                    <div className="border rounded-lg p-6 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Leaf className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-lg text-gray-600">
                        Not an endemic plant
                      </p>
                    </div>
                  ) : (
                    /* Show full details for endemic plants */
                    <>
                      {/* Result Card */}
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">
                          {scanResult.name}
                        </h4>
                        <p className="text-gray-500 italic text-sm">
                          {scanResult.scientificName}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          Familia: {scanResult.family}
                        </p>
                        
                        {/* Simplified Endemic Status Badge - Only show badge for endemic plants */}
                        {scanResult.endemicStatus && (
                          <div className="mt-2">
                            {scanResult.endemicStatus === 'Endemic plant' ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                � Endemic plant
                              </span>
                            ) : (
                              <p className="text-sm text-gray-600 mt-1">
                                Not an endemic plant
                              </p>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs text-gray-500">Confidence:</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  scanResult.confidence >= 80 ? 'bg-green-500' :
                                  scanResult.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${scanResult.confidence}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${
                              scanResult.confidence >= 80 ? 'text-green-600' :
                              scanResult.confidence >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {scanResult.confidence}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                      {scanResult.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Habitat:</span>
                        <p className="text-gray-600">{scanResult.habitat}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Origin:</span>
                        <p className="text-gray-600">{scanResult.origin || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Distribution:</span>
                        <p className="text-gray-600">{scanResult.distribution || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Edible:</span>
                        <p className={`${scanResult.isEdible ? 'text-green-600' : 'text-red-600'}`}>
                          {scanResult.isEdible ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>

                    {/* Conservation Status */}
                    {scanResult.conservationStatus && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-yellow-800">Conservation Status:</span>
                          <span className="text-yellow-700">{scanResult.conservationStatus}</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-700">Characteristics:</h5>
                      <div className="flex flex-wrap gap-1">
                        {scanResult.characteristics?.map((char, index) => (
                          <span
                            key={index}
                            className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {scanResult.uses && scanResult.uses.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-gray-700">Uses:</h5>
                        <div className="flex flex-wrap gap-1">
                          {scanResult.uses.map((use, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={loadCareTips}
                      disabled={loadingTips}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                    >
                      {loadingTips ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <Heart size={18} />
                          <span>Care Tips</span>
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
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Heart className="text-red-500" size={20} />
                  <span>Care Tips for {scanResult?.name}</span>
                </h3>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">💧 Watering</h4>
                      <p className="text-sm text-gray-600">{careTips.watering}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">☀️ Light</h4>
                      <p className="text-sm text-gray-600">{careTips.sunlight}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">🌱 Soil</h4>
                      <p className="text-sm text-gray-600">{careTips.soil}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">🌡️ Temperature</h4>
                      <p className="text-sm text-gray-600">{careTips.temperature}</p>
                    </div>
                  </div>

                  {careTips.humidity && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">💨 Humidity</h4>
                      <p className="text-sm text-gray-600">{careTips.humidity}</p>
                    </div>
                  )}

                  {careTips.fertilizer && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">🌿 Fertilizing</h4>
                      <p className="text-sm text-gray-600">{careTips.fertilizer}</p>
                    </div>
                  )}

                  {careTips.pruning && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">✂️ Pruning</h4>
                      <p className="text-sm text-gray-600">{careTips.pruning}</p>
                    </div>
                  )}

                  {careTips.commonProblems && careTips.commonProblems.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">⚠️ Common Problems</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {careTips.commonProblems.map((problem, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{problem}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {careTips.tips && careTips.tips.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">💡 Additional Tips</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {careTips.tips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {careTips.seasonalCare && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">🗓️ Seasonal Care</h4>
                      <p className="text-sm text-gray-600">{careTips.seasonalCare}</p>
                    </div>
                  )}

                  {careTips.propagation && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">🌱 Propagation</h4>
                      <p className="text-sm text-gray-600">{careTips.propagation}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center space-x-2">
                <Info size={18} />
                <span>Tips for Best Results</span>
              </h4>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• Take photos with good lighting</li>
                <li>• Make sure the plant is clearly visible and in focus</li>
                <li>• Include leaves, flowers, or characteristic parts</li>
                <li>• Avoid blurry or too dark photos</li>
                <li>• Close-up photos provide more accurate results</li>
                <li>• Take from multiple angles for optimal results</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Scan;