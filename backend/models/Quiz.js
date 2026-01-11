const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "quizzes.json");

function read() {
  if (!fs.existsSync(DATA_PATH)) return { quizzes: [] };
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  } catch (err) {
    // If JSON is invalid, return empty structure to avoid crashing the server
    return { quizzes: [] };
  }
}

function write(obj) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(obj, null, 2), "utf8");
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function removeCorrectAnswers(quizzes) {
  return quizzes.map(q => {
    const copy = clone(q);
    if (Array.isArray(copy.questions)) {
      copy.questions = copy.questions.map(({ correctAnswer, ...rest }) => rest);
    }
    return copy;
  });
}

// Minimal file-backed model compatible with server.js usage
class QuizModel {
  constructor(data = {}) {
    // allow either plain object or instance creation like `new Quiz(req.body)`
    Object.assign(this, data);
  }

  async save() {
    const db = read();
    const now = new Date().toISOString();
    const newItem = clone(this);

    // ensure unique identifier properties that server/frontend expects
    const id = newItem.id || newItem._id || Date.now().toString(36);
    newItem.id = id;
    newItem._id = id;
    newItem.createdAt = newItem.createdAt || now;
    newItem.updatedAt = now;

    db.quizzes = db.quizzes.concat(newItem);
    write(db);
    return clone(newItem);
  }

  // static methods to emulate mongoose model API used in server
  static find() {
    const db = read();
    const all = clone(db.quizzes || []);

    // return an object that supports .select(...)
    return {
      select: async (selectStr) => {
        // if selection asks to remove questions.correctAnswer, strip that field
        if (typeof selectStr === "string" && selectStr.includes("-questions.correctAnswer")) {
          return removeCorrectAnswers(all);
        }
        return all;
      },
    };
  }

  static async findById(id) {
    const db = read();
    return clone(db.quizzes.find(q => q.id === id || q._id === id) || null);
  }

  static async findByIdAndUpdate(id, payload = {}, options = {}) {
    const db = read();
    const idx = db.quizzes.findIndex(q => q.id === id || q._id === id);
    if (idx === -1) return null;
    const now = new Date().toISOString();
    db.quizzes[idx] = { ...db.quizzes[idx], ...payload, updatedAt: now };
    write(db);
    return clone(db.quizzes[idx]);
  }

  static async findByIdAndDelete(id) {
    const db = read();
    const idx = db.quizzes.findIndex(q => q.id === id || q._id === id);
    if (idx === -1) return null;
    const removed = db.quizzes.splice(idx, 1)[0];
    write(db);
    return clone(removed);
  }

  static async deleteMany() {
    write({ quizzes: [] });
    return;
  }

  static async insertMany(arr) {
    const db = read();
    const now = new Date().toISOString();
    const items = arr.map(q => {
      const id = q.id || q._id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      return { id, _id: id, ...q, createdAt: q.createdAt || now, updatedAt: q.updatedAt || now };
    });
    db.quizzes = db.quizzes.concat(items);
    write(db);
    return clone(items);
  }

  static async countDocuments() {
    const db = read();
    return (db.quizzes || []).length;
  }
}

module.exports = QuizModel;
