import api from "@/lib/api";

export async function fetchConversations(userId) {
    try {
        console.log("Fetching conversations for user:", userId);
        const response = await api.get(`/api/conversations/user/${userId}`);
        console.log("Fetched Conversations:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
    }
}
