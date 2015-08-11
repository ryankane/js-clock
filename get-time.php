<?php
//error_reporting(E_ALL);
error_reporting(0);

header('Content-Type: application/json');

include 'timezone-list.php';

function calculateOffset($clientOffset) {
	$sign   = $clientoffset >= 0 ? '-' : '+';
	$hour   = $clientoffset / 60;
	$minute = $clientoffset % 60;
	
	return sprintf("%s%02d:%02d", $sign, $hour, $minute);
}

// Gets the timezone offset from client to UTC and compares it to
// timezone list included.
$offsetinhours = calculateOffset($_POST['timezone']);
$timezone      = getTimezone($offsetinhours);
$date          = new DateTime('now', new DateTimeZone($timezone));

// Checks for DST and return H - 1 if it is.
if (date('I')) {
	$date->sub(new DateInterval('PT1H'));
}

echo json_encode((object) [
	'timestamp' => $date->getTimestamp(),
	'timestring' => $date->format('H:i:s A'),
	'hour' => intval($date->format('H'), 10),
	'minute' => intval($date->format('i'), 10),
	'second' => intval($date->format('s'), 10),
	'meridiem' => $date->format('A')
]);
