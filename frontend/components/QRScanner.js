import React, { useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useEffect } from 'react';
import Logo from './Logo';

const QRScanner = ({ isOpen, onClose }) => {
  const [scanner, setScanner] = useState(null);
  
  useEffect(() => {
    if (isOpen) {
      const html5QrCode = new Html5Qrcode("qr-reader");
      setScanner(html5QrCode);

      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Check if URL contains any of our subdomains
          const validDomains = [
            'ldn.bitdash.app',
            'adfaaly.bitdash.app'
          ];
          
          const isValidUrl = validDomains.some(domain => decodedText.includes(domain));
          
          if (isValidUrl) {
            html5QrCode.stop();
            onClose();
            window.location.href = decodedText;
          }
        },
        (error) => {
          console.error("QR Code scanning error:", error);
        }
      ).catch((err) => {
        console.error("Starting scanner failed:", err);
      });
    }

    return () => {
      if (scanner) {
        scanner.stop().catch(err => console.error("Failed to stop scanner:", err));
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      
      <div className="relative h-screen">
        <div id="qr-reader" className="w-full h-full" />
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full">
          <Logo className="h-8 w-auto" />
        </div>
      </div>
    </div>
  );
};

export default QRScanner;