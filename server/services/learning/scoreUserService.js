const supabase = require("../../lib/supabase").supabase;

const scoreUserService = {
  // Get score user by user_id
  async getScoreUserByUserId(user_id) {
    const { data, error } = await supabase
      .from("score")
      .select("*")
      .eq("userId", user_id)
      .single();

    if (error) {
      console.error("Error fetching user score:", error);
      return { data: null, error };
    }

    return { data, error: null };
  },

  // Cộng điểm cho user
  async addPracticeScore(userId, practiceScore) {
    // Kiểm tra score hiện tại của user có tồn tại không nếu không thì tạo mới
    const { data: checkUserExists, error: checkUserError } =
      await this.getScoreUserByUserId(userId);

    if (!checkUserExists) {
      // Tạo mới bản ghi score cho user
      const { data: newScoreData, error: newScoreError } = await supabase
        .from("score")
        .insert({ userId: userId, practice_score: practiceScore })
        .select()
        .single();
      if (newScoreError) {
        console.error("Error creating user score:", newScoreError);
        throw newScoreError;
      }
      return newScoreData;
    } else {
      // Cập nhật điểm cho user
      const newTotalScore = checkUserExists.practice_score + practiceScore;
      const { data: updatedScoreData, error: updateScoreError } = await supabase
        .from("score")
        .update({ practice_score: newTotalScore })
        .eq("userId", userId)
        .select()
        .single();
      if (updateScoreError) {
        console.error("Error updating user score:", updateScoreError);
        throw updateScoreError;
      }
      return updatedScoreData;
    }
  },

  // Trừ điểm bông tuyết
  async deductSnowflakeFromUser(user_id, snowflake) {
    const { data: snowflakeData, error: snowflakeError } = await supabase
      .from("score")
      .select("*")
      .eq("userId", user_id)
      .single();

    if (snowflakeError && snowflakeError.code !== "PGRST116") {
      console.error("Error fetching user snowflake:", snowflakeError);
      throw snowflakeError;
    }

    if (!snowflakeData) {
      // Nếu chưa có record → tạo mới
      const { data: newSnowflakeData, error: newSnowflakeError } =
        await supabase
          .from("score")
          .insert({ userId: user_id, number_snowflake: 0 })
          .select()
          .single();

      if (newSnowflakeError) {
        console.error("Error creating user snowflake:", newSnowflakeError);
        throw newSnowflakeError;
      }
      return newSnowflakeData;
    } else {
      // Cập nhật số snowflake
      const newTotalSnowflake = Math.max(
        0,
        (snowflakeData.number_snowflake ?? 0) + snowflake
      );

      const { data: updatedSnowflakeData, error: updateSnowflakeError } =
        await supabase
          .from("score")
          .update({ number_snowflake: newTotalSnowflake })
          .eq("userId", user_id)
          .select()
          .single();

      if (updateSnowflakeError) {
        console.error("Error updating user snowflake:", updateSnowflakeError);
        throw updateSnowflakeError;
      }
      return updatedSnowflakeData;
    }
  },
};

module.exports = scoreUserService;
