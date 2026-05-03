const STORAGE_KEY = 'uic-exam-prep';

export function getStoredData() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { students: {} };
  } catch {
    return { students: {} };
  }
}

export function saveExamResult(studentName, result) {
  const data = getStoredData();
  if (!data.students[studentName]) {
    data.students[studentName] = { exams: [], weakTopics: {} };
  }

  data.students[studentName].exams.push(result);

  // Track failures by question ID and topic
  result.answers.forEach((answer) => {
    if (!answer.correct) {
      const topic = answer.topic || 'General';
      if (!data.students[studentName].weakTopics[topic]) {
        data.students[studentName].weakTopics[topic] = 0;
      }
      data.students[studentName].weakTopics[topic]++;
    }
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data.students[studentName];
}

export function getStudentHistory(studentName) {
  const data = getStoredData();
  return data.students[studentName] || { exams: [], weakTopics: {} };
}

export function getAllStudents() {
  const data = getStoredData();
  return Object.keys(data.students);
}

export function getFailedQuestionIds(studentName) {
  const data = getStoredData();
  const student = data.students[studentName];
  if (!student) return [];

  const failedIds = new Set();
  student.exams.forEach((exam) => {
    exam.answers.forEach((answer) => {
      if (!answer.correct) {
        failedIds.add(answer.questionId);
      }
    });
  });
  return [...failedIds];
}
