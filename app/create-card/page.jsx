'use client'; // This marks the component as a Client Component


import { useState, useRef  } from 'react';
import CanvasArea from './components/CanvasArea';
import UndoRedo from './components/UndoRedo';

import Sidebar from './components/Sidebar';
import AsideContent from './components/AsideContent';
import AsideCover from './components/AsideCover';
import AsideEnvelope from './components/AsideEnvelope';

export default function Home() {
  const [activeTool, setActiveTool] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [customClassName, setCustomClassName] =  useState('');
  const fileInputRef = useRef(null); // Reference for the hidden file input

  const handleTabChange = (tab) => {
        setActiveTool(tab);
        setCustomClassName('active'); // You can add more logic here if needed to change the class dynamically
        if (tab === 'photo') {
          fileInputRef.current.click(); // Programmatically trigger file input click
        }
    };


  return (
    <div id='customSections'>
      <input
        id="add-photo-file"
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }} // Keep input hidden
      />
      <main id="cards-constructor">
            <Sidebar onTabChange={handleTabChange} activeTool={activeTool} />
            <AsideContent customClassName={customClassName} activeTool={activeTool} />
            <AsideCover customClassName={customClassName} activeTool={activeTool} />
            <AsideEnvelope customClassName={customClassName} activeTool={activeTool} />
            <CanvasArea
              activeTool={activeTool}
              fileInputRef={fileInputRef} // Pass the file input ref to CanvasArea
            />
          {canvas && <UndoRedo canvas={canvas} />}
      </main>
    </div>
  );
}
