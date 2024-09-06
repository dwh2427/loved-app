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

    let this_ = this;

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


    // Load the envelope SVG and handle errors
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

        // this.fbrc.setWidth(this.cw);
        // this.fbrc.setHeight(this.ch);

        //this.history = new UndoRedo(this.fbrc);

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

        //this_.bindEvents();


    // Call additional methods if needed
    this.init();
}

  init() {
    let this_ = this;

    this.lazyLoadInstance = new LazyLoad();
    //console.log(this_);
    //this.history.processing(true);

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

      
      this_.fbrc.add(this_.cover);
      this_.cover.sendToBack();
      this_.cover.scale(0.7, 0.7)
      this_.fbrc.renderAll();      
    });
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
