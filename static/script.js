var filesystem = true;
var cameraip = null;
var stoppinging = true;
var pingloop = null;


function openLocal(){

    $.ajax({
		type: 'GET',
		url: '/localstorage',
		success: function(response){
			$('#placeholder').html(response);
            $('nav ul li').removeClass("active");
			$('#local').addClass("active");

			$('#trigger-btn-icon').html("file_upload");
			$('#plus-btn').show();
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

			$('#trigger-btn-icon').html("camera");
			$('#plus-btn').show();
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
			$('#plus-btn').hide();
		}
	});
    
}

function triggerDownload(img){
	window.location = "./static/temp/" + img;
}

function triggerSelect(){

	if(filesystem){

		$("#file-input input").click();

	} else {

		console.log("Select image from IP Cam");

	}

}

function imageSelected() {
	$("#file-input").submit();
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


// Live Preview Stuff

// $('.collapsible').collapsible('open', 1);
// check_circle
// Use modal for warning, toast for connection establishment and loss

function connectToCamera(){

	$("#connect-btn").attr("onclick","return;");

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
				console.log("Failed to Connect");
				stoppinging = true;
			}
			else{
				console.log("Connection Established");
				$("#connect-btn").attr("onclick","connectToCamera()");
			}
		},
		1000
	);
  }
