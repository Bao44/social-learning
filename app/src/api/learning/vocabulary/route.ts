import api from '../../../../lib/api';

interface VocabularyData {
  word: string;
  error_type: string;
  skill: string;
}

// Insert vocabulary errors of user
export const insertOrUpdateVocabularyErrors = async ({ userId, vocabData }: { userId: string; vocabData: VocabularyData }) => {
  const response = await api.post(`/api/learning/vocabulary/insert`, {
    userId,
    vocabData
  });
  return response.data;
};