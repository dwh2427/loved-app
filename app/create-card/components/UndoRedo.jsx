const UndoRedo = ({ canvas }) => {
    const undo = () => {
      // Handle undo action
      canvas.undo();
    };
  
    const redo = () => {
      // Handle redo action
      canvas.redo();
    };
  
    return (
      <div id="undo-redo">
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
    );
  };
  
  export default UndoRedo;
  