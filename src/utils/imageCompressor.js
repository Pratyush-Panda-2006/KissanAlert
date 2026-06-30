/**
 * Compresses a base64 image data URL to keep it under local storage and network payload limits.
 * Resizes the image if it exceeds maxWidth/maxHeight and lowers quality.
 * 
 * @param {string} dataUrl - The base64 data URL to compress
 * @param {number} maxWidth - Maximum width or height of the image
 * @param {number} quality - Image quality from 0 to 1
 * @returns {Promise<string>} The compressed data URL
 */
export function compressImage(dataUrl, maxWidth = 600, quality = 0.6) {
  return new Promise((resolve) => {
    // If it's not a data URL or is already small/empty, return as-is
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:') || dataUrl.length < 50 * 1024) {
      return resolve(dataUrl);
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(dataUrl);
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      } catch (err) {
        console.error('Error compressing image:', err);
        resolve(dataUrl);
      }
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
  });
}
