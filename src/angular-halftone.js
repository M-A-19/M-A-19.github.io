/**
 * Halftone methods migrated from AS3 as an Angular Directive.
 *
 * You who turn the wheel and look to windward,
 * Consider Phlebas, who was once handsome and tall as you.
 *
 * @copyright Pez 2015
 */
var app = angular.module("Halftone", []);

app.directive('ngHalftone', function($rootScope) {
  return {
    restrict: 'A',
    link: function($rootScope, iElement, iAttrs) {
        // executed when directive is linked to the DOM.
        var ctx = iElement[0].getContext('2d');
        var eHandle = iElement[0];
        var id = iAttrs.id;
        var startblank = ("true" == iAttrs.startblank);
        var img = new Image();
		img.src = iAttrs.image;
              img.onload = function () {
              reset();
              }
        //Luminance methods
        var lMethods={
              Mean:function(r,g,b){return ((r+g+b)/3)},
              Standard:function(r,g,b){return (0.2126*r) + (0.7152*g) + (0.0722*b)},
              PerceivedA:function(r,g,b){return (0.299*r) + (0.587*g) + (0.114*b)},
              PerceivedB:function(r,g,b){return Math.sqrt( Math.pow(0.241*r,2) + Math.pow(0.691*g,2) + Math.pow(0.068*b,2) )}
        }
        var Luminance = lMethods.Standard;
	  //defaults
	  var defaults = {
		colour1: "#000000",
		colour2: "#ffffff",
		luminosity: "Standard",
		topleft: null,
		bottomright: null,
		zoomfactor: null,
		sample: 8
	};

              
        /**
         * Event listener for render event
         *
         * @param Event event Angular event object.
         * @param Object data Values for rendering halftone.
         *
         * @return void
         */
        function onRender(event,data){
              //make sure the 'render' event was meant for us.
              if (id == data.id) {
                    halftone(data);
              }
        }
              
        //register event listener for render event
        $rootScope.$on('render', onRender);
              
        function onReset(event,canvasID){
              if (id == canvasID) {
                reset();
              }
        }
    
        //register event listener for reset event
        $rootScope.$on('reset', onReset);
              
        function reset(){
              if(img.width>eHandle.width) eHandle.width = img.width;
              if (img.width>eHandle.height) eHandle.height = img.height;
              if(true != startblank)ctx.drawImage(img,0,0,img.width,img.height);
        }
		
		function halftone(options){
                //make sure its a canvas
                if("CANVAS" != eHandle.tagName) throw new Error("This directive can only be applied to canvas elements!");


		    var options = options || {};

	//clone from defaults
	var settings = {};
       for (var a in defaults) {
        if (defaults.hasOwnProperty(a)) {
         settings[a] = defaults[a];
        }
	}

	//override for this config
       for (var a in options){

        if (options.hasOwnProperty(a)) {
         settings[a] = options[a];
        }
	}
		    
              
                //set colours
                eHandle.style.backgroundColor = settings.colour2;
                ctx.fillStyle=settings.colour1;
              
                //get image data
		var canvastmp = document.createElement('canvas');
		canvastmp.width = img.width;
		canvastmp.height = img.height;
		var ctxtmp = canvastmp.getContext('2d');
		ctxtmp.drawImage(img,0,0,img.width,img.height);

                var i = ctxtmp.getImageData(0,0,img.width,img.height);
              
                //set output dimensions
                var originx = 0, originy = 0;
		if(null !== settings.topleft){
			var originx = settings.topleft[0];
			var originy = settings.topleft[1];
		}
                var endx = eHandle.width, endy = eHandle.height;
		if(null !== settings.bottomright){
			var endx = settings.bottomright[0];
			var endy = settings.bottomright[1];
		}



              
                var mtx = matrixFromimgData(i,settings.sample)

		if(0 == settings.zoomfactor)settings.sample = Math.ceil(eHandle.width/mtx[0].length);

              
              draw(ctx,endx,endy,settings.sample,mtx);


		}
              
        /**
         * Create an empty luminosity matrix.
         *
         * @param integer	rows	Number of rows to create in matrix.
         * @param integer	cols	Number of columns to create in matrix.
         *
         * @return Array Empty Matrix of undefined values;
         */
        function spawnEmptyMatrix(rows,cols){
              var result = [];
              
              for(var r=0; r < rows; r++) {
                    result[r] = [];
                    for (var c=0; c < cols; c++){
                        result[r][c] = undefined;
                    }
              
              }
              return result;
        }

        /**
         * Create a Matrix of luminosity values from ImageData
         *
         * @param ImageData imgData	The image data to sample.
         * @param integer   sample	sample area size.
         *
         * @return Array Matrix of luminosity values.
         */
        function matrixFromimgData(imgData,sample){
              
              var cols = Math.ceil(imgData.width/sample);
              var rows = Math.ceil(imgData.height/sample);
              var arrr = Array.apply(null, Array(cols));
              var hold = arrr.map(function (x, i) { return {r:0,g:0,b:0,a:0} });
              
              //make the matrix:
              var out = spawnEmptyMatrix(rows,cols);
              var potential = (sample * sample) *255;
              var u = 0;
              var t = 0;
              var pr = 0;
              
              
		  //This is the End.
		  var End = imgData.data.length-4;
              
		  //for each pixel dataset
              for(var i=0;i<End;i+=4){
              
              	try{
              
              		hold[u].r += imgData.data[i];
              		hold[u].g += imgData.data[i+1];
              		hold[u].b += imgData.data[i+2];
              		hold[u].a += imgData.data[i+3];
              
              	} catch (e){
              	alert(e.message);
              	}
              
              
              	//for each unit width
             	 if(i != 0 && i % (sample*4) == 0){
              
              
              		if((pr+1) % sample == 0){
              
              			out[t][u] = Luminance( hold[u].r/potential, hold[u].g/potential, hold[u].b/potential);
              
              		}
              		u++;
              		if (u == cols)u = 0;

              	}
              
              
              	//row terminators 
              	if (i !=0 && i % ((imgData.width)*4) == 0 ) {
              
              		if(pr !=0 && pr % sample == 0){

              			hold = arrr.map(function (x, v) { return {r:0,g:0,b:0,a:0} });
              			t++;
              		}
              		pr++;
				u=0;
              	}
              
              }

              
              //And alone dwell for ever, The kings of the sea."
              return out;
              
        }
              
        /**
         * Draw halftone data into context object using luminosity matrix.
         *
         * @param CanvasRenderingContext2D ctx	   Javascript image context object
         * @param integer				  width	   Width of canvas in pixels.
         * @param integer				  height   Height of canvas in pixels.
         * @param integer				  unit	   sample area size.
         * @param integer				  matrix   Matrix of luminosity values.
         *
         * @return CanvasRenderingContext2D Javascript image context object.
         */
        function draw(ctx,width,height,unit,matrix){
              
              var radius = unit/2; // Arc radius
              var startAngle = 0; // Starting point on circle
              var endAngle = Math.PI+(Math.PI)/2; // End point on circle
              var i,n;
              
              
              
              //clear the canvas
              ctx.clearRect ( 0 , 0 , width, height );
              
              for (i = 0; i < matrix.length; ++i) {
              for (n = 0; n < matrix[i].length; ++n) {
              
              var x = 0+(n*unit)+radius;
              var y = 0+(i*unit)+radius;
              ctx.beginPath();
              ctx.arc(x, y, radius*(matrix[i][n]), 0, Math.PI*2,true);
              ctx.fill();
              
              }
              }

              
              return ctx;
              
        }

    }
  }
});
