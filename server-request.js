var now = null;
var refresh_rate = 999;

// Request time from server and set h, m, s, and A
function serverRequest() {
	$.ajax({
		type: 'POST',
		data: {
			// Offset in minutes from UTC.
			timezone: new Date().getTimezoneOffset()
		},
		url: "get-time.php",
		success: function(dateObj) {
			// result as "H:i:s A" example: (11:24:04 AM)
			now = dateObj;
		}
	});
}

// Pad minutes and seconds for display.
function pad(val, ch, amt) {
	var result = '' + val;
	while (result.length < amt) {
		result = ch + result;
	}
	return result;
}

// Formats a date as HH:mm:ss A
function formatDate(dateObj) {
	return pad(dateObj.hour, '0', 2) + ':' +
		pad(dateObj.minute, '0', 2) + ':' +
		pad(dateObj.second, '0', 2) + ' ' +
		dateObj.meridiem
}

// Update the current time and display in #txt.
function updateTime() {
	if (now == null) {
		serverRequest();
	} else {
		if (now.second !== 59) {
			now.second++;
		} else if (now.minute !== 59) {
			now.second = 0;
			now.minute++;
		} else {
			// Request server time at the end of each hour
			serverRequest();
		}
	}

	// Set Loading tag while the server fetches a timestamp
	if (now == null) {
		$('#txt').html("Loading...");
	} else {
		$('#txt').html(formatDate(now));
	}
	
	// Update the time every second (minus calculation time)
	setTimeout(function() {
		updateTime();
	}, refresh_rate);
}
