var copilot = require('api-copilot');

var scenario = new copilot.Scenario({ 
  name: 'Answer C READ UD',
  summary: 'Test answer C READ UD.',
  baseUrl: 'http://localhost:3000/api/polls',
  defaultRequestOptions: {
    json: true
  }
});

module.exports = scenario;