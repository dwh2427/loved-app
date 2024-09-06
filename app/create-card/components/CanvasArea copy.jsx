import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import LazyLoad from 'vanilla-lazyload';

let CC;

const CanvasArea = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const initCanvas = () => {
      const canvasElement = canvasRef.current;
      if (!canvasElement) return;

      CC = new CardsCreator(canvasElement);
      setCanvas(CC.fbrc);
    };

    initCanvas();

    return () => {
      if (CC && CC.fbrc) {
        CC.fbrc.dispose();
      }
    };
  }, []);

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
    </section>
  );
};

class CardsCreator {
  constructor(canvasElement) {
    this.canvasElement = canvasElement;


    // Modify fabric.Object prototype for custom behavior
    this.extendFabricObject();

    this.initFabricCanvas();
    //this.history = new UndoRedo(this.fbrc); // Assume UndoRedo is implemented

    // Default settings
    this.textFont = 'Comfortaa';
    this.textColor = '#000000';
    this.textSize = 30;
    this.textAlign = 'center';
  }

  extendFabricObject() {
    // Extend the fabric.Object to include "id" in its serialized export
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(["id"]);
        return toObject.apply(this, [propertiesToInclude]);
      };
    })(fabric.Object.prototype.toObject);
  
    // Set default properties for all fabric objects
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
      cornerStyle: 'circle',
      cornerSize: 10,
      transparentCorners: false,
    });
  
    // Add custom delete control for all objects
    fabric.Object.prototype.initialize = (function (initialize) {
      return function (...args) {
        initialize.call(this, ...args);
        if (!this.controls) this.controls = {};
  
        this.controls.deleteControl = new fabric.Control({
          x: 0,
          y: 0.5,
          offsetY: 20,
          cursorStyle: 'pointer',
          mouseUpHandler: this.deleteIconHandler,
          render: this.renderDeleteIcon,
          cornerSize: 24,
        });
      };
    })(fabric.Object.prototype.initialize);
  }
  
  // Define deleteIconHandler to remove the object
  deleteIconHandler = (eventData, transform) => {
    const target = transform.target;
    const canvas = target.canvas;
    canvas.remove(target);
    canvas.requestRenderAll();
  };
  
  // Define renderDeleteIcon for custom rendering of the delete icon
  renderDeleteIcon = (ctx, left, top, styleOverride, fabricObject) => {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red'; // Custom color for delete icon
    ctx.fill();
    ctx.restore();
  };

  initFabricCanvas() {

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

    // Initialize drawing tools

    this.fbrc.setWidth(this.cw);
    this.fbrc.setHeight(this.ch);
    this.patternSourceCanvas = new fabric.StaticCanvas(null, {enableRetinaScaling: true});

    this.textFont = 'Comfortaa';
    this.textColor = '#000000';
    this.textSize = 30;
    this.textAlign = 'center';


    this.fbrc.isDrawingMode = false;
    this.fbrc.freeDrawingBrush = new fabric.PencilBrush(this.fbrc);
    this.fbrc.freeDrawingBrush.color = '#000000';
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



    // Initialize envelope and mask
    this.initEnvelopeAndMask();
  }

  initEnvelopeAndMask() {
    let this_ = this;

    // Check if fbrc (fabric canvas) is initialized
    if (!this_.fbrc) {
        console.error('Fabric canvas not initialized');
        return;
    }

    // Log the current context to debug issues
    console.log('Canvas and dimensions:', this_.fbrc, this_.cw, this_.ch);

    // Initialize LazyLoad (if necessary)
    if (typeof LazyLoad !== 'undefined') {
        this.lazyLoadInstance = new LazyLoad();
    } else {
        console.warn('LazyLoad not defined or loaded');
    }

    // Load the envelope SVG and handle errors
    fabric.loadSVGFromURL('assets/img/envelope.svg', (objects, options) => {
        if (!objects) {
            console.error('Error loading SVG');
            return;
        }

        // Create and set the envelope
        this_.envelope = fabric.util.groupSVGElements(objects, options);
        this_.envelope.set({
            id: 'envelope',
            left: this_.cw / 2 + 200,
            top: this_.ch / 2,
            selectable: false,
            shadow: {
                color: '#00000040',
                blur: 15,
                offsetX: 0,
                offsetY: -2,
                opacity: 0.1,
            },
        });

        // Scale the envelope and add it to the canvas
        this_.envelope.scaleToWidth(400);
        this_.fbrc.add(this_.envelope);
        this_.envelope.scale(0.7, 0.7);

        // Create and add the mask to the canvas
        this_.mask = new fabric.Rect({
            id: 'mask',
            width: 400,
            height: 600,
            top: this_.ch / 2,
            left: this_.cw / 2,
            rx: 16,
            ry: 16,
            fill: '#ffffff',
            stroke: 'transparent',
            strokeWidth: 0,
            selectable: false,
            absolutePositioned: true,
            shadow: this_.shadow,
        });
        this_.fbrc.add(this_.mask);

        // Attach mask as the clipping path for the free drawing brush
        this_.fbrc.freeDrawingBrush.clipPath = this_.mask;

        // Create and add the cover
        this_.cover = new fabric.Rect({
            id: 'cover',
            width: 400,
            height: 600,
            top: this_.ch / 2,
            left: this_.cw / 2 - 200,
            rx: 16,
            fill: '#FFFFFF',
            stroke: 'transparent',
            strokeWidth: 0,
            selectable: false,
            shadow: this_.shadow,
        });

        this_.fbrc.add(this_.cover);
        this_.cover.sendToBack();
        this_.cover.scale(0.7, 0.7);

        // Render all elements on the canvas
        this_.fbrc.renderAll();

        //this_.bindEvents();
    });

    // Call additional methods if needed
  //  this.addMaskAndCover();
}

  addMaskAndCover() {
    this.mask = new fabric.Rect({
      id: 'mask',
      width: 400,
      height: 600,
      top: this.ch / 2,
      left: this.cw / 2,
      rx: 16,
      ry: 16,
      fill: '#ffffff',
      stroke: 'transparent',
      strokeWidth: 0,
      selectable: false,
      shadow: new fabric.Shadow({
        color: '#00000040',
        blur: 20,
        offsetX: 0,
        offsetY: 0,
        opacity: 1,
      }),
    });

    this.fbrc.add(this.mask);
    this.fbrc.freeDrawingBrush.clipPath = this.mask;

    this.cover = new fabric.Rect({
      id: 'cover',
      width: 400,
      height: 600,
      top: this.ch / 2,
      left: this.cw / 2 - 200,
      rx: 16,
      fill: '#FFFFFF',
      stroke: 'transparent',
      strokeWidth: 0,
      selectable: false,
      shadow: new fabric.Shadow({
        color: '#00000040',
        blur: 20,
        offsetX: 0,
        offsetY: 0,
        opacity: 1,
      }),
    });

    this.fbrc.add(this.cover);
    this.fbrc.renderAll();
  }

  switchSide(side) {
    this.fbrc.getObjects().forEach((obj) => {
      obj.visible = false;
    });

    console.log(side);
    if (side === 'cover') {
      this.cover.visible = true;
    } else if (side === 'inside') {
      this.mask.visible = true;
    } else if (side === 'envelope') {
      this.envelope.visible = true;
    }

    this.fbrc.renderAll();
  }
}

export default CanvasArea;
