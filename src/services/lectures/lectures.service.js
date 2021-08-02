// Initializes the `lectures` service on path `/lectures`
const { Lectures } = require('./lectures.class');
const hooks = require('./lectures.hooks');

module.exports = function (app) {
  const options = {
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/lectures', new Lectures(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('lectures');

  service.hooks(hooks);
};
