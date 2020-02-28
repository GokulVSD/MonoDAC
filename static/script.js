var filesystem = true;


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
