const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    const authState = JSON.parse(localStorage.getItem("admin-auth") || "{}");
    return authState?.state?.token || null;
  }

  // Public request without auth
  private async publicRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const config: RequestInit = {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `Request failed with status ${response.status}`,
        }));
        throw new Error(
          error.message || `API request failed: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);

      // Don't throw in server-side rendering, return null instead
      if (typeof window === "undefined") {
        console.warn(
          `Server-side API request failed for ${endpoint}, returning null`
        );
        return null;
      }

      throw error;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const token = this.getAuthToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const config: RequestInit = {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: `Request failed with status ${response.status}`,
        }));
        throw new Error(
          error.message || `API request failed: ${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      console.error(`Authenticated API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("searchTerm", params.search);
    if (params?.categoryId) searchParams.set("categoryId", params.categoryId);

    return this.request(`/products?${searchParams.toString()}`);
  }

  // Public product endpoints (no auth required)
  async getPublicProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("searchTerm", params.search);
    if (params?.categoryId) searchParams.set("categoryId", params.categoryId);

    return this.publicRequest(`/products?${searchParams.toString()}`);
  }

  async getPublicProduct(id: string) {
    return this.publicRequest(`/products/${id}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Category endpoints
  async getCategories() {
    return this.request("/categories");
  }

  // Public category endpoints (no auth required)
  async getPublicCategories() {
    return this.publicRequest("/categories");
  }

  async createCategory(categoryData: { name: string }) {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: { name: string }) {
    return this.request(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Order endpoints
  async getOrders(params?: { page?: number; limit?: number; status?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.status) searchParams.set("status", params.status);

    return this.request(`/orders?${searchParams.toString()}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async deleteOrder(id: string) {
    return this.request(`/orders/${id}`, {
      method: "DELETE",
    });
  }

  // Size endpoints
  async getSizes(params?: {
    page?: number;
    limit?: number;
    productId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.productId) searchParams.set("productId", params.productId);

    const query = searchParams.toString();
    return this.request(`/sizes${query ? `?${query}` : ""}`);
  }

  async createSize(sizeData: {
    name: string;
    stock: number;
    productId: string;
  }) {
    return this.request("/sizes", {
      method: "POST",
      body: JSON.stringify(sizeData),
    });
  }

  async updateSize(id: string, sizeData: { name?: string; stock?: number }) {
    return this.request(`/sizes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(sizeData),
    });
  }

  async deleteSize(id: string) {
    return this.request(`/sizes/${id}`, {
      method: "DELETE",
    });
  }

  // Public order endpoint
  async createPublicOrder(orderData: {
    customerName: string;
    address: string;
    contactNumber: string;
    productId: string;
    totalPrice: number;
    status: string;
  }) {
    return this.publicRequest("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  // Hero Settings endpoints
  async getHeroSettings() {
    return this.publicRequest("/hero");
  }

  async updateHeroSettings(
    id: string,
    heroData: {
      title?: string;
      subtitle?: string;
      primaryBtnText?: string;
      primaryBtnLink?: string;
      secondaryBtnText?: string;
      secondaryBtnLink?: string;
      backgroundImage?: string;
      isActive?: boolean;
    }
  ) {
    return this.request(`/hero/${id}`, {
      method: "PATCH",
      body: JSON.stringify(heroData),
    });
  }

  // Size Guide endpoints
  async getSizeGuides() {
    return this.request("/size-guides");
  }

  async getSizeGuideByCategory(categoryId: string) {
    return this.publicRequest(`/size-guides/category/${categoryId}`);
  }

  async createSizeGuide(sizeGuideData: {
    name: string;
    imageUrl: string;
    categoryId: string;
    isActive?: boolean;
  }) {
    return this.request("/size-guides", {
      method: "POST",
      body: JSON.stringify(sizeGuideData),
    });
  }

  async updateSizeGuide(
    id: string,
    sizeGuideData: {
      name?: string;
      imageUrl?: string;
      categoryId?: string;
      isActive?: boolean;
    }
  ) {
    return this.request(`/size-guides/${id}`, {
      method: "PATCH",
      body: JSON.stringify(sizeGuideData),
    });
  }

  async deleteSizeGuide(id: string) {
    return this.request(`/size-guides/${id}`, {
      method: "DELETE",
    });
  }

  // Contact Message endpoints
  async createContactMessage(contactData: {
    name: string;
    email: string;
    message: string;
  }) {
    return this.publicRequest("/contact-messages/add", {
      method: "POST",
      body: JSON.stringify(contactData),
    });
  }

  async getContactMessages() {
    return this.request("/contact-messages");
  }

  async markContactMessageAsRead(id: string) {
    return this.request(`/contact-messages/${id}`, {
      method: "PATCH",
    });
  }

  async deleteContactMessage(id: string) {
    return this.request(`/contact-messages/${id}`, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
