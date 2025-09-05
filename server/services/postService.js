const supabase = require("../lib/supabase").supabase;

const postService = {
  async createOrUpdatePost(post) {
    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  },
};

module.exports = postService;
