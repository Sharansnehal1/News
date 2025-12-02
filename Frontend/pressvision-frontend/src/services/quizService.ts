export const getQuizQuestions = async () => {
  const res = await fetch("http://localhost:1337/api/quizzes?populate=*");

  const data = await res.json();

  if (!data || !data.data) return [];

  // Strapi v5 returns fields directly (no attributes)
  return data.data.map((item: any) => ({
    id: item.id,
    question: item.question,
    options: item.options,
    answer: item.answer,
  }));
};
