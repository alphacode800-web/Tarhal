/**
 * Utility functions for video upload and processing
 */

/**
 * Uploads a video file to the server
 * @param file - The video file to upload
 * @returns Promise<string> - The URL of the uploaded video
 */
export async function uploadVideoToServer(file: File): Promise<string> {
  try {
    const response = await fetch('/api/upload/video', {
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload video: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
}

/**
 * Converts a video file to a data URL (base64)
 * Note: This is not recommended for large videos due to localStorage limitations
 * @param file - The video file to convert
 * @returns Promise<string> - The data URL of the video
 */
export async function videoToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validates if a file is a valid video file
 * @param file - The file to validate
 * @returns boolean - True if the file is a valid video
 */
export function isValidVideoFile(file: File): boolean {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
  return validTypes.includes(file.type);
}

/**
 * Gets the file size in MB
 * @param file - The file to get size for
 * @returns number - File size in MB
 */
export function getFileSizeMB(file: File): number {
  return file.size / (1024 * 1024);
}

