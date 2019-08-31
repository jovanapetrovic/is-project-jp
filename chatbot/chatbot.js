'use strict'
const dialogFlow = require('dialogflow');
const structjson = require('./structjson');
const config = require('../config/keys');
const mongoose = require('mongoose');

const projectId = config.googleProjectId;
const sessionId = config.dialogFlowSessionId;

const sessionClient = new dialogFlow.SessionsClient();

const Registration = mongoose.model('registration');

module.exports = {
	textQuery: async function(text, userId, parameters = {})  {
		let sessionPath = sessionClient.sessionPath(projectId, sessionId + userId);
		let self = module.exports;
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: text,
					languageCode: config.dialogFlowSessionLanguageCode,
				},
			},
			queryParams: {
				payload: {
					data: parameters
				}
			}
		};
		let responses = await sessionClient.detectIntent(request);
		responses = await self.handleAction(responses);
		return responses;
	},

	eventQuery: async function(event, userId, parameters = {})  {
		let sessionPath = sessionClient.sessionPath(projectId, sessionId + userId);
		let self = module.exports;
		const request = {
			session: sessionPath,
			queryInput: {
				event: {
					name: event,
					parameters: structjson.jsonToStructProto(parameters),
					languageCode: config.dialogFlowSessionLanguageCode,
				},
			}
		};
		let responses = await sessionClient.detectIntent(request);
		responses = await self.handleAction(responses);
		return responses;
	},

	handleAction: function(responses){
        let self = module.exports;
        let queryResult = responses[0].queryResult;

        switch (queryResult.action) {
            case 'recommendbooks-yes':
                if (queryResult.allRequiredParamsPresent) {
                    self.saveRegistration(queryResult.parameters.fields);
                }
            break;
        }

        return responses;
    },

    saveRegistration: async function(fields) {
        const registration = new Registration({
            name: fields.name.stringValue,
            address: fields.address.stringValue,
            phone: fields.phone.stringValue,
            email: fields.email.stringValue,
            registerDate: Date.now()
        });
        try{
            let reg = await registration.save();
            console.log(reg);
        } catch (err){
            console.log(err);
        }
    }

}