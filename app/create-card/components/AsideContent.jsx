'use client'; // This marks the component as a Client Component
import { useState } from 'react';

export default function AsideContent({customClassName, activeTool }) {
    const fonts = ["Comfortaa", "Plus Jakarta Sans", "Rammetto One", "Reenie Beanie", "Sacramento", "Schoolbell", "Send Flowers"];
    const colors = ["#ffffff", "#fcfaf4", "#f1ede4", "#fcdbea", "#ffd1e0", "#f6c2c4", "#f2666d", "#c23166", "#e71b29", "#b83333", "#992222", "#e57147", "#ff9d2e", "#f5d145", "#f5f16e", "#fdf0bc", "#cae5cf", "#b4dbc9", "#b6d9ab", "#57b255", "#5b8f69", "#748977", "#79cacd", "#d7e6f9", "#a2cfee", "#84add9", "#5780ac", "#4e6c8f", "#eadae5", "#e5dcf5", "#c3b2e7", "#7084d6", "#ebd1aa", "#e0c186", "#c9ad7d", "#986c55", "#c7c3c3", "#544c4c", "#333333"];
    const [currentFont, setCurrentFont] = useState(fonts[0]);
    const [textSize, setTextSize] = useState(30);
    const [textColor, setTextColor] = useState('#000000');
    const [textAlign, setTextAlign] = useState('center');
    const stickers = Array.from({ length: 15 }, (_, i) => i + 1); // This creates an array [1, 2, 3, ..., 15]

    const [paintMode, setPaintMode] = useState('Pencil');
    const [lineWidth, setLineWidth] = useState(30);
    const [lineColor, setLineColor] = useState('#000000');
    const [shadowColor, setShadowColor] = useState('#990099');
    const [shadowWidth, setShadowWidth] = useState(0);
    const [shadowOffset, setShadowOffset] = useState(0);
    const [baseColor, setBaseColor] = useState("#000000");


    const renderContent = () => {
        switch (activeTool) {
            case 'templates':
                return (
                    <div id="inside-aside-templates">
                        <h3>Templates</h3>
                        <ul id="templates-list">
                            <li data-template="1">
                                <img src="assets/img/templates/1/thumb.png" alt="Template 1" />
                            </li>
                            <li data-template="2">
                                <img src="assets/img/templates/2/thumb.png" alt="Template 2" />
                            </li>
                        </ul>
                    </div>
                );
            case 'text':
                return (
                     <div id="inside-aside-text">
                        <h3>Text</h3>
                        <div>
                            <button id="add-text" type="button" className="add-button">
                                Add Text
                            </button>
                        </div>
                        <label>Choose font:</label>
                        <div id="current-font">
                            <p style={{ fontFamily: currentFont }} title={currentFont}>{currentFont}</p>
                        </div>
                        <ul id="fonts-list">
                            {fonts.map((font, index) => (
                                <li key={index} onClick={() => setCurrentFont(font)} data-fontfamily={font}>
                                    <p style={{ fontFamily: font }}>{font}</p>
                                </li>
                            ))}
                        </ul>

                        <div>
                            <label>Text size</label>
                            <input
                                id="text-size"
                                type="range"
                                min="10"
                                max="100"
                                step="1"
                                value={textSize}
                                onChange={(e) => setTextSize(e.target.value)}
                            />
                        </div>

                        <div>
                            <label>Text align</label>
                            <ul id="text-align">
                                {['left', 'center', 'right'].map((align) => (
                                    <li key={align} className={textAlign === align ? 'active' : ''} onClick={() => setTextAlign(align)} data-align={align}>
                                        <img src={`assets/img/text-align-${align}.svg`} alt={`Align ${align}`} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <label>Choose color:</label>
                            <input
                                id="text-color"
                                type="color"
                                value={textColor}
                                onChange={(e) => setTextColor(e.target.value)}
                            />
                            <ul id="text-colors-list" className="color-list">
                                {colors.map((color, index) => (
                                    <li key={index} onClick={() => setTextColor(color)} data-color={color}>
                                        <div style={{ backgroundColor: color }}></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            case 'stickers':
                return (
                    <div id="inside-aside-stickers" className="aside-content">
                    <h3>Stickers</h3>

                    <label>Free</label>
                    <div>
                        <ul id="stickers-list">
                            {stickers.map((sticker, index) => (
                                <li key={index} data-sticker={sticker}>
                                    <img
                                        className="lazy"
                                        src={`assets/img/stickers/${sticker}.png`}
                                        alt={`Sticker ${sticker}`}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                );
            case 'paint':
                return (
                 <div id="inside-aside-paint" className="aside-content">
                        <h3>Paint</h3>

                        <div>
                            <label>Mode:</label>
                            <select
                                id="paint-mode"
                                value={paintMode}
                                onChange={(e) => setPaintMode(e.target.value)}
                            >
                                <option value="Pencil">Pencil</option>
                                <option value="Circle">Circle</option>
                                <option value="Spray">Spray</option>
                            </select>
                        </div>

                        <div>
                            <label>Line width:</label>
                            <input
                                type="range"
                                value={lineWidth}
                                min="0"
                                max="150"
                                id="paint-line-width"
                                onChange={(e) => setLineWidth(e.target.value)}
                            />
                            <br />
                        </div>

                        <div>
                            <label>Line color:</label>
                            <input
                                type="color"
                                value={lineColor}
                                id="paint-color"
                                onChange={(e) => setLineColor(e.target.value)}
                            />
                            <br />
                        </div>

                        <div>
                            <label>Shadow color:</label>
                            <input
                                type="color"
                                value={shadowColor}
                                id="paint-shadow-color"
                                onChange={(e) => setShadowColor(e.target.value)}
                            />
                            <br />
                        </div>

                        <div>
                            <label>Shadow width:</label>
                            <input
                                type="range"
                                value={shadowWidth}
                                min="0"
                                max="50"
                                id="paint-shadow-width"
                                onChange={(e) => setShadowWidth(e.target.value)}
                            />
                            <br />
                        </div>

                        <div>
                            <label>Shadow offset:</label>
                            <input
                                type="range"
                                value={shadowOffset}
                                min="0"
                                max="50"
                                id="paint-shadow-offset"
                                onChange={(e) => setShadowOffset(e.target.value)}
                            />
                            <br />
                        </div>
                    </div>
            );

            case 'base':
                return (
                    <div id="inside-aside-base" className="aside-content">
                        <h3>Card Base</h3>
                        <div>
                            <label>Choose Card color:</label>
                            <input
                                id="base-color"
                                type="color"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                            />
                            <ul id="base-colors-list" className="color-list">
                                {colors.map((color, index) => (
                                    <li key={index} onClick={() => setBaseColor(color)} data-color={color}>
                                        <div style={{ background: color }}></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
            // Add more cases for 'stickers', 'paint', etc.
            default:
                return null;
        }
    };

    return     <aside className={` ${customClassName}`} id="inside-aside">
                    {renderContent()}
                </aside>;

}
