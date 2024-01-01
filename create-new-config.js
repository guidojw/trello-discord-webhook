#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log('Welcome to the script to create a new config for a new workspace\n\nJust follow along these steps:\n1. Give details first:');
readline.question(' - Please enter the URL where you are going to host this (you will need https): ', (appURL) => {
	console.log('   Please go to your board and add `.json` to the end of the URL -> Now search for `"idBoard":` and copy the value that is between the quotes');
	readline.question(' - Please enter the copied value: ', (boardId) => {
		readline.question(' - Please create a discord webhook and enter the URL: ', (webhookURL) => {
			console.log(`2. Go to https://trello.com/power-ups/admin and create a new Power-Up\n   Make sure to set the "Iframe connector URL" to "${appURL}"`);
			readline.question(' - Please enter the ID that can be found inside the URL (https://trello.com/power-ups/<ID_HERE>/edit): ', (appId) => {
				console.log(`3. Set the icon to ${appURL}/icon.png\n   And go to API key and generate a new API key`)
				readline.question(' - Please enter the API key: ', (apiKey) => {
					readline.question(' - Please enter the API secret: ', (apiSecret) => {
						console.log(`4. Now go to https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&key=${apiKey}\n   And authorize the app`);
						readline.question(' - Please enter the API token: ', (apiToken) => {
							const filepath = path.join(__dirname, 'config.json');
							let currentconfig = { services: {} };
							try { currentconfig = JSON.parse(fs.readFileSync(filepath, 'utf-8')); }
							catch { }

							currentconfig.services[appId] = {
								DISCORD_WEBHOOK_URL: webhookURL,
								TRELLO_BOARD_ID: boardId,
								TRELLO_KEY: apiKey,
								TRELLO_TOKEN: apiToken,
								TRELLO_SECRET: apiSecret,
								TRELLO_CALLBACK_URL: `${appURL}/v1/trello/${appId}`
							}

							fs.writeFileSync(filepath, JSON.stringify(currentconfig, null, 2));

							const service = currentconfig.services[appId];
							axios.post(`https://api.trello.com/1/tokens/${service.TRELLO_TOKEN}/webhooks/`,{
								"key": service.TRELLO_KEY,
								"callbackURL": service.TRELLO_CALLBACK_URL,
								"idModel": service.TRELLO_BOARD_ID,
								"description": "Discord Webhook"
							}, { "Content-Type": "application/json"});

							readline.close();
						});
					});
				});
			});
		});
	});
});
