'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

var serverURL = 'https://startups-sg.herokuapp.com/'

app.set('port', (process.env.PORT || 5000))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

// index
app.get('/', function (req, res) {
	res.send('hello world i am a secret bot')
})

// for facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// to get data
function getData () {
  $.get(serverURL)
    .done(function (data) {
      data.forEach(function (datum) {
				 let name = datum.name
				 let available = datum.available
			})
		})
	}

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
				continue
			}
			sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
			if (text === 'hi') {
				sendUniqueMessage(sender, "hi, i'm test bot, what can i do for you?")
				continue
			}
			if (text === 'haircut') {
				sendUniqueMessage(sender, "There are 5 hair stylists available now. Please select your favourite:")
				setTimeOut(500, sendQuickReplyMessage(sender))
				continue
			}
			if (text === 'Gordon Levitt') {
				sendUniqueMessage(sender, "You have selected Gordon. His available dates are x, y, z. please pick one")
				continue
			}
			if (text === 'x' || 'y' || 'z') {
				sendUniqueMessage(sender, "You have selected " + text + " . Thank you!")
			}
		}
		// if (event.postback) {
		// 	let text = JSON.stringify(event.postback)
		// 	sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
		// 	continue
		// }
	}
	res.sendStatus(200)
})


// recommended to inject access tokens as environmental variables, e.g.
// const token = process.env.PAGE_ACCESS_TOKEN
const token = "EAAIvrP1hOZAoBAJZBskMdXZAeuOJI8xaN7Yxa8hlIMV3YEadCro8CNmiK8wiN0nExXPMu6yXwdwmzheqnrsLKl0kHO6HHMZAoMg4bP6xFbZAmbcjezhTrYaxRd7QNFdRMQrmD6dj2361aPMQEdaAruLZCVJIIn7OPzMhFQyhYbZCQZDZD"

function sendTextMessage(sender, text) {
	let messageData = { text:text }

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendUniqueMessage(sender, text) {
	let messageData = { text:text }

	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	//ajax call here
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "09/27/2016",
					"subtitle": "11:30AM - 12.30PM",
					"image_url": "http://www.dossil.com/sites/default/files/hairdressers.jpg",
					"buttons": [{
						"type": "postback",
						"title": "Confirm",
						"payload": "Thank you!",
					}],
				}, {
					"title": "09/28/2016",
					"subtitle": "3:30PM - 4.30PM",
					"image_url": "http://www.hairdressing.uk/wp-content/uploads/2013/03/Michelle-Griffin-Academy-at-Pro-Hair-Live-2012-1024x682.jpg",
					"buttons": [{
						"type": "postback",
						"title": "Confirm",
						"payload": "Thank you!",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendQuickReplyMessage(sender) {
	{
	let messageData = {
		    "text":"Pick a hairstylist:",
		    "quick_replies":[
		      {
		        "content_type":"text",
		        "title":"Jane Lyliana",
		        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_JANE"
		      },
		      {
		        "content_type":"text",
		        "title":"Gordon Levitt",
		        "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GORDON"
		      },
					{
						"content_type":"text",
						"title":"Mike Mang",
						"payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_MIKE"
					},
					{
						"content_type":"text",
						"title":"Lulu Lex",
						"payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_LULU"
					}
		    ]
		  }
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}
}


// spin spin sugar
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})
