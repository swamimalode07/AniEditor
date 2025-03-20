import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r bg-black shadow-lg p-4 text-white font-mono">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={"/"}>
          <h1 className="text-2xl font-extrabold tracking-widest">AniEditor</h1>
        </Link>
        <div className="hidden md:flex space-x-6 text-lg">
          <Link to="/" className="hover:text-yellow-300 transition duration-300">Home</Link>
          <Link to="/overlay" className="hover:text-yellow-300 transition duration-300">Editor</Link>
          <a 
            href="https://swamimalode.online" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-yellow-300 transition duration-300"
          >
            Contact
          </a>
        </div>
        <a 
          href="https://github.com/swamimalode07/AniEditor" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hidden md:block bg-yellow-400 text-gray-900 px-5 py-2 rounded-full shadow-md hover:bg-yellow-300 transition duration-300"
        >
          Star on GitHub
        </a>
        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden flex flex-col items-center space-y-4 mt-4 text-lg"
          >
            <Link to="/" className="hover:text-yellow-300 transition duration-300">Home</Link>
            <Link to="/overlay" className="hover:text-yellow-300 transition duration-300">Editor</Link>
            <a 
              href="https://swamimalode.online" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-300 transition duration-300"
            >
              Contact
            </a>
            <a 
              href="https://github.com/swamimalode07/AniEditor" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-yellow-400 text-gray-900 px-5 py-2 rounded-full shadow-md hover:bg-yellow-300 transition duration-300"
            >
              Star on GitHub
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
