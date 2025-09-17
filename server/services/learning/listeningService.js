const supabase = require("../../lib/supabase").supabase;

const listeningService = {
    // Get list listeningExercises by id
    async getListeningExerciseById(id) {
        const { data, error } = await supabase
            .from("listenParagraphs")
            .select("*, wordHidden(position, answer)")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching listening exercise:", error);
            throw new Error("Error fetching listening exercise");
        }

        return data;
    }

};

module.exports = listeningService;