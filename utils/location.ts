
import { Hospital } from '../types';

// Haversine formula to calculate distance between two points in km
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

export const findNearestHospital = (
  userLat: number,
  userLng: number,
  hospitals: Hospital[],
  maxDistanceKm: number = 50 // Default search radius
): { hospital: Hospital; distance: number } | null => {
  let nearest: Hospital | null = null;
  let minDistance = Infinity;

  hospitals.forEach((hospital) => {
    if (hospital.location) {
      const distance = calculateDistance(userLat, userLng, hospital.location.lat, hospital.location.lng);
      if (distance < minDistance && distance <= maxDistanceKm) {
        minDistance = distance;
        nearest = hospital;
      }
    }
  });

  if (nearest) {
    return { hospital: nearest, distance: minDistance };
  }
  return null;
};
