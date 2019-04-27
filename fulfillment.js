const express = require('express');
const { WebhookClient } = require('dialogflow-fulfillment');
const bodyParser = require('body-parser');
const brain = require('./bot-brain');
const app = express();

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
    res.send(`Hello World! I'm ${process.env.HEROKU_APP_NAME}`);
});

app.post('/fulfillment', function(request, response) {
    
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    const agent = new WebhookClient({ request, response });

    let intentMap = new Map();
    intentMap.set('info.currentTime', brain.timestamp);
    intentMap.set('discord.server.member.count', brain.memberCount);
    // intentMap.set('<INTENT_NAME_HERE>', googleAssistantHandler);
    agent.handleRequest(intentMap);
})

app.listen(process.env.PORT, function () {
    console.log(`Example app listening on port ${process.env.PORT}!`);
});