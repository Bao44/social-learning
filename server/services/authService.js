const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://elddxlqldfdnalelyodv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZGR4bHFsZGZkbmFsZWx5b2R2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTAxMTkyNCwiZXhwIjoyMDcwNTg3OTI0fQ.b6haXm4zMf_uBhZUEGfYSvK0wNpKVC_i4bOH4g1QlEE";

const supabase = createClient(supabaseUrl, supabaseKey);

function formatPhoneVN(phone) {
  phone = phone.trim();
  if (phone.startsWith("0")) {
    phone = phone.substring(1);
  }
  return `+84${phone}`;
}

const authService = {
  // async register(firstName, lastName, phone, password) {
  //   const formattedPhone = formatPhoneVN(phone);
  //   console.log("authService", {
  //     firstName,
  //     lastName,
  //     formattedPhone,
  //     password,
  //   });
  //   const { data, error } = await supabase.auth.signUp({
  //     phone: formattedPhone,
  //     password,
  //     options: {
  //       data: {
  //         firstName,
  //         lastName,
  //       },
  //     },
  //   });

  //   if (error) throw error;
  //   return { data, error };
  // },
  async register(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    console.log("session :", data.session);
    console.log("authService register response:", { data, error });

    if (error) {
      console.error("Error during registration11111:", error);
      throw error;
    }
    return { data, error };
  },

  async verifyOtp(phone, otp) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });

    if (error) throw error;
    return { data, error };
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error };
  },
};

module.exports = authService;
