const API_URL = "http://localhost:1337/api";

export async function fetchArticles() {
  const res = await fetch(`${API_URL}/articles?populate=*`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}
