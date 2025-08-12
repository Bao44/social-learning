const authService = require("../services/authService");

const authController = {
  async getUser(req, res) {
    try {
      const { data, error } = await authService.getUser();

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      const userData = { name };

      console.log("Registering user:", {
        email,
        password,
        userData,
      });

      // kiểm tra tồn tại nếu có

      const { data, error } = await authService.register(email, password, userData);

      console.log("authController register response CONTROLLER:", { data, error });

      if (error) {
        console.error("Error during registration:", error);
        return res.status(400).json({ success: false, message: error.message });
      }

      return res
        .status(201)
        .json({ success: true, data, message: "OTP sent successfully" });
    } catch (error) {
      console.log("Error during registration:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async verifyOtp(req, res) {
    try {
      const { phone, otp } = req.body;

      const { data, error } = await authService.verifyOtp(phone, otp);

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res
        .status(200)
        .json({ success: true, data, message: "Verified successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const { data, error } = await authService.login(email, password);

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res
        .status(200)
        .json({ success: true, data, message: "Login successful" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = authController;
