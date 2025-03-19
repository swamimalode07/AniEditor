import { useState, useRef, useEffect } from "react";
import "./index.css"
import Navbar from "./navbar/Navbar";

function Editor() {
  const [image, setImage] = useState(null);
  const [overlayItems, setOverlayItems] = useState([]); // Array to store multiple overlays
  const [selectedOverlay, setSelectedOverlay] = useState(null); // Currently selected overlay for editing
  const [imageFilter, setImageFilter] = useState('none'); // Added for image filters
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState(100); // Overlay size
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null); // Reference to uploaded image container
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0.9);
  const [downloadQuality, setDownloadQuality] = useState('high');
  const [animations, setAnimations] = useState({});

  

  const overlays = [
    "/overlays/overlay1.png",
    "/overlays/overlay2.png",
    "/overlays/overlay3.png",
  ];

  const filters = {
    none: 'None',
    grayscale: 'Grayscale',
    sepia: 'Sepia',
    blur: 'Blur',
    brightness: 'Bright',
    contrast: 'High Contrast',
  };

  const animationTypes = {
    none: 'No Animation',
    'bounce-animation': 'Bounce',
    'pulse-animation': 'Pulse',
    'shake-animation': 'Shake',
    'spin-animation': 'Spin',
    'float-animation': 'Float'
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setOverlayItems([]);
    setSelectedOverlay(null);
    setPosition({ x: 100, y: 100 });
    setSize(100);
  };

  const addOverlay = (src) => {
    const newOverlay = {
      id: Date.now(),
      src,
      position: { x: 100, y: 100 },
      size: 100,
      rotation: 0,
      flipX: false,
      flipY: false,
    };
    setOverlayItems([...overlayItems, newOverlay]);
    setSelectedOverlay(newOverlay.id);
  };

  const updateOverlayPosition = (id, newPosition) => {
    setOverlayItems(overlayItems.map(item => 
      item.id === id ? { ...item, position: newPosition } : item
    ));
  };

  const updateOverlaySize = (id, newSize) => {
    setOverlayItems(overlayItems.map(item => 
      item.id === id ? { ...item, size: newSize } : item
    ));
  };

  const removeOverlay = (id) => {
    setOverlayItems(overlayItems.filter(item => item.id !== id));
    if (selectedOverlay === id) setSelectedOverlay(null);
  };

  const handleMouseDown = (e, id) => {
    isDragging.current = true;
    setSelectedOverlay(id);
    const overlay = overlayItems.find(item => item.id === id);
    dragOffset.current = {
      x: e.clientX - overlay.position.x,
      y: e.clientY - overlay.position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !selectedOverlay) return;
    if (!imageRef.current) return;

    const container = imageRef.current.getBoundingClientRect();
    const overlay = overlayItems.find(item => item.id === selectedOverlay);
    if (!overlay) return;
    
    const newX = e.clientX - dragOffset.current.x;
    const newY = e.clientY - dragOffset.current.y;

    updateOverlayPosition(selectedOverlay, {
      x: Math.max(0, Math.min(newX, container.width - overlay.size)),
      y: Math.max(0, Math.min(newY, container.height - overlay.size)),
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const toggleAnimation = (id, type) => {
    setAnimations(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type
    }));
  };

  const handleDownload = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const container = imageRef.current;
    
    const scale = downloadQuality === 'high' ? 2 : 1;
    canvas.width = container.offsetWidth * scale;
    canvas.height = container.offsetHeight * scale;
    
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const img = new Image();
    img.src = image;
    await new Promise(resolve => img.onload = resolve);
    
    if (imageFilter !== 'none') {
      ctx.filter = `${imageFilter}(${
        imageFilter === 'blur' ? '4px' : 
        imageFilter === 'brightness' ? '130%' : 
        imageFilter === 'contrast' ? '150%' : '1'
      })`;
    }
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    for (const item of overlayItems) {
      const overlay = new Image();
      overlay.src = item.src;
      await new Promise(resolve => overlay.onload = resolve);
      
      ctx.save();
      ctx.globalAlpha = overlayOpacity;
      
      const centerX = (item.position.x + item.size/2) * scale;
      const centerY = (item.position.y + item.size/2) * scale;
      
      ctx.translate(centerX, centerY);
      ctx.rotate((item.rotation || 0) * Math.PI/180);
      ctx.scale(item.flipX ? -1 : 1, item.flipY ? -1 : 1);
      
      ctx.drawImage(
        overlay, 
        -item.size/2 * scale, 
        -item.size/2 * scale, 
        item.size * scale, 
        item.size * scale
      );
      
      ctx.restore();
    }
    
    const link = document.createElement('a');
    link.download = 'anime-overlay-creation.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [overlayItems, selectedOverlay]);

  return (
   <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 relative">
      <h1 className="text-4xl font-bold mb-6">Anime Overlay Editor</h1>

      <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mb-4 transition">
        Upload Image
        <input type="file" onChange={handleImageUpload} className="hidden" />
      </label>

      {image && (
        <button
          onClick={handleRemoveImage}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mb-4 transition"
        >
          Remove Image
        </button>
      )}

      <div
        ref={imageRef}
        className="relative w-[400px] h-[400px] bg-gray-800 border border-gray-500 rounded-lg shadow-lg flex items-center justify-center overflow-hidden"
      >
        {image && (
          <img 
            src={image} 
            alt="Uploaded" 
            className="absolute w-full h-full object-contain z-10"
            style={{ filter: imageFilter !== 'none' ? `${imageFilter}(${
              imageFilter === 'blur' ? '4px' : 
              imageFilter === 'brightness' ? '130%' : 
              imageFilter === 'contrast' ? '150%' : '1'
            })` : 'none' }}
          />
        )}
        {overlayItems.map((item) => (
          <img
            key={item.id}
            src={item.src}
            alt="Overlay"
            className={`
              absolute object-contain cursor-grab z-20
              ${selectedOverlay === item.id ? 'ring-2 ring-blue-500' : ''}
              ${animations[item.id] || ''}
            `}
            style={{
              width: `${item.size}px`,
              height: `${item.size}px`,
              left: `${item.position.x}px`,
              top: `${item.position.y}px`,
              opacity: overlayOpacity,
              transform: `
                rotate(${item.rotation || 0}deg)
                scaleX(${item.flipX ? -1 : 1})
                scaleY(${item.flipY ? -1 : 1})
              `,
              transformOrigin: 'center center',
            }}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
          />
        ))}
      </div>

      {image && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Filters:</h2>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(filters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setImageFilter(key)}
                className={`px-3 py-1 rounded ${
                  imageFilter === key ? 'bg-blue-600' : 'bg-gray-700'
                } hover:bg-blue-700 transition`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Add Overlays:</h2>
      <div className="flex gap-4">
        {overlays.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Overlay ${index}`}
            className="w-20 h-20 cursor-pointer border-2 border-transparent hover:border-blue-500 rounded-lg shadow-md transition"
            onClick={() => addOverlay(src)}
          />
        ))}
      </div>

      {selectedOverlay && (
        <div className="absolute top-[50%] right-10 transform -translate-y-[50%] bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center gap-4">
          <label className="text-sm mb-2 font-semibold">Size</label>
          <input
            type="range"
            min="50"
            max="200"
            value={overlayItems.find(item => item.id === selectedOverlay)?.size || 100}
            onChange={(e) => {
              const newSize = parseInt(e.target.value);
              updateOverlaySize(selectedOverlay, newSize);
            }}
            className="w-32 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
          <div className="w-full">
            <label className="text-sm mb-1 block">Rotation</label>
            <input
              type="range"
              min="0"
              max="360"
              value={overlayItems.find(item => item.id === selectedOverlay)?.rotation || 0}
              onChange={(e) => {
                const newRotation = parseInt(e.target.value);
                setOverlayItems(items => items.map(item =>
                  item.id === selectedOverlay ? { ...item, rotation: newRotation } : item
                ));
              }}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setOverlayItems(items => items.map(item =>
                item.id === selectedOverlay ? { ...item, flipX: !item.flipX } : item
              ))}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              Flip X
            </button>
            <button
              onClick={() => setOverlayItems(items => items.map(item =>
                item.id === selectedOverlay ? { ...item, flipY: !item.flipY } : item
              ))}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              Flip Y
            </button>
          </div>
          <div className="w-full">
            <label className="text-sm mb-1 block">Animation</label>
            <select
              value={animations[selectedOverlay] || 'none'}
              onChange={(e) => toggleAnimation(selectedOverlay, e.target.value)}
              className="w-full bg-gray-700 rounded px-2 py-1"
            >
              {Object.entries(animationTypes).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="text-sm mb-1 block">Opacity</label>
            <input
              type="range"
              min="0"
              max="100"
              value={overlayOpacity * 100}
              onChange={(e) => setOverlayOpacity(parseInt(e.target.value) / 100)}
              className="w-full"
            />
          </div>
          <button
            onClick={() => removeOverlay(selectedOverlay)}
            className="mt-4 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Remove Overlay
          </button>
        </div>
      )}

      {image && overlayItems.length > 0 && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <select
            value={downloadQuality}
            onChange={(e) => setDownloadQuality(e.target.value)}
            className="bg-gray-700 rounded px-3 py-1"
          >
            <option value="normal">Normal Quality</option>
            <option value="high">High Quality</option>
          </select>
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
          >
            Download Creation
          </button>
        </div>
      )}
    </div>
    </>
  );
}

export default Editor;
