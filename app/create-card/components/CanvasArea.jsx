import { useEffect, useRef, useState } from 'react';
import LazyLoad from 'vanilla-lazyload';
import $ from 'jquery';  // Import jQuery
import useApiCaller from "@/hooks/useApiCaller";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react";
let CC;


const CanvasArea = ({activeTool }) => {

  const router = useRouter();
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const apiCaller = useApiCaller()
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initCanvas = () => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;
      CC = new CardsCreator(canvasElement, activeTool);
      setCanvas(CC.fbrc);
    };

    initCanvas();

    return () => {
      if (CC && CC.fbrc) {
        CC.fbrc.dispose();
      }
    };
  }, []);

    // // Update activeTool inside the CardsCreator class when it changes
    useEffect(() => {
      console.log(activeTool);
      if (CC) {
        CC.updateActiveTool(activeTool); // Custom method to update activeTool in class
      }
    }, [activeTool]);




  const handleUndo = () => {
    if (CC && CC.history) {
      CC.history.undo();
    }
  };

  const handleRedo = () => {
    if (CC && CC.history) {
      CC.history.redo();
    }
  };

  const handleSideNavClick = (side) => {
    if (CC) {
      CC.switchSide(side);
    }
  };

  
  const handleSaveCanvas = async () => {


    if (canvas) {
		
      const dataURL = canvas.toDataURL({
        format: 'png',
        multiplier: 2,
      });

      // Send the canvas image data to the server to save it
      try {
		setLoading(true);
		const  response  = await apiCaller.post('/create-card/api', { imageData: dataURL });
		if(response.data.result){
			localStorage.setItem('giftCard', response.data.data.fileUrl);
			router.push(`/send-loved`); // If authenticated, navigate to the send-loved page
			setLoading(false);
		}else{
			setLoading(false);
			toast({
				variant: "error",
				title: "Something wrong canvas creations failed!",
			});
		}
      } catch (error) {
		setLoading(false);
        console.error('Error saving canvas:', error);
      }
    }
  };


  return (
    <section>
      <canvas ref={canvasRef} id="canvas" />

      {/* Side navigation */}
      <ul id="side-nav">
        <li data-nav="cover" onClick={() => handleSideNavClick('cover')}>
          Cover
        </li>
        <li className="active" data-nav="inside" onClick={() => handleSideNavClick('inside')}>
          Inside
        </li>
        <li data-nav="envelope" onClick={() => handleSideNavClick('envelope')}>
          Envelope
        </li>
      </ul>

      {/* History navigation */}
      <ul id="history-nav">
        <li id="undo" onClick={handleUndo}>
          <img src="/assets/img/icon-undo.svg" alt="Undo" />
        </li>
        <li id="redo" onClick={handleRedo}>
          <img src="/assets/img/icon-redo.svg" alt="Redo" />
        </li>
      </ul>

		<ul id="continue-nav">

		<button
			type="button"
			onClick={handleSaveCanvas}
			className="items center mt-3 block flex w-full justify-center gap-2 rounded-full bg-[#FF318C] py-3 text-center text-white hover:bg-[#FF318C]"
		>
			 {loading && <Loader2 className="mr-2 size-6 animate-spin" />}
			Continue
		</button>

		</ul>
    </section>
  );
};


class UndoRedo {
  constructor(canvas) {
    this.canvas = canvas;
    this.undoStack = [];
    this.redoStack = [];
    this._processing = false;

  this.initListeners();
  }

  initListeners() {
    let this_ = this;
  
     this.canvas.on('object:added', (e) => this.saveState('added', e.target));
    this.canvas.on('object:removed', (e) => this.saveState('removed', e.target));
    this.canvas.on('object:modified', (e) => this.saveState('modified', e.target));
    this.canvas.on('path:created', (e) => this.saveState('path-added', e.path));
    this.canvas.on('before:transform', (e) => this.saveState('before-transform', e.transform.target));
  }


