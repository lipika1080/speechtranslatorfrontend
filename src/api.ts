import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || window.location.origin;

export async function translateText(
  text: string,
  target_language: string
): Promise<string> {
  const res = await axios.post<{ translated: string }>(
    `${BASE}/translate`,
    { text, target_language },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data.translated;
}