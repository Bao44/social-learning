import api from "@/lib/api";

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export const createOrUpdatePost = async (data: FormData) => {
  const response = await api.post("/api/posts/post", data);
  return response.data;
};
