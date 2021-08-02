const users = require('./users/users.service.js');
const students = require('./students/students.service.js');
const lectures = require('./lectures/lectures.service.js');
const exams = require('./exams/exams.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(students);
  app.configure(lectures);
  app.configure(exams);
};
