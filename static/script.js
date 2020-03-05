var filesystem = true;
var cameraip = null;
var stoppinging = true;
var firstattempt = true;
var pingloop = null;

$( document ).ready(function() {
    $("#local-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
	$("#local-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());
});


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

			filesystem = true;
		}
	});

}

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

			filesystem = false;

			$('.collapsible').collapsible({
				accordion: true,    
				onOpenStart: function(e){

					$(e).find('.collapsible-header div:last-child i').text('keyboard_arrow_up');

				},
				onCloseStart:function(e){
					
					$(e).find('.collapsible-header div:last-child i').text('keyboard_arrow_down');
				}
			});

			if(!stoppinging){
				$("#ip-label").addClass("active");
				$("#ip-addr").val(cameraip);
				$("#conn-status").html('<i class="material-icons left" style="color: #0f9d58;">check_circle</i>');
				$("#conn-status-text").text('Connected');
				$("#live-preview-container").html('<img style="width: 100%;" id="browser_video" alt="Something went wrong" src="http://'+ cameraip +'/video">');
				$('.collapsible').collapsible('open', 1);
			}
		}
	});

}

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

function triggerDownload(img){
	window.open("./static/temp/" + img + '?t=' + new Date().getTime(), '_blank');
}

function triggerSelect(){

	if(filesystem){

		$("#file-input input").click();

	} else {

		if(stoppinging){
			M.toast({html: 'Not connected to a camera'});
		} else {

			$("#plus-btn").attr("onclick", "return;");

			$("#ip-input-title-container").html('<div class="preloader-wrapper small active" style="width: 24px; height: 24px;"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
			$("#ip-depth-title-container").html('<div class="preloader-wrapper small active" style="width: 24px; height: 24px;"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');

			console.log("Requesting server")

			$.ajax({
				type: 'POST',
				url: '/capturefromcamera',
				data: { ip : cameraip },
				success: function(response){

					console.log(response);
					$("#ip-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
					$("#ip-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());

					$("#ip-input-title-container").html("");
					$("#ip-depth-title-container").html("");

					$("#plus-btn").attr("onclick", "triggerSelect()");
				},
				error: function(jq, ts, er) {
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
            // timeout: 600000,
            success: function(response) {

				console.log(response);
				$("#local-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
				$("#local-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());

				$("#local-input-title-container").html("");
				$("#local-depth-title-container").html("");

				$("#plus-btn").attr("onclick", "triggerSelect()");

			},
			error: function(jq, ts, er) {
				console.log(er);
				$("#local-input-img img").attr('src','/static/temp/c.png?t=' + new Date().getTime());
				$("#local-depth-img img").attr('src','/static/temp/d.png?t=' + new Date().getTime());
				
				$("#local-input-title-container").html("");
				$("#local-depth-title-container").html("");

				$("#plus-btn").attr("onclick", "triggerSelect()");
			}
		});
	
}

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
	if(!stoppinging){

		if(pingloop != null){
			clearInterval(pingloop);
		}

		stoppinging = true;
		setTimeout(connectToCamera, 1501);
		return;

	}

	cameraip = $("#ip-addr").val();
	stoppinging = false;
	firstattempt = true;
	
	pingloop = setInterval(
		function(){
			if(stoppinging){
				clearInterval(pingloop);

				$("#connect-btn").attr("onclick","connectToCamera()");
			}
			else{
				ping(cameraip);
			}
		},
		1500
	);
	
}

function ping(ip) {
	var image = new Image();
	image.src = "http://" + ip + "/shot.jpg";
	setTimeout
	(
		function()
		{
			if ( !image.complete || !image.naturalWidth ){
				console.log("Disconnected");
				stoppinging = true;

				if(firstattempt){
					$('.modal').modal('open');
				}

				M.toast({html: 'Disconnected'});
				$("#conn-status").html('<i class="material-icons left">report</i>');
				$("#conn-status-text").text('Disconnected');
				$('.collapsible').collapsible('open', 0);
				$("#live-preview-container").html('<span style="color: #777B7E;">IP Camera is disconnected, please ensure that camera is connected and streaming over the correct IP address and port number, on the same network.</span>');
			}
			else{
				console.log("Connection Established");

				if(firstattempt){
					M.toast({html: 'Connection Established'});
					$("#conn-status").html('<i class="material-icons left" style="color: #0f9d58;">check_circle</i>');
					$("#conn-status-text").text('Connected');
					$("#live-preview-container").html('<img style="width: 100%;" id="browser_video" alt="Something went wrong" src="http://'+ ip +'/video">');
					$('.collapsible').collapsible('open', 1);
				}

				$("#connect-btn").attr("onclick","connectToCamera()");
			}
			firstattempt = false;
		},
		1000
	);
  }
