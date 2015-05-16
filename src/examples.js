


function halftoneTarget(unit){

    try{
        ctx = jQuery('#myCanvas')[0].getContext("2d");
        ctx2 = jQuery('#cTarget')[0].getContext("2d");
        var img=document.getElementById("base");
        ctx.drawImage(img,0,0);
        var imgdata = ctx.getImageData(0,0,314,227);
        var bla = $.fn.halftone.matrixFromimgData(imgdata,unit); //this bit, sorry.
        $.fn.halftone.draw(ctx2,350,250,unit,bla);
    } catch (e){
        alert(e.message);
    }

}

function doHalftone(){

    try{
    	var cnvs = jQuery('#main-canvas');
    	ctx = cnvs[0].getContext("2d");
        var img=document.getElementById("base");
        ctx.drawImage(img,0,0);
        jQuery('#main-overlay').hide();
        cnvs.halftone({
        	'sample' : 3,
        	'bottomright' : [314,227],
        	'luminosity' : "Standard",
        	'zoomfactor' : 0,
        	'background' : "#adadad"
        });
        //jQuery("#myCanvas").animate({halftoneRes:32}, {
    	//	duration: 1000
		//});
    } catch (e){
        alert(e.message);
    }

}

function resetDemo(){

	try{
	var ctx = document.getElementById("demo-canvas1").getContext("2d");
	var img=document.getElementById("base");
    var bla = ctx.drawImage(img,0,0);
     } catch (e){
        alert(e.message);
    }


}

function doDemo(){

	try{
    	ctx = jQuery('#demo-canvas1').halftone({
        	'sample' : document.getElementById("demo-sample").value,
        	'color' : document.getElementById("demo-foreground").value,
        	'background' : document.getElementById("demo-background").value
        });
    } catch (e){
        alert(e.message);
    }

}

function luminDropdownBootstrap(e){

    e.preventDefault();

  	$(this).parents(".btn-group").find('.selection').text($(this).text());
  	$.fn.halftone.defaults.luminosity = $(this).text(); 
  	//$(this).parents(".btn-group").find('.selection').val($(this).text());


}


jQuery(document).ready(function() {
			
					jQuery('#main-button').click(doHalftone);
					jQuery('#demo-button1').click(doDemo);
					jQuery('#demo-button2').click(resetDemo);
					
					$(".dropdown-menu li a").click(luminDropdownBootstrap);
					

});

jQuery(window).load(function () {

	resetDemo();
    	
});
