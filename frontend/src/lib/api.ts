// Configuración de API para conectar con MedusaJS backend
const API_BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

export const apiRoutes = {
  // Store API routes
  health: `${API_BASE_URL}/health`,
  store: {
    products: `${API_BASE_URL}/store/products`,
    collections: `${API_BASE_URL}/store/collections`,
    regions: `${API_BASE_URL}/store/regions`,
    cart: `${API_BASE_URL}/store/carts`,
  },
  
  // Admin API routes (para futuro)
  admin: {
    auth: `${API_BASE_URL}/admin/auth`,
    products: `${API_BASE_URL}/admin/products`,
    orders: `${API_BASE_URL}/admin/orders`,
  }
};

// Headers por defecto para las requests
export const defaultHeaders = {
  'Content-Type': 'application/json',
  // Nota: x-publishable-api-key será necesario para la store API
  // Lo configuraremos cuando conectemos con MedusaJS real
};

// Helper function para hacer requests a la API
export async function apiRequest(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

export default apiRoutes;
