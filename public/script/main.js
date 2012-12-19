/**
=================================================================================
Attribut
=================================================================================
**/


// Establish the connection with the server
var socket = io.connect(window.location.hostname); // http://localhost:5000

// qrcode
var txtQRcode = "http://mirman.frederic.free.fr/m/";
// canvas
var colorChose = "#40A497";
var radiusChose = 5;

/**
=================================================================================
Lanceur
=================================================================================
**/




$(document).ready(function() {
	// responsive designe
	resizeCanvasBlock();
	$(window).resize(function() {
		resizeCanvasBlock();
	});
	
	
	// create qrcode
	$('#qrc-input').val(txtQRcode);
	$('#qrcode').qrcode({
		text: txtQRcode,
		width: 156,
		height: 156
	});
	
	
	// event on canvas
	$("#myCanvas").click(drawCercle);
	
	// init color
	$('#Inline').jPicker(
		{
			window:{
				position:{x:'30',y:'center'},
				expandable: true,liveUpdate: true
			},
			color: {active: colorChose}
		},
		function(color, context)
		{
			var all = color.val('all');
			colorChose = "#"+all.hex;
		}
	);
});


/**
=================================================================================
Events
=================================================================================
**/



function resizeCanvasBlock() {
	var sizeW = $(window).width();
	if ( sizeW > 800) { //332
		//$( "#myCanvas" ).width(sizeW/3);
		$( "#block-a" ).width(sizeW/3 - 30);
		$( "#block-b" ).width(sizeW/3 - 30);
		$( "#block-c" ).width(sizeW/3 - 30);
	}
	else{
		$( "#myCanvas" ).width(sizeW);
		$( "#block-a" ).width(sizeW - 30);
		$( "#block-b" ).width(sizeW - 30);
		$( "#block-c" ).width(sizeW - 30);
	}
}


/**
---------------------------------------------------------------------------------
canvas
---------------------------------------------------------------------------------
**/


function drawCercle(e) {
	var posX = $(this).position().left
	, posY = $(this).offset().top;
	var xp = e.pageX - posX;
	
	//alert(e.pageX+ ' - ' + $(this).position().left +' ou '+ $( "#myCanvas" ).width() +' = '+xp);
	
	$("#myCanvas").drawArc({
	  fillStyle: colorChose,
	  x: xp /*+ 60  - $(this).position().left*/, 
	  y: e.pageY -posY/*- $(this).position().top*/,
	  radius: radiusChose
	});
}



$('#slider-fill').live('change', function(event) {
	radiusChose = $(this).val();
});

/**
---------------------------------------------------------------------------------
QRcode
---------------------------------------------------------------------------------
**/


//$('#qrc-input').change( function(){
//$('#qrc-btn').click( function(){
$('#qrc-btn').live('click', function(event) {
	$('#qrcode').empty();
	txtQRcode = $('#qrc-input').val();
	$('#qrcode').qrcode({
		text: txtQRcode,
		width: 156,
		height: 156
	});
});

/**
---------------------------------------------------------------------------------
Chat
---------------------------------------------------------------------------------
**/

socket.on('status_msg', function (data) {
	console.log('Get status msg:', data);
	$('#nbLogged').text(data);
});




// on every message recived we print the new datas inside the #broadcast-msg div
socket.on('broadcast_msg', function (data) {
	console.log('Get broadcasted msg:', data);
	var msg = '<br><span>' + data + '</span>';
	$('#broadcast-msg').append(msg);
});


// Create a new socket connection
socket.on('connect', function() {

	//socket.emit('set nickname', prompt('What is your nickname?'));

	$('#nickname-input').change( function(){
	//$('#nickname-btn').live('click', function(event) {
		var txt = $('#nickname-input').val();
		//$(this).val('');
		socket.emit('set nickname', txt, function (data){
											console.log('Emit nickname', data);
										}
		);
	});
	
	$('#msg-input').change( function(){
	//$('#msg-btn').live('click', function(event) {
		var txt = $('#msg-input').val();
		$(this).val('');
		socket.emit('emit_msg', txt, function (data){
			console.log('Emit Broadcast msg', data);
		});
	});

});