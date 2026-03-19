import api from "./api";

// 🔐 Register (send OTP)
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// 🔐 Verify OTP (create user)
export const verifyOtp = async (data) => {
  try {
    const response = await api.post("/auth/verify-otp", data);

    // ✅ Store token after successful verification
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "OTP verification failed" };
  }
};

// 🔐 Login
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);

    // ✅ Store token
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// 🔓 Logout
export const logout = () => {
  localStorage.removeItem("token");
};