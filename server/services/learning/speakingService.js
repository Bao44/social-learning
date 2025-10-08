const supabase = require("../../lib/supabase").supabase;

const speakingService = {
  // Get list speaking by topic and level
  async getSpeakingByTopicAndLevel(levelId, topicId) {
    const { data, error } = await supabase
      .from("speakingLessons")
      .select("id, content, topic_id, level_id")
      .eq("topic_id", topicId)
      .eq("level_id", levelId);

    if (error) return { data: null, error };

    return { data, error: null };
  },
};

module.exports = speakingService;
