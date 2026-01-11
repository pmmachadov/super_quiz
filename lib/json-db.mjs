import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "quizzes.json");

function readData() {
  if (!fs.existsSync(DATA_PATH)) {
    return { quizzes: [] };
  }
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  return JSON.parse(raw);
}

function writeData(obj) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(obj, null, 2), "utf8");
}

function ensureId(obj) {
  // simple unique id generator
  return (obj.id = obj.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
}

export function getAllQuizzes() {
  const data = readData();
  // return copies without correctAnswer for public list
  return data.quizzes.map(q => ({ ...q, questions: q.questions.map(({ correctAnswer, ...rest }) => rest) }));
}

export function getQuizById(id) {
  const data = readData();
  return data.quizzes.find(q => q.id === id) || null;
}

export function createQuiz(payload) {
  const data = readData();
  const quiz = { ...payload };
  ensureId(quiz);
  quiz.createdAt = quiz.createdAt || new Date().toISOString();
  quiz.updatedAt = quiz.updatedAt || new Date().toISOString();
  data.quizzes.push(quiz);
  writeData(data);
  return quiz;
}

export function updateQuiz(id, payload) {
  const data = readData();
  const idx = data.quizzes.findIndex(q => q.id === id);
  if (idx === -1) return null;
  data.quizzes[idx] = { ...data.quizzes[idx], ...payload, updatedAt: new Date().toISOString() };
  writeData(data);
  return data.quizzes[idx];
}

export function deleteQuiz(id) {
  const data = readData();
  const idx = data.quizzes.findIndex(q => q.id === id);
  if (idx === -1) return false;
  data.quizzes.splice(idx, 1);
  writeData(data);
  return true;
}

export function initDefaultQuizzes(defaults) {
  const data = readData();
  if (data.quizzes && data.quizzes.length > 0) return { message: "exists", count: data.quizzes.length };
  const quizzes = defaults.map(q => {
    const copy = { ...q };
    ensureId(copy);
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = copy.createdAt;
    return copy;
  });
  writeData({ quizzes });
  return { message: "initialized", count: quizzes.length };
}
