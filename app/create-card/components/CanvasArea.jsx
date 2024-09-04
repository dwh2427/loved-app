import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

const CanvasArea = ({ activeTool }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    // Initialize fabric.js canvas
    const fabricCanvas = new fabric.Canvas(canvasElement, {
      width: 800,
      height: 600,
      backgroundColor: '#fff',
    });

    // Store canvas object in state
    setCanvas(fabricCanvas);

    return () => fabricCanvas.dispose(); // Clean up on unmount
  }, []);

  useEffect(() => {
    if (!canvas) return;

    switch (activeTool) {
      case 'text':
        addTextTool(canvas);
        break;
      case 'sticker':
        addStickerTool(canvas);
        break;
      case 'paint':
        enablePaintTool(canvas);
        break;
      default:
        break;
    }
  }, [activeTool, canvas]);

  const addTextTool = (canvas) => {
    const text = new fabric.IText('Enter your text', {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: 'black',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const addStickerTool = (canvas) => {
    fabric.Image.fromURL('/assets/sticker.png', (img) => {
      img.set({
        left: 150,
        top: 150,
        scaleX: 0.5,
        scaleY: 0.5,
      });
      canvas.add(img);
      canvas.renderAll();
    });
  };

  const enablePaintTool = (canvas) => {
    canvas.isDrawingMode = true;

    // Ensure freeDrawingBrush is initialized
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = 'black'; // Set the brush color
      canvas.freeDrawingBrush.width = 5; // Set the brush width
    } else {
      console.error('freeDrawingBrush is not available');
    }
  };

  return <canvas ref={canvasRef} id="canvas" />;
};

export default CanvasArea;
