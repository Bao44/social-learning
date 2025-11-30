const supabase = require("../../lib/supabase").supabase;

const speakingService = {
  // Get list speaking by topic and level
  async getSpeakingByTopicAndLevel(levelId, topicId) {
    const shuffle = arr => arr.sort(() => Math.random() - 0.5);
    const { data, error } = await supabase
      .from("speakingLessons")
      .select("id, content, topic_id, level_id")
      .eq("topic_id", topicId)
      .eq("level_id", levelId);

    if (error) return { data: null, error };

    const random10 = shuffle(data).slice(0, 10);

    return { data: random10, error: null };
  },
};

module.exports = speakingService;
