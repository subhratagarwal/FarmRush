// components/ImageSearchModal.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function ImageSearchModal({ query, onClose, onSelect }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const accessKey = "VHH2CaOrqw0jLhINQEGwnrnF_lUhMubnfjuJ9ykca1c";
      try {
        const res = await axios.get(
          `https://api.unsplash.com/search/photos?query=${query}&client_id=${accessKey}`
        );
        setImages(res.data.results);
      } catch (err) {
        console.error("Failed to fetch images", err);
      }
    };
    if (query) fetchImages();
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-white p-4 max-w-4xl rounded-lg shadow-lg overflow-y-auto h-[80%] w-[90%]">
        <h2 className="text-xl font-semibold mb-2">Choose an Image</h2>
        <button onClick={onClose} className="absolute top-4 right-6 text-gray-600">✖</button>
        <div className="grid grid-cols-3 gap-4">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.urls.small}
              alt="result"
              className="cursor-pointer hover:scale-105 transition"
              onClick={() => onSelect(img.urls.small)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
