# 🌿 Lestar.in - Indonesian Endemic Plants Database

**Lestar.in** is a modern web application dedicated to exploring and identifying Indonesia's unique endemic plant species. Built with cutting-edge technology, it provides an interactive platform for plant identification using AI and comprehensive plant database exploration.

🌐 **Live Demo:** [https://lestar-in.vercel.app/](https://lestar-in.vercel.app/)


## ✨ Features

### 🔍 **AI-Powered Plant Identification**
- **Smart Plant Scanner** - Upload photos and get instant AI identification
- **Camera Integration** - Take photos directly from your device
- **Gemini AI Integration** - Powered by Google's advanced AI technology
- **Care Tips** - Get detailed plant care instructions

### 📚 **Comprehensive Plant Database**
- **Endemic Species Collection** - Extensive database of Indonesian endemic plants
- **Regional Filtering** - Browse plants by Indonesian regions (Sumatera, Jawa, Kalimantan, etc.)
- **Advanced Search** - Search by plant name, scientific name, or region
- **Conservation Status** - Track endangered and vulnerable species

### 🎨 **Modern User Experience**
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Smooth Animations** - Beautiful Framer Motion animations
- **Clean Interface** - Minimalist design with intuitive navigation
- **Interactive Modals** - Detailed plant information in elegant popups

## 🛠️ Built With

### **Frontend Technologies:**
- **React.js** - Modern UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

### **Backend Integration:**
- **REST API** - Communication with backend services
- **Railway Cloud** - Backend hosting platform
- **Google Gemini AI** - Plant identification AI service

### **Development Tools:**
- **JavaScript (ES6+)** - Modern JavaScript features
- **React Hooks** - State management with useState, useEffect
- **React Router** - Client-side routing
- **PostCSS** - CSS processing
- **ESLint** - Code linting and formatting

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/praditus343/lestar.in.git
   cd lestar.in
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

## 📱 Pages & Features

### 🏠 **Homepage**
- Hero section with featured endemic plant
- Clean, modern design with organic shapes
- Quick access to main features

### 🌱 **Plant Database (/plants)**
- Grid layout of endemic plants
- Region-based filtering
- Search functionality
- Conservation status indicators
- Detailed plant modal with comprehensive information

### 📸 **Plant Scanner (/scan)**
- AI-powered plant identification
- Camera integration
- Photo upload functionality
- Plant care tips generation
- Results display with confidence levels

## 🎨 Design System

### **Color Palette:**
- **Primary Green:** `#166534` (green-800)
- **Light Green:** `#dcfce7` (green-100)
- **Background:** `#ffffff` (white)
- **Text:** `#1f2937` (gray-800)

### **Typography:**
- **Primary Font:** HUMANISM-DEMO (Custom)
- **Body Font:** System fonts with fallbacks
- **Font Weights:** 400 (normal), 600 (semibold), 700 (bold)

### **Layout:**
- **Max Width:** 1280px (max-w-7xl)
- **Responsive Breakpoints:** sm, md, lg, xl
- **Spacing:** Consistent 8px grid system

## 🔗 API Integration

### **Backend Endpoints:**
```
Base URL: https://lestarin-be-production.up.railway.app

GET /api/plants/                    # Get all plants
GET /api/plants/region/{region}     # Get plants by region
GET /api/plants/{id}                # Get specific plant
```

### **Data Structure:**
```json
{
  "id": 1,
  "name": "Rafflesia Arnoldii",
  "scientificName": "Rafflesia arnoldii R.Br.",
  "region": "Sumatera",
  "description": "Plant description...",
  "benefits": ["Benefit 1", "Benefit 2"],
  "conservationStatus": "EN",
  "imageUrl": "https://...",
  "createdAt": "2025-07-24T13:56:47.107Z"
}
```

## 🌍 Supported Regions

- **Sumatera** - Western Indonesia
- **Jawa** - Central Java region
- **Kalimantan** - Borneo island
- **Sulawesi** - Celebes island
- **Papua** - Eastern Indonesia
- **Nusa Tenggara** - Lesser Sunda Islands
- **Maluku** - Moluccas islands

## 📊 Conservation Status Codes

- **EN** - Endangered
- **VU** - Vulnerable
- **CR** - Critically Endangered
- **LC** - Least Concern
- **NT** - Near Threatened

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer** - Modern React.js application
- **Backend Developer** - API and database management
- **UI/UX Designer** - User interface and experience design

## 🙏 Acknowledgments

- **Google Gemini AI** for plant identification technology
- **Wikipedia Commons** for plant images
- **Indonesian Biodiversity** research community
- **Open Source Community** for amazing tools and libraries

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for Indonesian biodiversity conservation**

[![GitHub stars](https://img.shields.io/github/stars/praditus343/lestar.in?style=social)](https://github.com/praditus343/lestar.in)
[![GitHub forks](https://img.shields.io/github/forks/praditus343/lestar.in?style=social)](https://github.com/praditus343/lestar.in)
[![GitHub issues](https://img.shields.io/github/issues/praditus343/lestar.in)](https://github.com/praditus343/lestar.in/issues)
[![GitHub license](https://img.shields.io/github/license/praditus343/lestar.in)](https://github.com/praditus343/lestar.in/blob/main/LICENSE)