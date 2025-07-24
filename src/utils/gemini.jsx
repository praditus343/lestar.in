import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data:image/jpeg;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Function to clean JSON response from markdown formatting
const cleanJsonResponse = (text) => {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  // If the response starts with something other than {, try to find the JSON part
  if (!cleaned.startsWith('{')) {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
  }
  
  return cleaned;
};

// List of known Indonesian endemic plants
const indonesianEndemicPlants = [
  'rafflesia arnoldii',
  'amorphophallus titanum',
  'nepenthes rajah',
  'nepenthes',
  'kantong semar',
  'bunga bangkai',
  'bunga rafflesia',
  'raflesia',
  'edelweiss jawa',
  'anggrek hitam',
  'pohon ulin',
  'meranti',
  'jelutung',
  'damar',
  'keruing'
];

// Function to check if plant is endemic based on scientific or common name
const checkEndemicStatus = (scientificName, commonName, origin, description) => {
  const scientific = scientificName.toLowerCase();
  const common = commonName.toLowerCase();
  const originText = origin ? origin.toLowerCase() : '';
  const descText = description ? description.toLowerCase() : '';
  
  // Check against known endemic plants list
  const isInEndemicList = indonesianEndemicPlants.some(endemic => 
    scientific.includes(endemic) || common.includes(endemic)
  );
  
  // Check origin indicators
  const hasIndonesianOrigin = originText.includes('indonesia') || 
                             originText.includes('nusantara') ||
                             originText.includes('sumatra') ||
                             originText.includes('kalimantan') ||
                             originText.includes('jawa') ||
                             originText.includes('sulawesi') ||
                             originText.includes('papua');
  
  // Check description for endemic indicators
  const hasEndemicDescription = descText.includes('endemik') ||
                               descText.includes('endemic') ||
                               descText.includes('hanya ditemukan di indonesia') ||
                               descText.includes('khas indonesia');
  
  // Check for specific endemic genera
  const isEndemicGenus = scientific.includes('rafflesia') ||
                        scientific.includes('amorphophallus') ||
                        scientific.includes('nepenthes') ||
                        common.includes('kantong semar') ||
                        common.includes('bunga bangkai');
  
  return isInEndemicList || isEndemicGenus || (hasIndonesianOrigin && hasEndemicDescription);
};

