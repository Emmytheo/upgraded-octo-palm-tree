const assert = require('assert');
const app = require('../../src/app');

describe('\'exams\' service', () => {
  it('registered the service', () => {
    const service = app.service('exams');

    assert.ok(service, 'Registered the service');
  });
});
