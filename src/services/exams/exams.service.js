// Initializes the `exams` service on path `/exams`
const { Exams } = require('./exams.class');
const hooks = require('./exams.hooks');

module.exports = function (app) {
  const options = {
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/exams', new Exams(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('exams');

  service.hooks(hooks);
};
