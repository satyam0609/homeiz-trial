import api from "@/config/api";
import { getCurrentUser } from "./utils";

export interface CachedUserDetails {
  id: string;
  name: string;
  avatar: string;
  profile?: string;
  email?: string;
}

// Get user details from cache or fetch from API
export const getCachedUserDetails = async (): Promise<CachedUserDetails | null> => {
  const storedUser = getCurrentUser();
  if (!storedUser) return null;

  // Check if we have detailed user info in localStorage
  const detailedUserKey = `userDetails_${storedUser.id}`;
  const cachedDetails = localStorage.getItem(detailedUserKey);
  
  if (cachedDetails) {
    try {
      const parsed = JSON.parse(cachedDetails);
      // Check if cache is still valid (optional: add timestamp check)
      return parsed;
    } catch (error) {
      console.log("Error parsing cached user details:", error);
      // Clear invalid cache
      localStorage.removeItem(detailedUserKey);
    }
  }

  // If no cached details, fetch from API and cache
  try {
    const userRes = await api.get(`/users/${storedUser.id}`);
    const userDetails = userRes?.data?.data ?? userRes?.data;
    
    if (userDetails) {
      const detailedUser: CachedUserDetails = {
        id: String(userDetails._id ?? userDetails.id),
        name: userDetails.name,
        avatar: userDetails.profile || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userDetails.name}`,
        profile: userDetails.profile,
        email: userDetails.email,
      };
      
      // Cache the detailed user info
      localStorage.setItem(detailedUserKey, JSON.stringify(detailedUser));
      return detailedUser;
    }
  } catch (error) {
    console.log("Error fetching user details:", error);
  }

  // Fallback to basic user info
  return {
    id: storedUser.id,
    name: storedUser.name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${storedUser.name}`,
  };
};

// Clear user details cache (call when user logs out or switches)
export const clearUserDetailsCache = (userId?: string) => {
  if (userId) {
    localStorage.removeItem(`userDetails_${userId}`);
  } else {
    // Clear all user details caches
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('userDetails_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

// Update cached user details (call when user profile is updated)
export const updateCachedUserDetails = (userId: string, updates: Partial<CachedUserDetails>) => {
  const detailedUserKey = `userDetails_${userId}`;
  const cachedDetails = localStorage.getItem(detailedUserKey);
  
  if (cachedDetails) {
    try {
      const parsed = JSON.parse(cachedDetails);
      const updated = { ...parsed, ...updates };
      localStorage.setItem(detailedUserKey, JSON.stringify(updated));
    } catch (error) {
      console.log("Error updating cached user details:", error);
    }
  }
};