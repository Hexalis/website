//<!--ledice_WS_berem_stevilo-->
//8080 to change port from 80 to 8080
var gateway = `ws://${window.location.hostname}:8080/ws`;
var websocket;

window.addEventListener('load', onLoad); //<--runs when a webpage is opened

function onLoad(event) { //<--runs when you open a webpage 
    initWebSocket();
    initButton();
  }

function initWebSocket() {
	console.log('Trying to open a WebSocket connection...');
    websocket = new WebSocket(gateway);
    websocket.onopen    = onOpen;//<--different functions on actions of webpage
    websocket.onclose   = onClose;
    websocket.onmessage = onMessage;//<--messeges received by server 
}

function onOpen(event) {
    console.log('Connection opened');
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);//after 2s we run the initWebSocket again
}

//runs when the messege from the server is received
//message is in the format "String(number,color)"
function onMessage(event) {
	console.log('onMessage runs');
	console.log(event.data);
	const msg = event.data;
	// Split the message into an array using the comma as the separator
	var parts = msg.split(',');

	// Extract the parts
	const ledMsg = parts[0];
	const hexColorMsg = "#" + parts[1];//add # to use as hexcolor reference
	console.log("Number:", ledMsg); 
	console.log("Color:", hexColorMsg);
	updateLEDColor(ledMsg, hexColorMsg);
    
}
//whaits for the button Submit to be pressed
function initButton() {
    document.getElementById('submitButton').addEventListener('click', sendNumber);
}

//for sending data 
function sendNumber() {
	const led = document.getElementById('LEDnumberInput').value;//reeds the value of element with id 'numberInput' and saves it in variable led
	const hexColor = document.getElementById('LEDcolorPicker').value;//reeds the hex value of color
	if (led>=1 && led<=30){
		console.log(led);
		color = hexToHexWithPrefix(hexColor);
		console.log(color);
		document.getElementById('led_number').textContent = led;// we change placeholder %STATE%
		led_number.style.display = 'inline';//by defoult the placholder %PINUM% is not showed and we have to show it whan we submit the number
		
		// Concatenate LED number and color data with a delimiter
		const message = led + ',' + color;
		// Send the concatenated message to the server
		websocket.send(message);
		console.log(message);
	}
	else{
		alert('Please enter a number between 1 and 30.')
	}
}
//removes # from hex string
function hexToHexWithPrefix(hexColor) {
    // Remove the "#" character from the beginning of the hex color string
    hexColor = hexColor.replace("#", "");
    // Add the "0x" prefix to the hexadecimal color string
    return hexColor;
}

//updates style od the LED boxes for feedback
function updateLEDColor(indexStr, hexColor) {
	console.log('updateLED runs');
	console.log("indexStr:", indexStr);
	console.log("hexcolor:", hexColor);

	const index = parseInt(indexStr, 10); // Parse index string to integer
	console.log("index:", index);
	const leds = document.querySelectorAll('.led');
	
	// Check if the provided index is within the range of LED boxes
	if (index-1 >= 0 && index <= leds.length) {
	  // Set the background color of the LED box at the specified index
	  leds[index-1].style.backgroundColor = hexColor === '#000000' ? '#e7e7e7' : hexColor;
	  leds[index-1].style.borderColor = hexColor === '#000000' ? '#000000' : hexColor;
	} else {
	  console.error('Invalid LED index:', index);
	}
  }
  
