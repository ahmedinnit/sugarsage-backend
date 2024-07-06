function getTopRecommendedFoods(data, topScore, topCount, fallbackCount) {
  const { food_names, predictions } = data;

  // Combine food names with their corresponding scores
  const foodScores = food_names.map((name, index) => ({
    name,
    score: predictions[index],
  }));

  // Filter out foods with a score less than 6
  const filteredFoods = foodScores.filter((food) => food.score >= 6);

  // Filter foods with the highest score (e.g., 9)
  const topFoods = filteredFoods.filter((food) => food.score === topScore);

  // If there are 25 or more foods with the highest score, select the top 25
  if (topFoods.length >= topCount) {
    return topFoods.slice(0, topCount);
  } else {
    // Otherwise, sort all filtered foods by score in descending order
    filteredFoods.sort((a, b) => b.score - a.score);

    // Select the top 15 highest-scored foods
    const fallbackFoods = filteredFoods.slice(0, fallbackCount);

    // If fallback foods are less than fallbackCount, return only available foods
    return fallbackFoods.length >= fallbackCount
      ? fallbackFoods
      : filteredFoods;
  }
}

module.exports = { getTopRecommendedFoods };
