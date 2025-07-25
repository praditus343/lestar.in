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
      throw new Error('Gemini API key not found. Make sure VITE_GEMINI_API_KEY is set in the .env file.');
    }

    // Convert image to base64
    const base64Image = await fileToBase64(imageFile);
    
    const prompt = `
    Analyze this plant image and provide the following information in valid JSON format.
    
    IMPORTANT: 
    - Provide ONLY valid JSON without markdown formatting, without backticks, without the word "json", without additional text.
    - Identify the plant accurately including the correct scientific name
    - Provide complete information about the plant's origin and distribution
    
    Desired format:
    {
      "name": "common plant name in English",
      "scientificName": "correct scientific name of the plant",
      "confidence": confidence_number_0_to_100,
      "description": "detailed description of this plant, including distinctive features and uniqueness",
      "characteristics": ["characteristic1", "characteristic2", "characteristic3"],
      "family": "plant family",
      "habitat": "natural habitat of the plant",
      "origin": "plant origin (specify country/region)",
      "endemicStatus": "endemic status - will be validated by system",
      "distribution": "detailed geographical distribution of this plant",
      "uses": ["use1", "use2"],
      "careInstructions": "brief care instructions",
      "isEdible": true/false,
      "isDecorative": true/false,
      "conservationStatus": "conservation status (if any)"
    }
    
    Examples of Indonesian endemic plants that should be recognized:
    - Rafflesia arnoldii (Rafflesia Flower)
    - Amorphophallus titanum (Corpse Flower)
    - Nepenthes species (Pitcher Plant)
    - Black Orchid (Coelogyne pandurata)
    - Javanese Edelweiss (Anaphalis javanica)
    
    Provide accurate and detailed information.
    Response must start directly with { and end with }.
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
        throw new Error('Response missing required fields');
      }
      
      // ENHANCED: Check endemic status using multiple criteria
      const isEndemic = checkEndemicStatus(
        jsonResponse.scientificName,
        jsonResponse.name,
        jsonResponse.origin,
        jsonResponse.description
      );
      
      if (isEndemic) {
        jsonResponse.endemicStatus = 'Endemic plant';
        console.log('✅ ENDEMIC DETECTED:', jsonResponse.name, '-', jsonResponse.scientificName);
      } else {
        jsonResponse.endemicStatus = 'Not an endemic plant';
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
            extractedJson.endemicStatus = 'Endemic plant';
          } else {
            extractedJson.endemicStatus = 'Not an endemic plant';
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
        error: 'Invalid response format from AI. Please try again.'
      };
    }
    
  } catch (error) {
    console.error('Error identifying plant:', error);
    
    if (error.message.includes('403') || error.message.includes('API key')) {
      return {
        success: false,
        error: 'Invalid API key. Please check your Gemini API configuration.'
      };
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection and try again.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'An error occurred while identifying the plant'
    };
  }
};

// Function to get plant care tips
export const getPlantCareTips = async (plantName) => {
  try {
    if (!API_KEY) {
      throw new Error('Gemini API key not found.');
    }

    const prompt = `
    Provide detailed care tips for the plant "${plantName}".
    
    IMPORTANT: Provide ONLY valid JSON without markdown formatting, without backticks, without the word "json".
    
    Desired format:
    {
      "watering": "watering guidelines",
      "sunlight": "sunlight requirements",
      "soil": "suitable soil type",
      "temperature": "optimal temperature",
      "humidity": "required humidity",
      "fertilizer": "fertilizing guidelines",
      "pruning": "pruning guidelines",
      "commonProblems": ["problem1", "problem2"],
      "tips": ["tip1", "tip2", "tip3"],
      "seasonalCare": "seasonal care requirements",
      "propagation": "propagation methods"
    }
    
    Provide response in English.
    Response must start directly with { and end with }.
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
        error: 'Invalid response format for care tips'
      };
    }
    
  } catch (error) {
    console.error('Error getting care tips:', error);
    
    if (error.message.includes('403') || error.message.includes('API key')) {
      return {
        success: false,
        error: 'Invalid API key. Please check your Gemini API configuration.'
      };
    }
    
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection and try again.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'An error occurred while getting care tips'
    };
  }
};