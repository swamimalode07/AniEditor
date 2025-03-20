import { useState, useRef, useEffect } from "react";
import "./index.css";
import Navbar from "./navbar/Navbar";
import { useNavigate } from "react-router-dom";

function Editor() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [overlayItems, setOverlayItems] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [imageFilter, setImageFilter] = useState('none');
  const [overlayOpacity, setOverlayOpacity] = useState(0.9);
  const [downloadQuality, setDownloadQuality] = useState('high');
  const [animations, setAnimations] = useState({});
  const [overlaySearchTerm, setOverlaySearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overlays"); 
  
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const customOverlayRef = useRef(null);

  const overlays = [
    "/overlays/overlay1.png",
    "/overlays/overlay2.png",
    "/overlays/overlay3.png",
    "/overlays/naruto.png",
     "/overlays/character.webp",
     "/overlays/cute.png",
     "/overlays/girlpink.png",
     "/overlays/onepiece2.png",
     "/overlays/animegirl.png",
     "/overlays/animechar.png",
     "/overlays/onepiece.png",
     "/overlays/animeboy.png",
     "/overlays/chika.png",
     "/overlays/cute.png",
    
    "/overlays/anime.webp",
    "/overlays/onepunchman3.webp",
    "/overlays/onepiece.webp",
    "/overlays/tanjiro.webp",
    "/overlays/onepunchman2.webp",
    "/overlays/naruto3.webp",
    "/overlays/ash.webp",
    "/overlays/naruto2.webp",
    "/overlays/goku3.webp",
    "/overlays/naruto1.webp",
    "/overlays/goku2.webp",
   
    "/overlays/animegirl4.png",
    "/overlays/naruto4.png",
    "/overlays/naruto5.png",
    "/overlays/girlpink.png",
   
    "/overlays/animegirl2.png",
    
  ];

  const filters = {
    none: 'None',
    grayscale: 'Gray',
    sepia: 'Sepia',
    blur: 'Blur',
    brightness: 'Bright',
    contrast: 'Contrast',
  };

  const animationTypes = {
    none: 'None',
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

  const handleCustomOverlayUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const newOverlay = {
          id: Date.now(),
          src: reader.result,
          position: { x: 100, y: 100 },
          size: 100,
          rotation: 0,
          flipX: false,
          flipY: false,
          isCustom: true
        };
        setOverlayItems([...overlayItems, newOverlay]);
        setSelectedOverlay(newOverlay.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setOverlayItems([]);
    setSelectedOverlay(null);
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
    
    const img = new Image();
    img.src = image;
    await new Promise(resolve => img.onload = resolve);
    
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;
    
    const scale = downloadQuality === 'high' ? 2 : 1;
    canvas.width = naturalWidth * scale;
    canvas.height = naturalHeight * scale;
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (imageFilter !== 'none') {
      ctx.filter = `${imageFilter}(${
        imageFilter === 'blur' ? '4px' : 
        imageFilter === 'brightness' ? '130%' : 
        imageFilter === 'contrast' ? '150%' : '1'
      })`;
    } else {
      ctx.filter = 'none';
    }
    
    ctx.drawImage(img, 0, 0, naturalWidth * scale, naturalHeight * scale);
    ctx.filter = 'none'; // Reset filter for overlays
    
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const imageAspect = naturalWidth / naturalHeight;
    const containerAspect = containerWidth / containerHeight;
    
    let displayedWidth, displayedHeight, offsetX, offsetY;
    
    if (imageAspect > containerAspect) {
      displayedWidth = containerWidth;
      displayedHeight = containerWidth / imageAspect;
    } else {
      displayedHeight = containerHeight;
      displayedWidth = containerHeight * imageAspect;
    }
    
    offsetX = (containerWidth - displayedWidth) / 2;
    offsetY = (containerHeight - displayedHeight) / 2;
    const scaleFactor = displayedWidth / naturalWidth;
    
    for (const item of overlayItems) {
      const overlay = new Image();
      overlay.src = item.src;
      await new Promise(resolve => overlay.onload = resolve);
      
      ctx.save();
      ctx.globalAlpha = overlayOpacity;
      
      const containerX = item.position.x - offsetX;
      const containerY = item.position.y - offsetY;
      const originalX = (containerX / scaleFactor) * scale;
      const originalY = (containerY / scaleFactor) * scale;
      const originalSize = (item.size / scaleFactor) * scale;
      
      const centerX = originalX + originalSize/2;
      const centerY = originalY + originalSize/2;
      
      ctx.translate(centerX, centerY);
      ctx.rotate((item.rotation || 0) * Math.PI/180);
      ctx.scale(item.flipX ? -1 : 1, item.flipY ? -1 : 1);
      
      ctx.drawImage(
        overlay,
        -originalSize/2,
        -originalSize/2,
        originalSize,
        originalSize
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

  const selectedItem = overlayItems.find(item => item.id === selectedOverlay);

  const filteredOverlays = overlays.filter(src => 
    src.toLowerCase().includes(overlaySearchTerm.toLowerCase())
  );

  return (
    <>
   
      <div className="bg-black text-white min-h-screen flex flex-col">
        <div className="bg-gray-900 py-3 px-6 border-b border-gray-800 flex items-center justify-between">
          <h1  style={{ cursor:"pointer" }}   onClick={() => navigate("/")} className="text-xl font-bold">Anime Overlay Editor</h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fileInputRef.current.click()}
              className="bg-yellow-500 mr-150 hover:bg-yellow-600 text-black font-medium py-1.5 px-3 rounded-md text-sm"
            >
              Upload Image
            </button>
            <input 
              ref={fileInputRef}
              type="file" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
            {image && (
              <button
                onClick={handleRemoveImage}
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-1.5 px-3 rounded-md text-sm"
              >
                Remove Image
              </button>
            )}
            {image && overlayItems.length > 0 && (
              <button
                onClick={handleDownload}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-1.5 px-3 rounded-md text-sm"
              >
                Download
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 max-h-[calc(100vh-115px)]"> 
          <div className="w-3/5 p-4 flex flex-col">
            <div 
              ref={imageRef}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative"
            >
              {image ? (
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
              ) : (
                <div className="text-gray-500 flex flex-col items-center">
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-lg">Upload an image to get started</p>
                </div>
              )}
              
              {overlayItems.map((item) => (
                <img
                  key={item.id}
                  src={item.src}
                  alt="Overlay"
                  className={`
                    absolute object-contain cursor-grab z-20
                    ${selectedOverlay === item.id ? 'ring-2 ring-yellow-500' : ''}
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
          </div>

          <div className="w-2/5 bg-gray-950 flex flex-col">
            <div className="flex border-b border-gray-800 bg-gray-900">
              <button 
                onClick={() => setActiveTab("overlays")}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === "overlays" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
                }`}
              >
                Overlays
              </button>
              {selectedOverlay && (
                <button 
                  onClick={() => setActiveTab("edit")}
                  className={`flex-1 py-3 text-sm font-medium transition ${
                    activeTab === "edit" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Edit Overlay
                </button>
              )}
              <button 
                onClick={() => setActiveTab("filters")}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === "filters" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
                }`}
              >
                Filters
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === "settings" ? "text-yellow-500 border-b-2 border-yellow-500" : "text-gray-400 hover:text-white"
                }`}
              >
                Settings
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "overlays" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-yellow-500">Available Overlays</h2>
                    <button 
                      onClick={() => customOverlayRef.current.click()}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-1.5 px-3 rounded-md text-xs"
                    >
                      Upload Custom
                    </button>
                    <input 
                      ref={customOverlayRef}
                      type="file" 
                      accept="image/*"
                      onChange={handleCustomOverlayUpload} 
                      className="hidden" 
                    />
                  </div>
                  
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search by Anime names..."
                      value={overlaySearchTerm}
                      onChange={(e) => setOverlaySearchTerm(e.target.value)}
                      className="w-full bg-gray-800 text-white rounded-md py-2 px-3 text-sm border border-gray-700 focus:outline-none focus:border-yellow-500 pl-9"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {filteredOverlays.map((src, index) => (
                      <div 
                        key={index}
                        className="aspect-square bg-gray-900 p-1.5 rounded border border-gray-800 hover:border-yellow-500 cursor-pointer transition flex items-center justify-center"
                        onClick={() => addOverlay(src)}
                      >
                        <img src={src} alt={`Overlay ${index + 1}`} className="max-w-full max-h-full" />
                      </div>
                    ))}
                    {filteredOverlays.length === 0 && (
                      <div className="col-span-4 py-8 text-center text-gray-400">
                        No matching overlays found
                      </div>
                    )}
                  </div>
                  
                  {overlayItems.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Active Overlays</h3>
                      <div className="flex flex-wrap gap-2">
                        {overlayItems.map((item) => (
                          <div 
                            key={item.id}
                            className={`relative p-1 border rounded ${
                              selectedOverlay === item.id 
                                ? 'border-yellow-500' 
                                : 'border-gray-700'
                            }`}
                            onClick={() => {
                              setSelectedOverlay(item.id);
                              setActiveTab("edit");
                            }}
                          >
                            <img src={item.src} alt="Active overlay" className="w-10 h-10 object-contain" />
                            <button
                              className="absolute -top-2 -right-2 bg-red-600 rounded-full w-4 h-4 flex items-center justify-center text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeOverlay(item.id);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "edit" && selectedItem && (
                <div className="space-y-5">
                  <h2 className="text-lg font-medium text-yellow-500">Edit Overlay</h2>
                  
                  <div>
                    <label className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Size</span>
                      <span className="text-sm text-gray-400">{selectedItem?.size}px</span>
                    </label>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      value={selectedItem?.size || 100}
                      onChange={(e) => updateOverlaySize(selectedOverlay, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Rotation</span>
                      <span className="text-sm text-gray-400">{selectedItem?.rotation || 0}°</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={selectedItem?.rotation || 0}
                      onChange={(e) => {
                        setOverlayItems(items => items.map(item =>
                          item.id === selectedOverlay ? { ...item, rotation: parseInt(e.target.value) } : item
                        ));
                      }}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Opacity</span>
                      <span className="text-sm text-gray-400">{Math.round(overlayOpacity * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={overlayOpacity * 100}
                      onChange={(e) => setOverlayOpacity(parseInt(e.target.value) / 100)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setOverlayItems(items => items.map(item =>
                        item.id === selectedOverlay ? { ...item, flipX: !item.flipX } : item
                      ))}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                        selectedItem?.flipX 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      } transition`}
                    >
                      Flip X
                    </button>
                    <button
                      onClick={() => setOverlayItems(items => items.map(item =>
                        item.id === selectedOverlay ? { ...item, flipY: !item.flipY } : item
                      ))}
                      className={`flex-1 px-3 py-2 rounded text-sm font-medium ${
                        selectedItem?.flipY 
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      } transition`}
                    >
                      Flip Y
                    </button>
                  </div>
                  
                  {/* Animation Control */}
                  {/* <div>
                    <label className="block text-sm font-medium mb-2">Animation</label>
                    <select
                      value={animations[selectedOverlay] || 'none'}
                      onChange={(e) => toggleAnimation(selectedOverlay, e.target.value)}
                      className="w-full bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-yellow-500"
                    >
                      {Object.entries(animationTypes).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div> */}
                  
                  <div className="bg-gray-900 p-3 rounded text-sm">
                    <div className="flex justify-between">
                      <span>X Position:</span>
                      <span>{Math.round(selectedItem.position.x)}px</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Y Position:</span>
                      <span>{Math.round(selectedItem.position.y)}px</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeOverlay(selectedOverlay)}
                    className="w-full bg-red-900 hover:bg-red-800 text-white font-medium py-2 px-4 rounded text-sm transition mt-4"
                  >
                    Remove Overlay
                  </button>
                </div>
              )}
              
              {activeTab === "filters" && (
                <div>
                  <h2 className="text-lg font-medium text-yellow-500 mb-4">Image Filters</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(filters).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setImageFilter(key)}
                        className={`px-3 py-2 rounded text-sm font-medium
                          ${imageFilter === key 
                            ? 'bg-yellow-500 text-black' 
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                          } transition`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  
                  {image && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-400 mb-3">Filter Preview</h3>
                      <div className="aspect-video bg-gray-900 border border-gray-800 rounded overflow-hidden">
                        <img 
                          src={image} 
                          alt="Filter preview" 
                          className="w-full h-full object-contain"
                          style={{ filter: imageFilter !== 'none' ? `${imageFilter}(${
                            imageFilter === 'blur' ? '4px' : 
                            imageFilter === 'brightness' ? '130%' : 
                            imageFilter === 'contrast' ? '150%' : '1'
                          })` : 'none' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-lg font-medium text-yellow-500 mb-4">Export Settings</h2>
                  
                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Download Quality</label>
                    <select
                      value={downloadQuality}
                      onChange={(e) => setDownloadQuality(e.target.value)}
                      className="w-full bg-gray-800 rounded px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-yellow-500"
                    >
                      <option value="normal">Normal Quality</option>
                      <option value="high">High Quality</option>
                    </select>
                  </div>
                  
                  {image && overlayItems.length > 0 && (
                    <button
                      onClick={handleDownload}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-3 px-4 rounded text-sm transition mt-4"
                    >
                      Download Creation
                    </button>
                  )}
                  
                  <div className="mt-6 bg-gray-900 p-4 rounded text-sm text-gray-400">
                    <h3 className="font-medium text-white mb-2">Quick Tips</h3>
                    <ul className="space-y-2">
                      <li>• Click on overlays to add them to your image</li>
                      <li>• Drag overlays to position them</li>
                      <li>• Select an overlay to edit its properties</li>
                      <li>• Upload your own custom overlays</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </> 
  );
}

export default Editor;