export function generateExam(biologyQuestions, chemistryQuestions, mathQuestions, options = {}) {
  const { mode = 'standard', failedIds = [] } = options;

  if (mode === 'review' && failedIds.length > 0) {
    return generateReviewExam(biologyQuestions, chemistryQuestions, mathQuestions, failedIds);
  }

  // Standard exam: 45 bio, 40 chem, 15 math = 100 questions
  const bio = shuffleAndPick(biologyQuestions, 45);
  const chem = shuffleAndPick(chemistryQuestions, 40);
  const math = shuffleAndPick(mathQuestions, 15);

  return shuffle([...bio, ...chem, ...math]);
}

function generateReviewExam(bio, chem, math, failedIds) {
  const allQuestions = [...bio, ...chem, ...math];
  const failedIdSet = new Set(failedIds);

  // Get failed questions
  let reviewQuestions = allQuestions.filter((q) => failedIdSet.has(q.id));

  // If we have more than 100, pick 100
  if (reviewQuestions.length > 100) {
    reviewQuestions = shuffleAndPick(reviewQuestions, 100);
  }

  // If less than 100, fill with random questions
  if (reviewQuestions.length < 100) {
    const remaining = allQuestions.filter((q) => !failedIdSet.has(q.id));
    const fill = shuffleAndPick(remaining, 100 - reviewQuestions.length);
    reviewQuestions = [...reviewQuestions, ...fill];
  }

  return shuffle(reviewQuestions);
}

export function generateCustomExam(biologyQuestions, chemistryQuestions, mathQuestions, config) {
  const { bioCount, chemCount, mathCount, topics } = config;

  let bio = biologyQuestions;
  let chem = chemistryQuestions;
  let math = mathQuestions;

  // Filter by topics if specified
  if (topics && topics.length > 0) {
    bio = bio.filter((q) => topics.includes(q.topic));
    chem = chem.filter((q) => topics.includes(q.topic));
    math = math.filter((q) => topics.includes(q.topic));
  }

  const selectedBio = shuffleAndPick(bio, bioCount);
  const selectedChem = shuffleAndPick(chem, chemCount);
  const selectedMath = shuffleAndPick(math, mathCount);

  return shuffle([...selectedBio, ...selectedChem, ...selectedMath]);
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleAndPick(array, count) {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
