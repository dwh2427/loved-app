const Toolbar = ({ setActiveTool }) => {
    return (
      <div id="toolbar">
        <button onClick={() => setActiveTool('text')}>Add Text</button>
        <button onClick={() => setActiveTool('sticker')}>Add Sticker</button>
        <button onClick={() => setActiveTool('paint')}>Paint</button>
      </div>
    );
  };
  
  export default Toolbar;
  