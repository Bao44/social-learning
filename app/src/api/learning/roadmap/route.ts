import api from "../../../../lib/api";


// Get roadmap by userId
export const getRoadmapByUserId = async (userId: string) => {
    const response = await api.get(`/api/learning/roadmap/getRoadmapByUserId/${userId}`);
    return response.data;
};

// Get roadmap and lessons by roadmapId
export const getRoadmapAndLessonsById = async (roadmapId: string) => {
    const response = await api.get(`/api/learning/roadmap/getRoadmapAndLessonsById/${roadmapId}`);
    return response.data;
};

// Create a new roadmap for a user
export const createRoadMapForUser = async (userId: string, input: any) => {
    const response = await api.post(`/api/learning/roadmap/createRoadMapForUser`, {
        userId,
        input
    });
    return response.data;
};