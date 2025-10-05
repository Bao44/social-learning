const supabase = require("../../lib/supabase").supabase;

const vocabularyService = {
  
  async insertVocabulary(userId, vocabData) {
    const { data, error } = await supabase
      .from("userVocabErrors")
      .insert({
        userId: userId,
        word: vocabData.word,
        error_type: vocabData.error_type,
        skill: vocabData.skill,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error };
  },

  async deleteVocabularyErrors(userId, word) {
    const { data, error } = await supabase
      .from("userVocabErrors")
      .delete()
      .eq("userId", userId)
      .eq("word", word);

    if (error) throw error;

    return { data, error };
  },

  // Lấy danh sách từ vựng cá nhân của người dùng dựa trên userId và error_count >= 5
  async getListPersonalVocabByUserIdAndErrorCount(userId) {
    const { data, error } = await supabase
      .from("personalVocab")
      .select("*")
      .eq("userId", userId)
      .gte("error_count", 5)
      .order("error_count", { ascending: false });

    if (error) throw error;

    return { data, error };
  },

  // Lấy danh sách từ vựng cá nhân của người dùng dựa trên userId và chưa được generate AI
  async getListPersonalVocabByUserIdAndRelatedWord(userId) {
    const { data, error } = await supabase
      .from("personalVocab")
      .select("*")
      .eq("userId", userId)
      .eq("related_words", JSON.stringify([])) // chỉ lấy những row chưa có giá trị
      .eq("created", false); // chỉ lấy những row chưa có giá trị

    if (error) throw error;

    return { data, error };
  },

  // Lưu mảng từ vựng cá nhân vào bảng personalVocab khi generate từ AI
  async updatePersonalVocab(userId, word, dataVocab) {
    const { data, error } = await supabase
      .from("personalVocab")
      .update({
        related_words: dataVocab,
        created: true,
      })
      .eq("userId", userId)
      .eq("word", word)
      .select();

    if (error) throw error;
    return { data, error };
  },

  // Lấy danh sách từ vựng cá nhân của người dùng dựa trên userId và created = true ( đã generate related_words )
  async getListPersonalVocabByUserIdAndCreated(userId) {
    const { data, error } = await supabase
      .from("personalVocab")
      .select(
        `
        id,
        word,
        error_count,
        mastery_score
      `
      )
      .eq("userId", userId)
      .eq("created", true)
      .gte("error_count", 5);
      
    if (error) throw error;

    return { data, error };
  },

  // Lấy từ vựng cá nhân dựa trên personalVocabId
  async getPersonalVocabById(personalVocabId) {
    const { data, error } = await supabase
      .from("personalVocab")
      .select("*")
      .eq("id", personalVocabId)
      .single();

    if (error) throw error;

    return { data, error };
  },
};

module.exports = vocabularyService;
