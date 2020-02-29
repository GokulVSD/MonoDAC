var filesystem = true;
var cameraip = null;
var stoppinging = true;
var firstattempt = true;
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


// Live Preview connection handling

function connectToCamera(){

	$('.modal').modal();

	$("#connect-btn").attr("onclick","return;");

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
				console.log("Failed to Connect");
				stoppinging = true;

				if(firstattempt){
					$('.modal').modal('open');
				}

				M.toast({html: 'Disconnected'});
				$("#conn-status").html('<i class="material-icons left">report</i>');
				$('.collapsible').collapsible('open', 0);
			}
			else{
				console.log("Connection Established");

				if(firstattempt){
					M.toast({html: 'Connection Established'});
					$("#conn-status").html('<i class="material-icons left" style="color: #0f9d58;">check_circle</i>');
					$('.collapsible').collapsible('open', 1);
				}

				$("#connect-btn").attr("onclick","connectToCamera()");
			}
			firstattempt = false;
		},
		1000
	);
  }
