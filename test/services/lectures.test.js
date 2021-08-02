const assert = require('assert');
const app = require('../../src/app');

describe('\'lectures\' service', () => {
  it('registered the service', () => {
    const service = app.service('lectures');

    assert.ok(service, 'Registered the service');
  });
});
