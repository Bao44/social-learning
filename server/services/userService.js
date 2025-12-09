const { getTimeAgo } = require("../utils/time/getTimeAgo");

const supabase = require("../lib/supabase").supabase;

const userService = {
  async getUserData(userId) {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) throw error;
    return { data, error };
  },

  async getUsersData() {
    const { data, error } = await supabase.from("users").select();

    if (error) throw error;
    return { data, error };
  },

  async updateUser(userId, userData) {
    const { data, error } = await supabase
      .from("users")
      .update(userData)
      .eq("id", userId);

    if (error) throw error;

    const { data: updatedData, error: fetchError } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    return { data: updatedData, error: null };
  },

  async getUserByNickName(nickName) {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, nick_name, avatar, bio, isPremium, level")
      .eq("nick_name", nickName)
      .maybeSingle();

    if (error) return { data: null, error };
    return { data, error: null };
  },

  async getUsersByIds(userIds) {
    // đảm bảo userIds là mảng string
    const ids = userIds.map((id) => id.toString());

    const { data, error } = await supabase
      .from("users")
      .select("id, name, avatar")
      .in("id", ids);

    if (error) throw error;
    return { data, error };
  },

  async searchUsers(keyword, currentUserId) {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, nick_name, avatar")
      .or(`name.ilike.%${keyword}%,nick_name.ilike.%${keyword}%`)
      .neq("id", currentUserId); // loại bỏ chính mình

    if (error) throw error;
    return { data, error: null };
  },

  async checkUserOnline(userId) {
    const { data, error } = await supabase
      .from("users")
      .select("last_seen")
      .eq("id", userId)
      .single();

    if (error) throw error;

    const isOnline = data?.last_seen
      ? new Date(data.last_seen) > new Date(Date.now() - 30 * 1000)
      : false;

    const offlineTime =
      !isOnline && data?.last_seen
        ? getTimeAgo(new Date(data.last_seen))
        : null;

    return { data: { isOnline, offlineTime }, error: null };
  },
};

module.exports = userService;
