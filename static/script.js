var file_system = true;
var camera_ip = null;
var stop_pinging = true;
var first_attempt = true;
var ping_loop = null;


// Fetches images from server on load
$( document ).ready(function() {
    $("#local-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
	$("#local-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());
});


// When Local tab option is clicked
function openLocal(){

    $.ajax({
		type: 'GET',
		url: '/localstorage',
		success: function(response){
			$('#placeholder').html(response);
            $('nav ul li').removeClass("active");
			$('#local').addClass("active");

			if($('#plus-btn').hasClass("scale-out")){
				$('#trigger-btn-icon').html("file_upload");
				$('#plus-btn').removeClass("scale-out");
			}
			else{
				$('#plus-btn').addClass("scale-out");
				setTimeout(function(){
					$('#trigger-btn-icon').html("file_upload");
					$('#plus-btn').removeClass("scale-out");
				}, 300);
			}
			
			setTimeout(function(){
				$('#plus-btn').removeClass("scale-out");
			}, 250);

			$("#local-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
			$("#local-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());

			file_system = true;
		}
	});

}


// When IP Camera tab option is clicked
function openIP(){

    $.ajax({
		type: 'GET',
		url: '/ipcamera',
		success: function(response){
			$('#placeholder').html(response);
            $('nav ul li').removeClass("active");
			$('#ip').addClass("active");

			$("#ip-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
			$("#ip-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());

			if($('#plus-btn').hasClass("scale-out")){
				$('#trigger-btn-icon').html("camera");
				$('#plus-btn').removeClass("scale-out");
			}
			else{
				$('#plus-btn').addClass("scale-out");
				setTimeout(function(){
					$('#trigger-btn-icon').html("camera");
					$('#plus-btn').removeClass("scale-out");
				}, 250);
			}

			file_system = false;

			$('.collapsible').collapsible({
				accordion: true,    
				onOpenStart: function(e){

					$(e).find('.collapsible-header div:last-child i').text('keyboard_arrow_up');

				},
				onCloseStart:function(e){
					
					$(e).find('.collapsible-header div:last-child i').text('keyboard_arrow_down');
				}
			});

			if(!stop_pinging){
				$("#ip-label").addClass("active");
				$("#ip-addr").val(camera_ip);
				$("#conn-status").html('<i class="material-icons left" style="color: #0f9d58;">check_circle</i>');
				$("#conn-status-text").text('Connected');
				$("#live-preview-container").html('<img style="width: 100%;" id="browser_video" alt="Something went wrong" src="http://'+ camera_ip +'/video">');
				$('.collapsible').collapsible('open', 1);
			}
		}
	});

}


// When About tab option is clicked
function openAbout(){


    $.ajax({
		type: 'GET',
		url: '/about',
		success: function(response){
			$('#placeholder').html(response);
            $('nav ul li').removeClass("active");
			$('#about').addClass("active");
			$('#plus-btn').addClass("scale-out");
			setTimeout(function(){
				$('#plus-btn').addClass("scale-out");
			}, 300);
		}
	});
    
}


// When expand image option is selected
function triggerDownload(img){
	window.open("./static/temp/" + img + '?t=' + new Date().getTime(), '_blank');
}


// Called when button on the top right is clicked. Has different function according to which tab is opened
function triggerSelect(){

	if(file_system){

		// Triggers that HTML elements onclick function, which then triggers an upload
		$("#file-input input").click();

	} else {

		if(stop_pinging){	// If ping has stopped, then no camera is connected
			M.toast({html: 'Not connected to a camera'});
		} else {

			$("#plus-btn").attr("onclick", "return;");

			$("#ip-input-title-container").html('<div class="preloader-wrapper small active" style="width: 24px; height: 24px;"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
			$("#ip-depth-title-container").html('<div class="preloader-wrapper small active" style="width: 24px; height: 24px;"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');

			console.log("Requesting server")

			$.ajax({
				type: 'POST',
				url: '/capturefromcamera',
				data: { ip : camera_ip },
				success: function(response){

					console.log(response);
					$("#ip-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
					$("#ip-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());

					$("#ip-input-title-container").html("");
					$("#ip-depth-title-container").html("");

					$("#plus-btn").attr("onclick", "triggerSelect()");
				},
				error: function(jq, ts, er) {
					M.toast({html: 'Something went wrong, check the console log for more details.'});
					console.log(er);
					$("#ip-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
					$("#ip-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());

					$("#ip-input-title-container").html("");
					$("#ip-depth-title-container").html("");
	
					$("#plus-btn").attr("onclick", "triggerSelect()");
				}
			});

		}

	}

}


// Initiates file upload to server
function imageSelected() {

		$("#plus-btn").attr("onclick", "return;");

		$("#local-input-title-container").html('<div class="preloader-wrapper small active" style="width: 24px; height: 24px;"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
		$("#local-depth-title-container").html('<div class="preloader-wrapper small active" style="width: 24px; height: 24px;"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');

		var form = $('#file-input')[0];
		var data = new FormData(form);

		console.log("Requesting server")
		
		$.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/localupload",
            data: data,
            processData: false,
            contentType: false,
            cache: false,
            // timeout: 20000,
            success: function(response) {

				console.log(response);
				$("#local-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
				$("#local-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());

				$("#local-input-title-container").html("");
				$("#local-depth-title-container").html("");

				$("#plus-btn").attr("onclick", "triggerSelect()");

			},
			error: function(jq, ts, er) {
				M.toast({html: 'Something went wrong, check the console log for more details.'});
				console.log(er);
				$("#local-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
				$("#local-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());
				
				$("#local-input-title-container").html("");
				$("#local-depth-title-container").html("");

				$("#plus-btn").attr("onclick", "triggerSelect()");
			}
		});
	
}


// Requests server to generate point cloud and open viewing window
function loadPointCloud(){

	$.ajax({
		type: 'GET',
		url: '/loadpointcloud',
		success: function(response){
			console.log("Point Cloud Generated Successfully");
		}
	});

}


// Live Preview connection handling
function connectToCamera(){

	$('.modal').modal();

	$("#connect-btn").attr("onclick","return;");

	$("#conn-status-text").text('Connecting');
	$("#conn-status").html('<div class="preloader-wrapper small active" style="width: 24px; height: 24px;"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');

	// clearing the previous connection ping loop
	if(!stop_pinging){

		if(ping_loop != null){
			clearInterval(ping_loop);
		}

		stop_pinging = true;
		setTimeout(connectToCamera, 1501);
		return;

	}

	camera_ip = $("#ip-addr").val();
	stop_pinging = false;
	first_attempt = true;
	

	// initiates a loop that infinitely pings until ping fails
	ping_loop = setInterval(
		function(){
			if(stop_pinging){
				clearInterval(ping_loop);

				$("#connect-btn").attr("onclick","connectToCamera()");
			}
			else{
				ping(camera_ip);
			}
		},
		1500	// interval of ping
	);
	
}


// called for each ping, handles disconnection and connection establishment
function ping(ip) {
	var image = new Image();
	image.src = "http://" + ip + "/shot.jpg";
	setTimeout
	(
		function()
		{
			if ( !image.complete || !image.naturalWidth ){	// Image not being received from IP camera
				console.log("Disconnected");
				stop_pinging = true;

				if(first_attempt){	// If fails in first attempt, connection was never established
					$('.modal').modal('open');
				}

				M.toast({html: 'Disconnected'});
				$("#conn-status").html('<i class="material-icons left">report</i>');
				$("#conn-status-text").text('Disconnected');
				$('.collapsible').collapsible('open', 0);
				$("#live-preview-container").html('<span style="color: #777B7E;">IP Camera is disconnected, please ensure that camera is connected and streaming over the correct IP address and port number, on the same network.</span>');
			}
			else{	// Image being received
				console.log("Connection Established");

				if(first_attempt){
					M.toast({html: 'Connection Established'});
					$("#conn-status").html('<i class="material-icons left" style="color: #0f9d58;">check_circle</i>');
					$("#conn-status-text").text('Connected');
					$("#live-preview-container").html('<img style="width: 100%;" id="browser_video" alt="Something went wrong" src="http://'+ ip +'/video">');
					$('.collapsible').collapsible('open', 1);
				}

				$("#connect-btn").attr("onclick","connectToCamera()");
			}
			first_attempt = false;
		},
		1000		// time period of waiting for a response, has to be smaller than interval of ping
	);
  }
