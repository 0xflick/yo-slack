const express = require('express');
const request = require('request');
const app = express();
var settings;


// try to import settings, use defaults otherwise
try {
  settings = require('./settings.json');
} catch(e) {
  // use defaults
  settings = {
    'slackToken': '',
    'yoApiKey': '',
    'yoAll': 'https://api.justyo.co/yoall/'
  };
}


const yoRequest = {
  'api_token': settings.yoApiKey
};

const verify = function(req) {
  return (settings.slackToken === req.query.token);
};

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.post('/', function(req, res) {
  if(!verify(req)) {
    console.log('Unauthorized access attempt from %s', req.ip);
    res.status(403).send('Invalid token');
  } else {
    console.log('okay');
    request.post({url: settings.yoAll, form: yoRequest}, function() {
      res.status(200).send('Sent');
    });
  }
});

const server = app.listen(3000, function() {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
