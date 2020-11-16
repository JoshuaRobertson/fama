// Logic testing
exports.handler = function(event, context, callback) {
	return {
		statusCode: 200,
		body: 'It is alive!'
	}
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
