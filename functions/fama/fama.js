require('dotenv').config()

const fetch = require('node-fetch')

exports.handler = function(event) {
	// Check the call is from the same site
	if(event.headers['sec-fetch-site'] !== 'same-origin') {
		return {
			statusCode: 401,
			body: 'You are not authorised to access this function'
		}
	}

	// Check for an action in the URL
	if(!event.queryStringParameters.action) {
		return {
			statusCode: 400,
			body: 'The "action" parameter is missing'
		}
	}

	// Build the initial payload
	const payload = {
		method: 'GET',
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'authorization': `Bearer ${process.env.SLACK_OAUTH_TOKEN}`
		}
	}

	// Set the default endpoint to read
	let endpoint = 'users.profile.get';

	// Set update option
	if(event.queryStringParameters.action == 'update') {

		endpoint = 'users.profile.set'

		payload['method'] = 'POST'
		// Set a predefined status based on a code
		// 0 = clear, 1 = lunch, 2 = call, 3 = brb, 4 = occupied
		payload['body'] = JSON.stringify(
			generateStatus(event.queryStringParameters.statusCode)
		)
	}

	// Make the Slack API request
	return fetch(
		`https://slack.com/api/${endpoint}`,
		payload
	)
		// Parse the response as JSON
		.then(data => data.json())
		.then((data) => ({
			statusCode: 200,
			body: JSON.stringify(data)
		}))
		.catch(error => ({
			statusCode: 422,
			body: `Oops! Something went wrong. ${error}`
		}))
}

// Set the status
function setStatus() {
  let emoji,
      text;

  switch () {
    case 1:
      emoji = ':pizza:';
      text = 'Having lunch';
      break;
    case 2:
      emoji = ':call_me_hand:';
      text = 'On a call';
      break;
    case 3:
      emoji = ':alarm_clock:';
      text = 'Be right back';
      break;
    case 4:
      emoji = ':poop:';
      text = 'Occupied';
      break;
    default:
      emoji = '';
      text = '';
      break;
  }

  return {
    profile: {
      status_emoji: emoji,
      status_text: text
    }
  }
}
