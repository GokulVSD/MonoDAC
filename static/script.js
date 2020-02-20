var filesystem = true;


function openLocal(){

    $.ajax({
		type: 'GET',
		url: '/localstorage',
		success: function(response){
			$('#placeholder').html(response);
            $('nav ul li').removeClass("active");
			$('#local').addClass("active");
			$('#select-btn').show();
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
			$('#select-btn').show();
			filesystem = false;
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
			$('#select-btn').hide();
		}
	});
    
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

