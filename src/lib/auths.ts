// src/lib/auth.ts
import { auth } from "@/auth"; // Import from your central auth config

// For App Router API routes
export const getSession = async () => {
    return await auth();
};

// Alternative: Direct usage in API routes
export { auth };