  saveState(action, object) {
    
    //handle pathes creation
    //by default path dosent have - id and type properties
  if(action == 'path-added'){
    action = 'added';
    object.id = 'path-'+this.uniqid();
    object.type = 'path';
  }
         

    if (this._processing || !object.id || object.id == 'inside'|| object.id == 'envelope'|| object.id == 'cover' || object.id == 'clone-image')
      return false;


    // Clone the object state
    object.clone((clonedObject) => {
        const zIndex = this.canvas.getObjects().indexOf(object); // Get z-index
        const state = {
          action: action,
          objectId: object.id,
          objectClone: clonedObject,
          zIndex: zIndex,

        };

        this.undoStack.push(state);
        this.redoStack = [];

        console.log('Fire action: '+action +', Processing: '+this._processing)
      console.log('Current history: ', this.undoStack)

    });

    $('#undo').removeClass('disabled');
    $('#redo').addClass('disabled');
  }


  restoreState(state, isUndo) {
    
    let this_ = this;

    this._processing = true;
    
     const object = this.canvas.getObjects().find((obj) => obj.id === state.objectId);

    if (state.action === 'added') {
        if (isUndo) {
          this.canvas.remove(object);
        } else {
          this.addObjectToCanvas(state.objectClone, state.zIndex);
        }	    
    } else if (state.action === 'removed') {
        if (isUndo) {
          this.addObjectToCanvas(state.objectClone, state.zIndex);
        } else {
          this.canvas.remove(object);
        }
    } else if (state.action === 'modified') {
        this.canvas.remove(object); 
        state.objectClone.clone(function(cloned) {
          this_.addObjectToCanvas(cloned, state.zIndex);
    });
    }


    this._processing = false;

    $('#undo').addClass('disabled');
    $('#redo').addClass('disabled');

    if(this.undoStack.length > 0)
      $('#undo').removeClass('disabled');

    if(this.redoStack.length > 0)
      $('#redo').removeClass('disabled');
  }


  undo() {
    
    if (this.undoStack.length > 0) {
    
      this._processing = true;

      let lastState = this.undoStack.pop();
      this.redoStack.push(lastState);
      if(lastState.action == 'modified'){
          lastState = this.undoStack.pop();
          lastState.action = 'modified';//convert before-transform to modified
      }
      
        this.restoreState(lastState, true);

        this._processing = false;
        $('#redo').removeClass('disabled');

    }else{
      $('#undo').addClass('disabled');
    }

  }

  
  redo() {
    
    if (this.redoStack.length > 0) {
    
      this._processing = true;

        const redoState = this.redoStack.pop();
        this.undoStack.push(redoState);

        this.restoreState(redoState, false);

        this._processing = false;
        $('#undo').removeClass('disabled');

    }else{
      $('#redo').addClass('disabled');
    }
  }

addObjectToCanvas(object, zIndex) {
  this._processing = true;
  this.canvas.add(object);
  this.canvas.moveTo(object, zIndex); // Maintain z-index
  this.canvas.renderAll();
  this._processing = false;
}


  processing(value) {
    this._processing = value;
  }

  uniqid() {
      var ts = String(new Date().getTime()), i = 0, out = '';
      for(i=0;i<ts.length;i+=2)
         out += Number(ts.substr(i, 2)).toString(36);    
      return ('loved-'+out);
  }
}

class CardsCreator {

