'use client'; // This marks the component as a Client Component


import { useState } from 'react';
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

  const handleTabChange = (tab) => {
        setActiveTool(tab);
        setCustomClassName('active'); // You can add more logic here if needed to change the class dynamically
    };


  return (
    <div>
      <div style={{ display: 'none' }}>
          <input id="add-photo-file" type="file" accept="image/*" />
      </div>
      <main id="cards-constructor">
            <Sidebar onTabChange={handleTabChange} activeTool={activeTool} />
            <AsideContent customClassName={customClassName} activeTool={activeTool} />
            <AsideCover customClassName={customClassName} activeTool={activeTool} />
            <AsideEnvelope customClassName={customClassName} activeTool={activeTool} />
            <CanvasArea activeTool={activeTool} />
    
          {canvas && <UndoRedo canvas={canvas} />}
      </main>
    </div>
  );
}
