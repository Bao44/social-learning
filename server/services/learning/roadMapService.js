const supabase = require("../../lib/supabase").supabase;

const roadmapService = {
    // Lấy lộ trình học tập theo userId
    getRoadmapByUserId: async (userId) => {
        const { data, error } = await supabase.rpc('get_current_week', { user_id_input: userId }).maybeSingle();
        if (error) {
            throw new Error("Lỗi khi lấy lộ trình học tập: " + error.message);
        }
        return data;
    },

    // Lấy lộ trình học tập theo roadmapId (kèm tuần & bài học)
    getRoadmapAndLessonsById: async (roadmapId) => {
        const { data: roadmap, error: roadmapError } = await supabase
            .from("roadmap")
            .select(`
            id,
            totalWeeks,
            field_vi,
            field_en,
            goal_vi,
            goal_en,
            pathName_vi,
            pathName_en,
            isUsed,
            date_used,
            weekRoadMaps (
                id,
                week,
                focus_vi,
                focus_en,
                lessonRoadmap (
                    id,
                    type,
                    level_vi,
                    level_en,
                    topic_vi,
                    topic_en,
                    description_vi,
                    description_en,
                    quantity,
                    completedCount,
                    isCompleted
                ),
                isCompleted
            )
        `)
            .eq("id", roadmapId)
            .order("week", { ascending: true, foreignTable: "weekRoadMaps" })
            .single();

        if (roadmapError) {
            throw new Error("Lỗi khi lấy lộ trình học tập: " + roadmapError.message);
        }

        if (!roadmap) {
            return null;
        }

        // Format dữ liệu gọn gàng (giữ nguyên song ngữ)
        const formattedData = {
            id: roadmap.id,
            totalWeeks: roadmap.totalWeeks,
            field_vi: roadmap.field_vi,
            field_en: roadmap.field_en,
            goal_vi: roadmap.goal_vi,
            goal_en: roadmap.goal_en,
            pathName_vi: roadmap.pathName_vi,
            pathName_en: roadmap.pathName_en,
            isUsed: roadmap.isUsed,
            date_used: roadmap.date_used,
            weeks: roadmap.weekRoadMaps.map((week) => ({
                id: week.id,
                week: week.week,
                focus_vi: week.focus_vi,
                focus_en: week.focus_en,
                isCompleted: week.isCompleted,
                lessons: week.lessonRoadmap.map((lesson) => ({
                    id: lesson.id,
                    type: lesson.type,
                    level_vi: lesson.level_vi,
                    level_en: lesson.level_en,
                    topic_vi: lesson.topic_vi,
                    topic_en: lesson.topic_en,
                    description_vi: lesson.description_vi,
                    description_en: lesson.description_en,
                    quantity: lesson.quantity,
                    completedCount: lesson.completedCount || 0,
                    isCompleted: lesson.isCompleted || false,
                })),
            })),
        };

        return formattedData;
    },

    // Tạo mới lộ trình học tập cho userId
    createRoadmapForUser: async (userId, roadmapData) => {
        const { data, error } = await supabase
            .from("roadmap")
            .insert({
                user_id: userId,
                totalWeeks: roadmapData.totalWeeks,
                field_vi: roadmapData.field_vi,
                field_en: roadmapData.field_en,
                goal_vi: roadmapData.goal_vi,
                goal_en: roadmapData.goal_en,
                pathName_vi: roadmapData.pathName_vi,
                pathName_en: roadmapData.pathName_en,
                isUsed: false,
                date_used: null,
                targetSkills: roadmapData.targetSkills,
                studyPlan: roadmapData.studyPlan,
            })
            .select();
        if (error) throw new Error("Lỗi khi lưu lộ trình học tập: " + error.message);
        return data;
    },

    // createWeekRoadmaps
    createWeekRoadmaps: async (roadmapId, weeksData) => {
        const { data, error } = await supabase
            .from("weekRoadMaps")
            .insert({
                roadmap_id: roadmapId,
                week: weeksData.week,
                focus_vi: weeksData.focus_vi,
                focus_en: weeksData.focus_en,
            })
            .select();
        if (error) throw new Error("Lỗi khi lưu tuần lộ trình học tập: " + error.message);
        return data;
    },

    // createLessonRoadmap
    createLessonRoadmap: async (weekRoadMap_id, lessonData) => {
        const { data, error } = await supabase
            .from("lessonRoadmap")
            .insert({
                week_roadmap_id: weekRoadMap_id,
                type: lessonData.type,
                level_vi: lessonData.level_vi,
                level_en: lessonData.level_en,
                topic_vi: lessonData.topic_vi,
                topic_en: lessonData.topic_en,
                description_vi: lessonData.description_vi,
                description_en: lessonData.description_en,
                quantity: lessonData.quantity,
                isCompleted: false,
            })
            .select();
        if (error) throw new Error("Lỗi khi lưu bài học vào lộ trình: " + error.message);
        return data;
    },

    // update completedCount of lessonRoadmap
    updateLessonCompletedCount: async (user_id, level_id, topic_id, type_exercise) => {
        try {
            // Lấy name_vi của topic và level
            const { data: topicData, error: topicError } = await supabase
                .from('topics')
                .select('name_vi')
                .eq('id', topic_id)
                .single();

            const { data: levelData, error: levelError } = await supabase
                .from('levels')
                .select('name_vi')
                .eq('id', level_id)
                .single();

            if (topicError || levelError) throw topicError || levelError;
            if (!topicData || !levelData) throw new Error("Topic hoặc level không tồn tại");

            const topic_name = topicData.name_vi;
            const level_name = levelData.name_vi;

            // Lấy tất cả roadmap của user
            const { data: roadmaps, error: roadmapError } = await supabase
                .from('roadmap')
                .select('id')
                .eq('user_id', user_id);

            if (roadmapError) throw roadmapError;
            if (!roadmaps?.length) {
                console.log("Không tìm thấy roadmap cho user này");
                return;
            }

            const roadmapIds = roadmaps.map(r => r.id);

            // Lấy tất cả weekRoadMaps theo roadmap_id
            const { data: weekMaps, error: weekError } = await supabase
                .from('weekRoadMaps')
                .select('id')
                .in('roadmap_id', roadmapIds);

            if (weekError) throw weekError;
            if (!weekMaps?.length) {
                console.log("Không tìm thấy weekRoadMaps cho roadmap này");
                return;
            }

            const weekIds = weekMaps.map(w => w.id);

            // Tìm lessonRoadmap phù hợp
            const { data: lessons, error: lessonError } = await supabase
                .from('lessonRoadmap')
                .select('id, quantity, completedCount')
                .eq('type', type_exercise)
                .eq('topic_vi', topic_name)
                .eq('level_vi', level_name)
                .in('week_roadmap_id', weekIds);

            if (lessonError) throw lessonError;
            if (!lessons?.length) {
                console.log("Không tìm thấy lessonRoadmap phù hợp.");
                return;
            }

            const lesson = lessons[0];
            const newCount = Math.min(lesson.quantity, (lesson.completedCount || 0) + 1);

            // Cập nhật completedCount
            const { error: updateError } = await supabase
                .from('lessonRoadmap')
                .update({ completedCount: newCount })
                .eq('id', lesson.id);

            if (updateError) throw updateError;

            console.log(`✅ LessonRoadmap ${lesson.id} cập nhật completedCount = ${newCount}`);
        } catch (error) {
            console.error("❌ Error updating completedCount:", error);
        }
    },

    // Update roadmap isUsed and date_used
    applyRoadmapForUser: async (roadmapApplyId, roadmapOldId) => {
        const { data, error } = await supabase
            .from("roadmap")
            .update({
                isUsed: true,
                date_used: new Date().toISOString(),
            })
            .eq("id", roadmapApplyId);
        if (error) throw new Error("Lỗi khi áp dụng lộ trình học tập: " + error.message);
        // Set old roadmap isUsed to false
        if (roadmapOldId) {
            const { data: oldData, error: oldError } = await supabase
                .from("roadmap")
                .update({
                    isUsed: false,
                })
                .eq("id", roadmapOldId);
            if (oldError) throw new Error("Lỗi khi cập nhật lộ trình học tập cũ: " + oldError.message);
            // reset icCompleted of old roadmap weeks and lessons
            const { data: oldWeeks, error: oldWeeksError } = await supabase
                .from("weekRoadMaps")
                .select("id")
                .eq("roadmap_id", roadmapOldId);
            if (oldWeeksError) throw new Error("Lỗi khi lấy tuần lộ trình học tập cũ: " + oldWeeksError.message);
            for (const week of oldWeeks) {
                // reset lessons
                const { data: lessonData, error: lessonError } = await supabase
                    .from("lessonRoadmap")
                    .update({
                        isCompleted: false,
                        completedCount: 0,
                    })
                    .eq("week_roadmap_id", week.id);
                if (lessonError) throw new Error("Lỗi khi cập nhật bài học lộ trình học tập cũ: " + lessonError.message);

                // reset tuần
                const { data: weekData, error: weekError } = await supabase
                    .from("weekRoadMaps")
                    .update({
                        isCompleted: false,
                    })
                    .eq("id", week.id);
                if (weekError) throw new Error("Lỗi khi cập nhật tuần lộ trình học tập cũ: " + weekError.message);
            }
        }
    }
};

module.exports = roadmapService;