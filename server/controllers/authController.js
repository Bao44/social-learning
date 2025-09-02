const authService = require("../services/authService");
const supabase = require("../lib/supabase").supabase;

const authController = {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // kiểm tra tồn tại nếu có
      const { data: existingUser, err } = await supabase.auth.admin.listUsers();
      const existing = existingUser.users.find((u) => u.email === email);
      if (existing) {
        if (existing.confirmed_at) {
          return res
            .status(200)
            .json({ success: false, message: "Email đã tồn tại" });
        }

        // Gửi lại OTP nếu tồn tại email nhưng chưa xác nhận
        const { error: resendError } = await supabase.auth.resend({
          type: "signup",
          email,
        });

        if (resendError) throw resendError;
        return res.status(200).json({
          message: "Đã gửi lại OTP",
        });
      }

      const { data, error } = await authService.register(email, password, name);

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(201).json({
        success: true,
        data,
        message: "Vui lòng kiểm tra email để lấy OTP.",
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async verifyRegisterOtp(req, res) {
    try {
      const { email, otp } = req.body;

      const { data, error } = await authService.verifyRegisterOtp(email, otp);

      if (error) {
        return res.status(400).json({ success: false, message: error.message });
      }

      return res
        .status(200)
        .json({ success: true, data, message: "Xác thực thành công." });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async resendRegisterOtp(req, res) {
    try {
      const { email } = req.body;
      console.log(email);
      // Gửi lại OTP nếu tồn tại email nhưng chưa xác nhận
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;
      return res.status(200).json({
        message: "Đã gửi lại OTP",
      });
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
        .json({ success: true, data, message: "Đăng nhập thành công." });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = authController;
