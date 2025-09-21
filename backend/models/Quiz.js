const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "quizzes.json");

function read() {
  if (!fs.existsSync(DATA_PATH)) return { quizzes: [] };
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function write(obj) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(obj, null, 2), "utf8");
}

module.exports = {
  async deleteMany() {
    write({ quizzes: [] });
    return;
  },
  async insertMany(arr) {
    const data = read();
    const now = new Date().toISOString();
    const items = arr.map(q => ({ id: q.id || Date.now().toString(36), ...q, createdAt: q.createdAt || now, updatedAt: q.updatedAt || now }));
    data.quizzes = data.quizzes.concat(items);
    write(data);
    return items;
  },
  async countDocuments() {
    const data = read();
    return data.quizzes.length;
  },
};
