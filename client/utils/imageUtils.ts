/**
 * Return a smaller/faster URL for remote images (Pexels, etc.)
 */
export function optimizeImageUrl(url: string, width: number = 800): string {
  if (!url || url.startsWith('data:') || url.startsWith('/')) {
    return url;
  }

  if (url.includes('images.pexels.com') && !url.includes('auto=compress')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}auto=compress&cs=tinysrgb&w=${width}`;
  }

  if (url.includes('images.unsplash.com') && !url.includes('w=')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}w=${width}&q=80&auto=format&fit=crop`;
  }

  return url;
}

/**
 * Preload an image URL in the background
 */
export function preloadImage(url: string): void {
  if (!url) return;
  const img = new Image();
  img.src = optimizeImageUrl(url);
}

/**
 * Compress and optimize image before converting to base64
 * This helps reduce localStorage size and improve performance
 */
export function compressImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with quality setting
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload image to server
 */
export async function uploadImageToServer(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    // Fallback to base64 if upload fails
    return compressImage(file);
  }
}

/**
 * Upload multiple images to server
 */
export async function uploadImagesToServer(images: string[]): Promise<string[]> {
  try {
    // Filter out already uploaded URLs
    const base64Images = images.filter(img => img.startsWith('data:image'));
    const existingUrls = images.filter(img => img.startsWith('http') || img.startsWith('/'));

    if (base64Images.length === 0) {
      return images; // All are already URLs
    }

    const response = await fetch('/api/upload/images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ images: base64Images }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload images');
    }

    const data = await response.json();
    return [...existingUrls, ...data.urls];
  } catch (error) {
    console.error('Error uploading images:', error);
    // Fallback to base64 if upload fails
    return images;
  }
}

/**
 * Check if localStorage has enough space
 */
export function checkLocalStorageSpace(): { available: boolean; message: string } {
  try {
    // Check localStorage quota (usually 5-10MB)
    const testKey = '__localStorage_test__';
    const testValue = 'x'.repeat(1024 * 1024); // 1MB test
    
    try {
      localStorage.setItem(testKey, testValue);
      localStorage.removeItem(testKey);
      return { available: true, message: 'Storage available' };
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        return { 
          available: false, 
          message: 'LocalStorage is full. Please use server upload instead.' 
        };
      }
      throw e;
    }
  } catch (error) {
    return { 
      available: false, 
      message: 'Could not check storage availability' 
    };
  }
}

