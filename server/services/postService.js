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

  async getPosts(userId) {
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        user:users (
          id,
          name,
          nick_name,
          avatar
        ),
        postLikes(id, postId, userId),
        comments(count)
      `
      )
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("userId", userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { data, error: null };
  },

  async getPostById(postId) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        users:user_id (
          id,
          name,
          nick_name,
          avatar
        )
      `
      )
      .eq("id", postId)
      .single();

    if (error) throw error;

    return { data, error: null };
  },

  async deletePost(postId, userId) {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  },
};

module.exports = postService;
