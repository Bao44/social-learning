const supabase = require("../../lib/supabase").supabase;

const roadmapService = {
    // Lấy lộ trình học tập theo userId
    getRoadmapByUserId: async (userId) => {
        const { data, error } = await supabase
            .from("roadmap")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();
        if (error) {
            throw new Error("Lỗi khi lấy lộ trình học tập: " + error.message);
        }
        return data;
    },

    // Lấy lộ trình học tập theo userId include roadmap data và lessonRoadmap data
    getRoadmapAndLessonsByUserId: async (userId) => {
        const { data, error } = await supabase
            .from("roadmap")
            .select(`
                *,
                lessonRoadmap(*) as weeks
            `)
            .eq("user_id", userId)
            .single();
        if (error) {
            throw new Error("Lỗi khi lấy lộ trình học tập: " + error.message);
        }
        return data;
    },

    // Tạo mới lộ trình học tập cho userId
    createRoadmapForUser: async (userId, roadmapData) => {
        const { data, error } = await supabase
            .from("roadmap")
            .insert([{
                user_id: userId,
                totalWeeks: roadmapData.totalWeeks,
                focus: roadmapData.focus,
            }])
            .select();
        if (error) {
            throw new Error("Lỗi khi lưu lộ trình học tập: " + error.message);
        }
        return data;
    },

    // createLessonRoadmap
    createLessonRoadmap: async (roadmapId, lessonData) => {
        const { data, error } = await supabase
            .from("lessonRoadmap")
            .insert([{
                roadmap_id: roadmapId,
                week: lessonData.week,
                type: lessonData.type,
                level: lessonData.level,
                topic: lessonData.topic,
                

            }]);
        if (error) {
            throw new Error("Lỗi khi lưu bài học vào lộ trình: " + error.message);
        }
        return data;
    }
};

module.exports = roadmapService;