  constructor(canvasElement, activeTool) {
    this.canvasElement = canvasElement;

    let this_ = this;
    this.activeTool = activeTool; // Store activeTool in class

		fabric.Object.prototype.toObject = (function (toObject) {
          return function (propertiesToInclude) {
            propertiesToInclude = (propertiesToInclude || []).concat(
              ["id"] // custom attributes for export
            );
            return toObject.apply(this, [propertiesToInclude]);
          };
        })(fabric.Object.prototype.toObject);

		fabric.Object.prototype.set({
            selectable: true,
            hasControls: true,
            hasBorders: true,
            hasRotatingPoint: true,
            objectCaching: false,
            dirty: false,
            stroke: 'transparent',
            strokeUniform: true,
            strokeWidth: 0,
            originX: 'center',
            originY: 'center',
            borderColor: '#990000',
            borderScaleFactor: 2,
            cornerColor: '#990000',
            cornerStyle:'circle',
            cornerSize: 10,
            transparentCorners: false
        });

        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
          x: 0, 
          y: 0.5,
          offsetY: 20,
          cursorStyle: 'pointer',
          mouseUpHandler: this.deleteIcon,
          render: this.renderDeleteIcon,
          cornerSize: 24
        });


		this.container = document.getElementById('cards-constructor');
		this.cw = this.container.clientWidth;
        this.ch = this.container.clientHeight;
        this.cwOriginal = this.cw;
        this.chOriginal = this.ch;
        this.cwPrev = this.cw;
        this.chPrev = this.ch;

        this.canvas = document.getElementById('canvas');

        this.canvas.width = this.cw;
        this.canvas.height = this.ch;
        this.canvas.style.width = this.cw+'px';
        this.canvas.style.height = this.ch+'px';

        this.fbrc = new fabric.Canvas('canvas', {
        	backgroundColor: '#FFFFFF',
			width: this.cw,
			height: this.ch,
			defaultCursor: 'default',
			perPixelTargetFind: true,
			targetFindTolerance: 1,
			preserveObjectStacking: true,
			includeDefaultValues: true,
			controlsAboveOverlay: true,
			enableRetinaScaling: true,
			objectCaching: false,
			dirty: false
        });

        this.fbrc.setWidth(this.cw);
        this.fbrc.setHeight(this.ch);

        this.history = new UndoRedo(this.fbrc);

        this.patternSourceCanvas = new fabric.StaticCanvas(null, {enableRetinaScaling: true});

        this.textFont = 'Comfortaa';
        this.textColor = '#000000';
        this.textSize = 30;
        this.textAlign = 'center';

    	this.fbrc.isDrawingMode = false;
    	this.fbrc.freeDrawingBrush = new fabric.PencilBrush(this.fbrc);
		this.fbrc.freeDrawingBrush.color = '#000000'
		this.fbrc.freeDrawingBrush.width = 15;
		this.fbrc.freeDrawingBrush.shadow = new fabric.Shadow({
	  		blur: 0,
	  		offsetX: 0,
	  		offsetY: 0,
	  		affectStroke: true,
	  		color: '#4e6c8f',
		});


		this.shadow = new fabric.Shadow({
		    color: '#00000040', 
		    blur: 20,
		    offsetX: 0,
		    offsetY: 0,
		    opacity: 1
		  });



  
    // Call additional methods if needed
    this.init();
}
  // Method to update the active tool
  updateActiveTool(activeTool) {
    this.activeTool = activeTool;
  }

  init() {
    let this_ = this;

    	this.lazyLoadInstance = new LazyLoad();
    	
    	this.history.processing(true);

    	fabric.loadSVGFromURL('assets/img/envelope.svg?v=2', (objects, options) => {

	    	this_.envelope = fabric.util.groupSVGElements(objects, options);
	        	this_.envelope.set({
	        		id: 'envelope',
	            	left: this_.cw/2 + 200,
	            	top: this_.ch/2,
	            	selectable: false,
	            	shadow: {
					    color: '#00000040', 
					    blur: 15,
					    offsetX: 0,
					    offsetY: -2,
					    opacity: 0.1
					}
	        	});
	        	this_.envelope.scaleToWidth(400)

	        	this_.fbrc.add(this_.envelope);

	        	this_.envelope.scale(0.7, 0.7);

	        	this_.mask = new fabric.Rect({
	        		id: 'mask',
		            width: 400,
		            height: 600,
		            top: this_.ch/2,
		            left: this_.cw/2,
		            rx: 16,
		            ry: 16,
		            fill: '#ffffff',
		            stroke: 'transparent',
		            strokeWidth: 0,
		            selectable: false,
		            absolutePositioned: true,
		            shadow: this_.shadow
	        	});

				this_.fbrc.add(this_.mask);

				this_.fbrc.freeDrawingBrush.clipPath = this_.mask;

				this_.cover = new fabric.Rect({
				  	id: 'cover',
				   	width: 400,
				   	height: 600,
				   	top: this_.ch/2,
				   	left: this_.cw/2 - 200,
				   	rx: 16,
				   	fill: '#FFFFFF',
				   	stroke: 'transparent',
				   	strokeWidth: 0,
				   	selectable: false,
				   	shadow: this_.shadow
				});

				
          if (this_.fbrc && this_.cover) {
            this_.fbrc.add(this_.cover);
            this_.cover.sendToBack();
            this_.cover.scale(0.7, 0.7);
            this_.fbrc.renderAll(); 
        }

	    		 this_.history.processing(false);
    			 this_.bindEvents(this_.fbrc);
	    });
  }

  bindEvents(){

		let this_ = this;

		this.fbrc.on('mouse:down:before', function (e) {
		  
			const pointer = this_.fbrc.getPointer(e);
    		const inMask = this_.isInMask(pointer);

    		if(!inMask){
    			this_.isDrawingMode = false;
    			var evt = new MouseEvent("mouseup", {
   					bubbles: true,
    				cancelable: true,
    				view: window
  				});
  				this_.fbrc.upperCanvasEl.dispatchEvent(evt);
    		}

    		if(inMask && $('#content-nav li[data-nav="paint"]').hasClass('active'))
				this_.isDrawingMode = true;

		});


		this.fbrc.on('mouse:move', function (e) {
		  
			const pointer = this_.fbrc.getPointer(e);
    		const inMask = this_.isInMask(pointer);

    		if(!inMask){
    			this_.isDrawingMode = false;

    			var evt = new MouseEvent("mouseup", {
   					bubbles: true,
    				cancelable: true,
    				view: window
  				});
  				this_.fbrc.upperCanvasEl.dispatchEvent(evt);

    		}

    		if(inMask && $('#content-nav li[data-nav="paint"]').hasClass('active'))
				this_.isDrawingMode = true;

		});


      	this.fbrc.on('mouse:up', function(event) {

	      	if(event.target != null && !this_.fbrc.isDrawingMode){
				
	      		let side = false;
	      		if(event.target.id == 'inside' || event.target.id == 'clone-image')
	      			side = 'inside';
	      		else if(event.target.id == 'envelope')
	      			side = 'envelope';
	      		else if(event.target.id == 'cover')
	      			side = 'cover';

	      		if(side && $('#side-nav li.active').attr('data-nav') != side)
	      			this_.switchSide(side);

	      		let activeObject = this_.fbrc.getActiveObject();
	      		if(activeObject)
	      			this_.checkObjectPosition(activeObject);
	      	}
		});


		this.fbrc.on('object:added', function(event) {
	    	const object = event.target;
	    	if (object) {
	     		object.hasControls = true;
		      	object.setControlsVisibility({
		        	deleteControl: true
		      	});
		      	this_.fbrc.renderAll();
		    }
		});


		this.fbrc.on('object:moving', function(event) {
			this_.checkObjectPosition(event.target)
		});
		

		this.fbrc.on('path:created', function(e) {
			const path = e.path;
			path.clipPath = this_.mask;
      	});


		
		document.addEventListener('keydown', function(event) {
		    if (event.keyCode >= 37 && event.keyCode <= 40) {
		        this_.moveObject(event.keyCode);
		    } else if (event.keyCode === 46) {
		    	this_.deleteObject();
		    }else if(event.keyCode === 8){
		    	let activeObject = this_.fbrc.getActiveObject();
		    	if(activeObject && activeObject.type == 'i-text' && activeObject.isEditing){
		    	
		    	}else{
		    		this_.deleteObject();
		    	}
		    }else if((event.key === 'z' || event.key === 'Z' || event.keyCode === 90)){
		        if (event.ctrlKey || event.metaKey) {
		        	$('#undo').click();
		        }
		    }
		});


		$(document).on('click', '#aside-close', function(){

			$('#content-nav li, .aside-content').removeClass('active');
			$(this).closest('aside').removeClass('active');
			this_.fbrc.isDrawingMode = false;
		});
    

    $(document).on('click', '#templates-list li', function(){
			this_.loadTemplate($(this).attr('data-template'));
		});


		$(document).on('click', '#side-nav li', function(){
			let side = $(this).attr('data-nav');
			if($('#side-nav li.active').attr('data-nav') != side)
      		this_.switchSide(side);	
		});

		$('#content-nav li:not(.active)').on('click', function(){

			if($(this).attr('data-nav') == 'photo'){
        $("#inside-aside").removeClass('active');
				$('#add-photo-file').click();
        
			}else{
				$('#inside-aside').addClass('active');
				$('#content-nav li, .aside-content').removeClass('active');
				$(this).addClass('active');
				$('#inside-aside-'+$(this).attr('data-nav')).addClass('active');
			}
			this_.fbrc.isDrawingMode = ($(this).attr('data-nav') == 'paint') ? true : false;

		});

		$('#content-nav li').on('click', function(){
      if($(this).attr('data-nav') == 'photo'){
        $("#inside-aside").removeClass('active');
      }
    });
		
		$(document).on('click', '#current-font', function(){
			$(this).toggleClass('active');
		});

		$(document).on('click', '#add-text', function(){
			this_.addText();
		});

    $(document).on('click', '#fonts-list li', function(){
			let font = $(this).attr('data-fontfamily');

			$('#current-font').removeClass('active');
			$('#current-font>p').text(font)
			$('#current-font>p').css('font-family', font);
			this_.textFont = font;
			this_.updateText();
		});


    $(document).on('input', '#text-size', function(){

			this_.textSize = parseInt($(this).val(), 10) || 1;
			this_.updateText();
		});

    $(document).on('click', '#text-align li', function(){

			$('#text-align li').removeClass('active');
			$(this).addClass('active');
			this_.textAlign = $(this).attr('data-align');
			this_.updateText();
		});


    $(document).on('change', '#text-color', function(){
			$('#text-colors-list li').removeClass('active');
			this_.textColor = $(this).val();
			this_.updateText();
		});

    $(document).on('click', '#text-colors-list li', function(){
			$('#text-colors-list li').removeClass('active');
			$(this).addClass('active');
			this_.textColor = $(this).attr('data-color');
			this_.updateText();
		});


    
    $(document).on('click', '#stickers-list li', function(){
			this_.addSticker($(this).attr('data-sticker'));
		});


		$('#add-photo-file').on('change', function(event){

			const file = event.target.files[0];
		    if (!file) return;

		    const reader = new FileReader();
			reader.onload = function(event) {
		    	const image = new Image();
		      	image.src = event.target.result;

		    	image.onload = function() {
		        	const img = new fabric.Image(image, {
		        		id: 'photo-'+this_.uniqid(),
		        		left: this_.cw/2,
		          		top: this_.ch/2,
		          		clipPath: this_.mask
		         	});
		        	img.scaleToWidth(150);
		        	this_.fbrc.add(img);
		        	this_.fbrc.setActiveObject(img);
		        	this_.fbrc.renderAll();

		      	}
		    }

		    reader.readAsDataURL(file);
		});


    $(document).on('change', '#paint-mode', function(){
			this_.setBrush();
		});

    
    $(document).on('input', '#paint-line-width', function(){
			this_.fbrc.freeDrawingBrush.width = parseInt($(this).val(), 10) || 1;
		});

    $(document).on('input', '#paint-color', function(){
			this_.fbrc.freeDrawingBrush.color = $(this).val();
		});

    $(document).on('input', '#paint-shadow-color', function(){
			this_.fbrc.freeDrawingBrush.shadow.color = $(this).val();
		});

    $(document).on('input', '#paint-shadow-width', function(){
			this_.fbrc.freeDrawingBrush.shadow.blur = parseInt($(this).val(), 10) || 0;
		});

    $(document).on('input', '#paint-shadow-offset', function(){
			this_.fbrc.freeDrawingBrush.shadow.offsetX = parseInt($(this).val(), 10) || 0;
			this_.fbrc.freeDrawingBrush.shadow.offsetY = parseInt($(this).val(), 10) || 0;
		});

 $(document).on('change', '#base-color', function(){

			$('#base-colors-list li').removeClass('active');
			let color = $(this).val();
			this_.mask.fill = color;
			this_.fbrc.renderAll();

			this_.fbrc.fire('object:modified', { target: this_.mask });
		});


    $(document).on('click', '#base-colors-list li', function(){
			$('#base-colors-list li').removeClass('active');
			$(this).addClass('active');
			let color = $(this).attr('data-color');
			this_.mask.fill = color;
			this_.fbrc.renderAll();

			this_.fbrc.fire('object:modified', { target: this_.mask });
		});


    $(document).on('click', '#covers-list li', function(){
			this_.setCover($(this).attr('data-cover'))
		});


    $(document).on('click', '#envelope-nav li', function(){
			$('#envelope-nav li, #envelope-aside>div').removeClass('active')
			$(this).addClass('active');
			$('#envelope-aside-'+$(this).attr('data-nav')).addClass('active');
		});

    $(document).on('input', '#envelope-color', function(){
			let color = $(this).val();
			this_.envelope._objects.forEach((object) => {
				if(['outer-1', 'outer-2', 'outer-3'].includes(object.id))
					object.fill = color;
			});
			this_.fbrc.renderAll();

		});


    $(document).on('click', '#envelope-colors-list li', function(){

			let color = $(this).attr('data-color');
			this_.envelope._objects.forEach((object) => {
				if(['outer-1', 'outer-2', 'outer-3'].includes(object.id))
					object.fill = color;
			});
			this_.fbrc.renderAll();

		});


      $(document).on('click', '#envelope-liner-list li', function(){

			fabric.Image.fromURL('assets/img/patterns/'+$(this).attr('data-pattern')+'.jpg', function(img) {

				var pattern = new fabric.Pattern({
			        source: img.getElement(),
			        repeat: 'repeat'
			    });

				this_.envelope._objects.forEach((object) => {
					if(object.id == 'inner')
						object.set({
				            fill: pattern
				        });
				});
				this_.fbrc.renderAll();

			});

		});

    $(document).on('click', '#undo', function(){
			this_.history.undo();
		});

    $(document).on('click', '#redo', function(){
			this_.history.redo();
		});

	}


	isInMask(pointer) {
	    const boundingBox = this.mask.getBoundingRect();

	    return (
	      pointer.x >= boundingBox.left &&
	      pointer.x <= boundingBox.left + boundingBox.width &&
	      pointer.y >= boundingBox.top &&
	      pointer.y <= boundingBox.top + boundingBox.height
	    );
	}

	switchSide(side){

		let this_ = this;

		$('#history-nav').hide();

		let prevSide = $('#side-nav li.active').attr('data-nav');

		$('.aside-close').click();
		$('#side-nav li, aside, nav').removeClass('active');
		$('#side-nav li[data-nav="'+side+'"]').addClass('active');

		this_.fbrc.historyProcessing = true;

		this_.envelope.left = this_.cw/2 + 200
		this_.envelope.sendToBack();
		this_.envelope.scale(0.7,0.7)

		
		this_.cover.left = this_.cw/2 - 200
		this_.cover.sendToBack();
		this_.cover.scale(0.7,0.7);

		if(side != 'inside'){
			this_.fbrc.isDrawingMode = false;
			this_.fbrc.discardActiveObject();
			$('#'+side+'-aside').addClass('active');
		}

		if(side == 'inside'){
			
			$('#history-nav').show();

			$('nav').addClass('active');

			this_.fbrc.remove(this_.cloneInside);

			this_.mask.left = this_.cw/2
			this_.mask.bringToFront();
			this_.mask.scale(1,1)
			this_.mask.visible = true;

			this_.fbrc.getObjects().forEach((o) => {
				if(!['mask', 'cover', 'envelope' ].includes(o.id)){
					o.visible = true;
			  		o.bringToFront();
				}
			});

		}


		if(side == 'envelope'){

			this_.envelope.left = this_.cw/2
			this_.envelope.bringToFront();
			this_.envelope.scale(1.1,1.1,1.1);


			if(prevSide == 'cover'){
				this_.cloneInside.left = this_.cw/2 + 200;
			}else{
				this_.generateClone(this_.cw/2 + 200)
			}

		}

		if(side == 'cover'){

			this_.cover.left = this_.cw/2
			this_.cover.scale(1,1)
			this_.cover.bringToFront();

			if(prevSide == 'envelope'){
				this_.cloneInside.left = this_.cw/2 - 200;
			}else{
				this_.generateClone(this_.cw/2 - 200)
			}

		}


		this_.fbrc.renderAll();

	}


	generateClone(x){

		let this_ = this;

		this_.fbrc.remove(this_.cloneInside);

		let temp = new fabric.StaticCanvas(null);
		let bounds = this_.mask.getBoundingRect();
		let maskClone = fabric.util.object.clone(this_.mask);
		maskClone.set({ id: 'clone-mask', left: this_.mask.left - bounds.left + 20, top: this_.mask.top - bounds.top + 20 });
		temp.add(maskClone);

		this_.mask.visible = false;

		this_.fbrc.getObjects().forEach((o) => {
			if(!['mask', 'cover', 'envelope' ].includes(o.id)){
				let clone = fabric.util.object.clone(o);
				clone.set({ id: 'clone-'+this_.uniqid(), left: o.left - bounds.left + 20, top: o.top - bounds.top + 20, clipPath: maskClone });
				temp.add(clone);
			  	o.visible = false;
			}
		});

		temp.setWidth(this_.mask.width + 40);
		temp.setHeight(this_.mask.height + 40);
		temp.renderAll();

		const b64 = temp.toDataURL();

		fabric.Image.fromURL(b64, img => {

			this_.cloneInside = img;
			this_.cloneInside.set({ id: 'clone-image',
				left: x,
				top: this_.ch/2,
				selectable: false
			});
	  		this_.cloneInside.scale(0.7, 0.7)
	  		this_.fbrc.add(this_.cloneInside);
			this_.cloneInside.sendToBack();
			this_.fbrc.renderAll();

			temp.dispose();

		});
	}

	clearClone(){

		let this_ = this;

		let clone = this_.fbrc.getObjects().filter((o) => o.id == 'clone-image' )[0]
		this_.fbrc.remove(clone);
	}


	loadTemplate(id){

		let this_ = this;

		$.getJSON("templates/"+id+"/"+id+".json", function(data) {
	        
			this_.mask.fill = data.background;

			this_.fbrc.getObjects().forEach((o) => {
				if(!['mask', 'cover', 'envelope' ].includes(o.id)){
					this_.fbrc.remove(o);
				}
			});


			let bounds = this_.mask.getBoundingRect();

	        $.each(data.layers, function(index, layer) {

	        	let left = bounds.left + bounds.width * parseInt(layer.left)/100;
				let top = bounds.top + bounds.height * parseInt(layer.top)/100;

	            switch(layer.type){
	            	
	            	case 'text':

	            		
				        
				        let text = new fabric.IText(layer.text, {
							id: 'text-'+this_.uniqid(),
				            left: left,
				            top: top,
				            fill: layer.color,
				            fontFamily: layer.fontFamily,
				            fontSize: layer.fontSize,
				            textAlign: layer.align,
				            clipPath: this_.mask
				        });	

				        this_.fbrc.add(text);

	            	break;

	            	case 'image':
	            		
	            		fabric.Image.fromURL(layer.src, function(img) {

							let sticker = img.set({
								id: 'sticker-'+this_.uniqid(),
								left: left,
								top: top,
								clipPath: this_.mask
							});
							
							sticker.scaleToWidth(layer.width);
							this_.fbrc.add(sticker);
							this_.fbrc.renderAll()
						});

	            	break;
	            
	            }
	        });

	        this_.fbrc.renderAll();
	    });


	}


	addText(){

		let this_ = this;

		let text = new fabric.IText('CHANGE TEXT', {
			id: 'text-'+this_.uniqid(),
            top: this_.ch/2,
            left: this_.cw/2,
            fill: this_.textColor,
            fontFamily: this_.textFont,
            fontSize: this_.textSize,
            textAlign: this_.textAlign,
            clipPath: this_.mask
        });
        this_.fbrc.add(text);

        this_.fbrc.historyProcessing = true;
        this_.fbrc.setActiveObject(text);
        text.enterEditing();
    	text.selectAll(); 
    	this_.fbrc.historyProcessing = false;
	}


	updateText(){

		let activeText = this.fbrc.getActiveObject();

		if (activeText){
  			if (activeText instanceof fabric.IText){

  				activeText.set('fill', this.textColor);
  				activeText.set('fontFamily', this.textFont);
  				activeText.set('fontSize', this.textSize);
  				activeText.set('textAlign', this.textAlign);

  				this.fbrc.renderAll();
  			}
		}

	}


	addSticker(i){

		let this_ = this;

		fabric.Image.fromURL('assets/img/stickers/'+i+'.png', function(img) {
			
			let sticker = img.set({
				id: 'sticker-'+this_.uniqid(),
				left: this_.cw/2,
				top: this_.ch/2,
				clipPath: this_.mask
			});
			
			sticker.scaleToWidth(100);
			this_.fbrc.add(sticker);
			this_.fbrc.setActiveObject(sticker);
			this_.fbrc.renderAll()
	
		});
	}


	setBrush(){

		let this_ = this;

		let mode = $('#paint-mode').val();

		let brush;
		switch(mode){
			case 'Pencil':
				brush = new fabric.PencilBrush(this_.fbrc);
			break;
			
			case 'Circle':
				brush = new fabric.CircleBrush(this_.fbrc);
			break;

			case 'Spray':
				brush = new fabric.SprayBrush(this_.fbrc);
			break;
		}

		this.fbrc.freeDrawingBrush = brush;
    	this.fbrc.freeDrawingBrush.color = $('#paint-color').val();
    	this.fbrc.freeDrawingBrush.width = parseInt($('#paint-line-width').val(), 10) || 1;
    	this.fbrc.freeDrawingBrush.shadow = new fabric.Shadow({
      		blur: parseInt($('#paint-shadow-width').val(), 10) || 0,
      		offsetX: parseInt($('#paint-shadow-offset').val(), 10) || 0,
      		offsetY: parseInt($('#paint-shadow-offset').val(), 10) || 0,
      		affectStroke: true,
      		color: $('#paint-shadow-color').val()
    	});
	}


	setCover(cover){

		let this_ = this;


	    const img = new Image();
	    img.src = 'assets/img/covers/'+cover+'.jpg';
	    img.crossOrigin = "anonymous"; // Handle cross-origin images if needed

	    img.onload = function () {
	        const tempCanvas = document.createElement('canvas');
	        const tempCtx = tempCanvas.getContext('2d');

	        const targetWidth = 400;
	        const targetHeight = 600;

	        const imgRatio = img.width / img.height;
	        const targetRatio = targetWidth / targetHeight;

	        let width, height, offsetX = 0, offsetY = 0;

	        if (imgRatio > targetRatio) {
	            height = targetHeight;
	            width = height * imgRatio;
	            offsetX = (width - targetWidth) / 2;
	        } else {
	            width = targetWidth;
	            height = width / imgRatio;
	            offsetY = (height - targetHeight) / 2;
	        }

	        tempCanvas.width = targetWidth;
	        tempCanvas.height = targetHeight;

	        tempCtx.drawImage(img, -offsetX, -offsetY, width, height);

	        const resizedImageDataUrl = tempCanvas.toDataURL();

	        fabric.Image.fromURL(resizedImageDataUrl, function(img) {
	        	
	        	this_.cover.set({
		            fill: new fabric.Pattern({
		                source: img.getElement(),
		                repeat: 'no-repeat',
		            })
		        });

	        	this_.fbrc.renderAll();
	        });
		}
	}


	deleteIcon(eventData, transform) {
		const target = transform.target;
		const canvas = target.canvas;
		canvas.remove(target);
		canvas.requestRenderAll();
		return true;
	}

	renderDeleteIcon(ctx, left, top, styleOverride, fabricObject) {
		const size = 30;
		const icon = new Image();
		icon.src = 'assets/img/delete.svg';
		ctx.save();
		ctx.translate(left, top);
		ctx.drawImage(icon, -size / 2, -size / 2, size, size);
		ctx.restore();
	}


	checkObjectPosition(object) {
	    const objectBounds = object.getBoundingRect(true);
	    const clipRectBounds = object.clipPath.getBoundingRect(true);

	    const objectCenterX = objectBounds.left + objectBounds.width / 2;
	    const objectCenterY = objectBounds.top + objectBounds.height / 2;

	    const clipRectCenterX = clipRectBounds.left + clipRectBounds.width / 2;
	    const clipRectCenterY = clipRectBounds.top + clipRectBounds.height / 2;

	    const isOutsideX = Math.abs(objectCenterX - clipRectCenterX) > clipRectBounds.width / 2;
	    const isOutsideY = Math.abs(objectCenterY - clipRectCenterY) > clipRectBounds.height / 2;

	    if (isOutsideX || isOutsideY) {
	         this.fbrc.remove(object);
	         this.fbrc.renderAll();
	    }
	}


	moveObject(keyCode) {
	    const activeObject = this.fbrc.getActiveObject();
	    if (activeObject) {
	        switch (keyCode) {
	            case 37:
	                activeObject.left -= 5;
	                break;
	            case 38:
	                activeObject.top -= 5;
	                break;
	            case 39:
	                activeObject.left += 5;
	                break;
	            case 40:
	                activeObject.top += 5;
	                break;
	        }
	        activeObject.setCoords();
	        this.fbrc.renderAll();

	        this.checkObjectPosition(activeObject);
	    }
	}


	deleteObject() {
		let this_ = this;

	    const activeObject = this_.fbrc.getActiveObject();
	    if (activeObject){
	        this_.fbrc.remove(activeObject);
	        this_.fbrc.renderAll();
	    }
	    
	}


	uniqid() {
        var ts = String(new Date().getTime()), i = 0, out = '';
        for(i=0;i<ts.length;i+=2)
           out += Number(ts.substr(i, 2)).toString(36);    
        return ('loved-'+out);
    }
}

export default CanvasArea;
