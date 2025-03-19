import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Image, Zap } from "lucide-react";
import Navbar from "../src/navbar/Navbar"


export default function Landing() {
  const images = [
    "./overlays/overlay1.png",
    "./overlays/overlay2.png",
    "./overlays/overlay3.png"
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Navbar/>
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-screen flex flex-col items-center justify-center relative bg-black px-6 md:px-12"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-transparent"></div>

        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-10 relative z-10 w-full">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full md:w-1/2 space-y-6 text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl font-bold  mt-[-100px] text-gray-100 leading-tight">
              Instant Anime Overlays
            </h1>
            <p className="text-base md:text-lg text-gray-400 leading-relaxed">
              Elevate your images with stunning anime overlays. Simple, fast, and high-quality.
            </p>
            <div className="flex gap-4 justify-center  mt-[-10px] md:justify-start">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-yellow-300 text-black px-5 md:px-6 py-2 md:py-3 rounded-2xl font-semibold shadow-md hover:bg-yellow-400 transition-transform transform"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <motion.img
              key={currentImage}
              src={images[currentImage]}
              alt="Anime Character"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg shadow-lg w-[80%] md:w-[500px] h-auto object-contain transform scale-x-[-1] transition-all duration-500"
            />
          </motion.div>
        </div>
      </motion.section>


  

      {/* Features Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Why Choose AniEditor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <CheckCircle size={40} className="mx-auto mb-4 text-yellow-300" />
              <h3 className="text-xl font-semibold">High-Quality Overlays</h3>
              <p className="text-gray-400 mt-2">Crisp, detailed overlays that enhance your images instantly.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
             <Zap size={40} className="mx-auto mb-4 text-yellow-300" />

              <h3 className="text-xl font-semibold">Fast & Easy to Use</h3>
              <p className="text-gray-400 mt-2">No complex tools—just upload, overlay, and save.</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <Image size={40} className="mx-auto mb-4 text-yellow-300" />
              <h3 className="text-xl font-semibold">Multiple Overlay Choices</h3>
              <p className="text-gray-400 mt-2">A variety of anime overlays to fit your style.</p>
            </motion.div>
          </div>
        </div>
      </section>
      <footer className="py-6 bg-black text-gray-400 text-center">
        <p>&copy; {new Date().getFullYear()} Anime Overlay. All rights reserved.</p>
      </footer>
    </>
  );
}
