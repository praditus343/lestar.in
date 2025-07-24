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
    
    PENTING: Berikan HANYA JSON yang valid tanpa markdown formatting, tanpa backticks, tanpa kata "json", tanpa teks tambahan.
    
    Format yang diinginkan:
    {
      "name": "nama umum tumbuhan dalam bahasa Indonesia",
      "scientificName": "nama ilmiah tumbuhan",
      "confidence": angka_kepercayaan_0_sampai_100,
      "description": "deskripsi singkat tentang tumbuhan ini",
      "characteristics": ["karakteristik1", "karakteristik2", "karakteristik3"],
      "family": "familia tumbuhan",
      "habitat": "habitat alami tumbuhan",
      "uses": ["kegunaan1", "kegunaan2"],
      "careInstructions": "instruksi perawatan singkat",
      "isEdible": true/false,
      "isDecorative": true/false
    }
    
    Jika gambar tidak menunjukkan tumbuhan yang jelas, set confidence di bawah 50 dan berikan penjelasan di description.
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
      "tips": ["tip1", "tip2", "tip3"]
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