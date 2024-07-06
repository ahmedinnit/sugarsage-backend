function ageImpactPostMeal(age) {
  if (age <= 40) {
    return 1.0;
  } else if (age <= 60) {
    return 1.0 + (age - 40) * 0.15; // Increase by 15% per year above 40
  } else {
    return 1.3 + (age - 60) * 0.2; // Further increase by 20% per year above 60
  }
}

function bmiImpactPostMeal(bmi) {
  if (bmi < 18.5) {
    return 0.9; // Decrease by 10% for underweight
  } else if (bmi < 25) {
    return 1.0; // No impact for normal weight
  } else if (bmi < 30) {
    return 1.15 + (bmi - 25) * 0.03; // Increase by 3% for each unit of BMI above 25
  } else {
    return 1.3 + (bmi - 30) * 0.05; // Further increase by 5% for each unit of BMI above 30
  }
}

function hba1cImpactPostMeal(hba1c) {
  if (hba1c < 5.7) {
    return 1.0;
  } else if (hba1c < 6.5) {
    return 1.0 + (hba1c - 5.7) * 0.3; // Increase by 30% per unit above 5.7
  } else {
    return 1.3 + (hba1c - 6.5) * 0.5; // Further increase by 50% per unit above 6.5
  }
}

function genderImpact(gender) {
  return gender === "Female" ? 0.95 : 1.0; // Decrease by 5% for females
}

function calculatePostMealSugar(fastingSugar, gl, age, bmi, hba1c, gender) {
  const baseGlycemicResponse = 1.7; // Base response for significant impact
  // Calculate the total impact factor from age, BMI, HbA1c, and gender
  const totalImpactFactor =
    ageImpactPostMeal(age) *
    bmiImpactPostMeal(bmi) *
    hba1cImpactPostMeal(hba1c) *
    genderImpact(gender);

  // Amplify the effect of GL if it's high
  const glEffect = gl >= 25 ? gl * 1.3 : gl; // Increase the effect of high GL

  // Calculate the adjusted glycemic response
  const adjustedGlycemicResponse =
    baseGlycemicResponse * totalImpactFactor * glEffect;

  // Calculate the increase in sugar due to meal
  const initialIncrease = adjustedGlycemicResponse;
  const increaseAfter2Hours = initialIncrease * 0.7; // Applying decay factor after 2 hours

  // Final post-meal sugar calculation
  const postMealSugar = fastingSugar + increaseAfter2Hours;
  // console.log(postMealSugar);
  return postMealSugar;
}

// // Example call to the function
// const fastingSugar = 75; // Example fasting sugar level
// const gl = 47; // Example glycemic load
// const age = 21; // Example age
// const bmi = 14; // Example BMI
// const hba1c = 5; // Example HbA1c level
// const gender = "Male"; // Example gender

// const postMealSugar = calculatePostMealSugar(
//   fastingSugar,
//   gl,
//   age,
//   bmi,
//   hba1c,
//   gender
// );
// console.log("Post-meal sugar level:", postMealSugar);

module.exports = { calculatePostMealSugar };