// Function to identify plant using Gemini
export const identifyPlant = async (imageFile) => {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key tidak ditemukan. Pastikan VITE_GEMINI_API_KEY sudah diset di .env file.');
    }

    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    const prompt = `
    Analisis gambar tumbuhan ini dan berikan informasi berikut dalam format JSON yang valid.
    
    PENTING: 
    - Berikan HANYA JSON yang valid tanpa markdown formatting, tanpa backticks, tanpa kata "json", tanpa teks tambahan.
    - Identifikasi tumbuhan dengan akurat termasuk nama ilmiah yang tepat
    - Berikan informasi lengkap tentang asal dan persebaran tumbuhan
    
    Format yang diinginkan:
    {
      "name": "nama umum tumbuhan dalam bahasa Indonesia",
      "scientificName": "nama ilmiah tumbuhan yang tepat",
      "confidence": angka_kepercayaan_0_sampai_100,
      "description": "deskripsi detail tentang tumbuhan ini, termasuk ciri khas dan keunikannya",
      "characteristics": ["karakteristik1", "karakteristik2", "karakteristik3"],
      "family": "familia tumbuhan",
      "habitat": "habitat alami tumbuhan",
      "origin": "asal tumbuhan (sebutkan negara/wilayah spesifik)",
      "endemicStatus": "status endemik - akan divalidasi sistem",
      "distribution": "persebaran geografis tumbuhan ini secara detail",
      "uses": ["kegunaan1", "kegunaan2"],
      "careInstructions": "instruksi perawatan singkat",
      "isEdible": true/false,
      "isDecorative": true/false,
      "conservationStatus": "status konservasi (jika ada)"
    }
    
    Contoh tanaman endemik Indonesia yang harus dikenali:
    - Rafflesia arnoldii (Bunga Rafflesia)
    - Amorphophallus titanum (Bunga Bangkai)
    - Nepenthes species (Kantong Semar)
    - Anggrek Hitam (Coelogyne pandurata)
    - Edelweiss Jawa (Anaphalis javanica)
    
    Berikan informasi yang akurat dan detail.
    Respon harus dimulai langsung dengan { dan diakhiri dengan }.
    `;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: imageFile.type
      }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw response from Gemini:', text);
    
    // Clean the response to remove markdown formatting
    const cleanedText = cleanJsonResponse(text);
    console.log('Cleaned response:', cleanedText);
    
    // Parse JSON response
    try {
      const jsonResponse = JSON.parse(cleanedText);
      
      // Validate required fields
      if (!jsonResponse.name || !jsonResponse.scientificName) {
        throw new Error('Response tidak memiliki field yang diperlukan');
      }
      
      // ENHANCED: Check endemic status using multiple criteria
      const isEndemic = checkEndemicStatus(
        jsonResponse.scientificName,
        jsonResponse.name,
        jsonResponse.origin,
        jsonResponse.description
      );
      
      if (isEndemic) {
        jsonResponse.endemicStatus = 'Tanaman endemik';
        console.log('✅ ENDEMIC DETECTED:', jsonResponse.name, '-', jsonResponse.scientificName);
      } else {
        jsonResponse.endemicStatus = 'Bukan tanaman endemik';
        console.log('❌ NOT ENDEMIC:', jsonResponse.name, '-', jsonResponse.scientificName);
      }
      
      console.log('Final endemic status:', jsonResponse.endemicStatus);
      console.log('Analysis details:', {
        scientific: jsonResponse.scientificName,
        common: jsonResponse.name,
        origin: jsonResponse.origin,
        isEndemic: isEndemic
      });
      
      return {
        success: true,
        data: jsonResponse
      };
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      console.log('Raw response:', text);
      console.log('Cleaned response:', cleanedText);
      
      // Fallback: try to extract JSON manually
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = JSON.parse(jsonMatch[0]);
          
          // Apply same endemic status check for fallback
          const isEndemic = checkEndemicStatus(
            extractedJson.scientificName || '',
            extractedJson.name || '',
            extractedJson.origin || '',
            extractedJson.description || ''
          );
          
          if (isEndemic) {
            extractedJson.endemicStatus = 'Tanaman endemik';
          } else {
            extractedJson.endemicStatus = 'Bukan tanaman endemik';
          }
          
          return {
            success: true,
            data: extractedJson
          };
        }
      } catch (fallbackError) {
        console.error('Fallback parsing also failed:', fallbackError);
      }
      
      return {
        success: false,
        error: 'Format response tidak valid dari AI. Silakan coba lagi.'
      };
    }
    
  } catch (error) {
    console.error('Error identifying plant:', error);
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan saat mengidentifikasi tumbuhan'
    };
  }
};

// Function to get plant care tips
export const getPlantCareTips = async (plantName) => {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key tidak ditemukan.');
    }

    const prompt = `
    Berikan tips perawatan detail untuk tumbuhan "${plantName}".
    
    PENTING: Berikan HANYA JSON yang valid tanpa markdown formatting, tanpa backticks, tanpa kata "json".
    
    Format yang diinginkan:
    {
      "watering": "panduan penyiraman",
      "sunlight": "kebutuhan cahaya matahari",
      "soil": "jenis tanah yang cocok",
      "temperature": "suhu optimal",
      "humidity": "kelembaban yang dibutuhkan",
      "fertilizer": "panduan pemupukan",
      "pruning": "panduan pemangkasan",
      "commonProblems": ["masalah1", "masalah2"],
      "tips": ["tip1", "tip2", "tip3"],
      "seasonalCare": "perawatan berdasarkan musim",
      "propagation": "cara perbanyakan"
    }
    
    Berikan response dalam bahasa Indonesia.
    Respon harus dimulai langsung dengan { dan diakhiri dengan }.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw care tips response:', text);
    
    // Clean the response
    const cleanedText = cleanJsonResponse(text);
    console.log('Cleaned care tips response:', cleanedText);
    
    try {
      const jsonResponse = JSON.parse(cleanedText);
      return {
        success: true,
        data: jsonResponse
      };
    } catch (parseError) {
      console.error('Error parsing care tips JSON:', parseError);
      
      // Fallback parsing
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = JSON.parse(jsonMatch[0]);
          return {
            success: true,
            data: extractedJson
          };
        }
      } catch (fallbackError) {
        console.error('Fallback care tips parsing failed:', fallbackError);
      }
      
      return {
        success: false,
        error: 'Format response tidak valid untuk tips perawatan'
      };
    }
    
  } catch (error) {
    console.error('Error getting care tips:', error);
    return {
      success: false,
      error: error.message || 'Terjadi kesalahan saat mengambil tips perawatan'
    };
  }
};