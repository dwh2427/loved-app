'use client'; // This marks the component as a Client Component


import { useState } from 'react';
import Toolbar from './components/Toolbar';
import CanvasArea from './components/CanvasArea';
import UndoRedo from './components/UndoRedo';

import Sidebar from './components/Sidebar';
import AsideContent from './components/AsideContent';

export default function Home() {
  const [activeTool, setActiveTool] = useState(null);
  const [canvas, setCanvas] = useState(null);
  const [customClassName, setCustomClassName] =  useState('');

  const handleTabChange = (tab) => {
        setActiveTool(tab);
        setCustomClassName('active'); // You can add more logic here if needed to change the class dynamically
    };


  return (
    <div className="main-container">
        <Sidebar onTabChange={handleTabChange} activeTool={activeTool} />
        <AsideContent customClassName={customClassName} activeTool={activeTool} />
        <CanvasArea activeTool={activeTool} />
        <Toolbar setActiveTool={setActiveTool} />
 
      {canvas && <UndoRedo canvas={canvas} />}
    </div>
  );
}
