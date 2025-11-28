const supabase = require("../../lib/supabase").supabase;

const contentService = {
  // ====== (GET) ======

  loadListeningParagraphs: async ({ levelId, topicId }) => {
    const { data, error } = await supabase.rpc("get_listening_paragraphs", {
      level_id_filter: levelId || null,
      topic_id_filter: topicId || null,
    });
    if (error) return { data: null, error };
    return { data, error: null };
  },

  loadWritingExercises: async ({
    levelId,
    topicId,
    typeExerciseId,
    typeParagraphId,
  }) => {
    const { data, error } = await supabase.rpc("get_writing_exercises", {
      level_id_filter: levelId || null,
      topic_id_filter: topicId || null,
      type_exercise_id_filter: typeExerciseId || null,
      type_paragraph_id_filter: typeParagraphId || null,
    });
    if (error) return { data: null, error };
    return { data, error: null };
  },

  loadSpeakingLessons: async ({ levelId, topicId }) => {
    let query = supabase
      .from("speakingLessons")
      .select(
        `
        id, content, topic_id, level_id, created_at,
        level_name: levels(name_en),
        topic_name: topics(name_en)
      `
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (levelId) query = query.eq("level_id", levelId);
    if (topicId) query = query.eq("topic_id", topicId);

    const { data, error } = await query;
    if (error) return { data: null, error };
    return { data, error: null };
  },

  loadTopics: async () => {
    const { data, error } = await supabase
      .from("topics")
      .select("id, name_en, name_vi")
      .order("id");
    if (error) return { data: null, error };
    return { data, error: null };
  },

  loadLevels: async () => {
    const { data, error } = await supabase
      .from("levels")
      .select("id, name_en, name_vi")
      .order("id", { ascending: true });

    if (error) return { data: null, error };
    return { data, error: null };
  },

  loadTypeExercises: async () => {
    const { data, error } = await supabase
      .from("typeExercises")
      .select("id, title_en, title_vi")
      .order("id");
    if (error) return { data: null, error };
    return { data, error: null };
  },

  loadTypeParagraphs: async () => {
    const { data, error } = await supabase
      .from("typeParagraphs")
      .select("id, name_en, name_vi")
      .order("id");
    if (error) return { data: null, error };
    return { data, error: null };
  },

  // ====== CREATE (POST) ======

  createListeningParagraph: async (paragraphData) => {
    const { data, error } = await supabase
      .from("listenParagraphs")
      .insert({
        title_en: paragraphData.titleEn,
        title_vi: paragraphData.titleVi,
        text_content: paragraphData.textContent,
        level_id: paragraphData.levelId,
        topic_id: paragraphData.topicId,
        audio_url: paragraphData.audioUrl,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) return { data: null, error };
    return { data, error: null };
  },

  createSpeakingLesson: async (lessonData) => {
    const { data, error } = await supabase
      .from("speakingLessons")
      .insert({
        content: lessonData.content,
        level_id: lessonData.levelId,
        topic_id: lessonData.topicId,
      })
      .select()
      .single();

    if (error) return { data: null, error };
    return { data, error: null };
  },

  createWritingExercise: async (exerciseData) => {
    const { data, error } = await supabase
      .from("writingParagraphs")
      .insert({
        type_exercise_id: exerciseData.typeExerciseId,
        type_paragraph_id: exerciseData.typeParagraphId,
        title: exerciseData.title,
        content_en: exerciseData.contentEn,
        content_vi: exerciseData.contentVi,
        level_id: exerciseData.levelId,
        topic_id: exerciseData.topicId,
        number_sentences: exerciseData.numberSentences,
      })
      .select()
      .single();
    if (error) return { data: null, error };
    return { data, error: null };
  },

  // ====== UPDATE ======

  updateListeningParagraph: async (id, paragraphData) => {
    const { data, error } = await supabase
      .from("listenParagraphs")
      .update({
        title_en: paragraphData.titleEn,
        title_vi: paragraphData.titleVi,
        text_content: paragraphData.textContent,
        level_id: paragraphData.levelId,
        topic_id: paragraphData.topicId,
        audio_url: paragraphData.audioUrl,
        created_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error };
    return { data, error: null };
  },

  updateWritingExercise: async (id, exerciseData) => {
    const { data, error } = await supabase
      .from("writingParagraphs")
      .update({
        type_exercise_id: exerciseData.typeExerciseId,
        type_paragraph_id: exerciseData.typeParagraphId,
        title: exerciseData.title,
        content_en: exerciseData.contentEn,
        content_vi: exerciseData.contentVi,
        level_id: exerciseData.levelId,
        topic_id: exerciseData.topicId,
        number_sentences: exerciseData.numberSentences,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error };
    return { data, error: null };
  },

  updateSpeakingLesson: async (id, lessonData) => {
    const { data, error } = await supabase
      .from("speakingLessons")
      .update({
        content: lessonData.content,
        level_id: lessonData.levelId,
        topic_id: lessonData.topicId,
        created_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error };
    return { data, error: null };
  },
  // ====== DELETE ======

  deleteListeningParagraph: async (id) => {
    const { data, error } = await supabase
      .from("listenParagraphs")
      .delete()
      .eq("id", id);
    if (error) return { data: null, error };
    return { data, error: null };
  },

  deleteSpeakingLesson: async (id) => {
    const { data, error } = await supabase
      .from("speakingLessons")
      .delete()
      .eq("id", id);
    if (error) return { data: null, error };
    return { data, error: null };
  },

  deleteWritingExercise: async (id) => {
    const { data, error } = await supabase
      .from("writingParagraphs")
      .delete()
      .eq("id", id);
    if (error) return { data: null, error };
    return { data, error: null };
  },
};

module.exports = contentService;
