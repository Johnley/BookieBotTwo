//Discord bits
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.DISCORD_TOKEN);

//DialogFlow bits
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const projectId = 'bookiebot';

//makin bacon
const credentials = JSON.parse(process.env.GOOGLE_API_CREDS);


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity("with AI")
});

client.on('message', message => {
    if ((message.cleanContent.startsWith("@" + client.user.username) || message.channel.type == 'dm') && client.user.id != message.author.id) {
        var mess = remove(client.user.username, message.cleanContent);
        console.log(mess);
        runAnalysis(mess, message);
    }
});

function remove(username, text) {
    return text.replace("@" + username + " ", "");
}

async function runAnalysis(inputMessage, message) {
    // A unique identifier for the given session
    const sessionId = uuid.v4();

    // Create a new session
    const sessionClient = new dialogflow.SessionsClient({credentials: credentials});
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: inputMessage,
                // The language used by the client (en-US)
                languageCode: 'en-US',
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`  Intent: ${result.intent.displayName}`);
    } else {
        console.log(`  No intent matched.`);
    }
    message.reply(result.fulfillmentText);
}
