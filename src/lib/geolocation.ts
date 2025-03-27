import { getDistance } from 'geolib';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Calculate distance between two coordinates in meters
 */
export const calculateDistance = (
  point1: Coordinates,
  point2: Coordinates
): number => {
  return getDistance(point1, point2);
};

/**
 * Check if a point is within a given radius of a center point
 */
export const isWithinPerimeter = (
  point: Coordinates,
  center: Coordinates,
  radiusInMeters: number
): boolean => {
  const distance = calculateDistance(point, center);
  return distance <= radiusInMeters;
};

/**
 * Get current position using browser's geolocation API
 */
export const getCurrentPosition = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true }
    );
  });
}; 