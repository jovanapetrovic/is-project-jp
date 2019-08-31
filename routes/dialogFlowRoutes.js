const chatbot = require('../chatbot/chatbot');

module.exports = app => {

	app.post('/api/dialogflow/text_query', async (req, res) => {
		let responses = await chatbot.textQuery(req.body.text, req.body.userId, req.body.parameters);
		res.send(responses[0].queryResult);
	});

	app.post('/api/dialogflow/event_query', async (req, res) => {
		let responses = await chatbot.eventQuery(req.body.event, req.body.userId, req.body.parameters);
		res.send(responses[0].queryResult);
	});

}