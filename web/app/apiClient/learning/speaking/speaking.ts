import api from "@/lib/api";

export const getSpeakingByTopicAndLevel = async (
  levelId: number,
  topicId: number
) => {
  const response = await api.get(
    `/api/learning/speaking/${levelId}/${topicId}`
  );
  return response.data;
};
