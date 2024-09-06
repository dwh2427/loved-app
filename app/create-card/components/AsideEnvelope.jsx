'use client'; // This marks the component as a Client Component
import { useState } from 'react';

export default function AsideEnvelope({ customClassName, activeTool }) {
    const envelopes = Array.from({ length: 18 }, (_, i) => i + 1); // This creates an array [1, 2, 3, ..., 18]

    const colors = [
        "#ffffff", "#fcfaf4", "#f1ede4", "#fcdbea", "#ffd1e0", "#f6c2c4", "#f2666d",
        "#c23166", "#e71b29", "#b83333", "#992222", "#e57147", "#ff9d2e", "#f5d145",
        "#f5f16e", "#fdf0bc", "#cae5cf", "#b4dbc9", "#b6d9ab", "#57b255", "#5b8f69",
        "#748977", "#79cacd", "#d7e6f9", "#a2cfee", "#84add9", "#5780ac", "#4e6c8f",
        "#eadae5", "#e5dcf5", "#c3b2e7", "#7084d6", "#ebd1aa", "#e0c186", "#c9ad7d",
        "#986c55", "#c7c3c3", "#544c4c", "#333333"
    ];
    const [textColor, setTextColor] = useState('#efc2cf');

    return (
        <aside id="envelope-aside">
            <button className="aside-close">&times;</button>

            <ul id="envelope-nav">
                <li className="active" data-nav="outer">Color</li>
                <li data-nav="inner">Liner</li>
            </ul>

            <div id="envelope-aside-outer" className="active">
                <div>
                    <label>Choose color:</label>
                    <input
                        id="envelope-color"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                    />
                    <ul id="envelope-colors-list" className="color-list">
                        {colors.map((color, index) => (
                            <li key={index} data-color={color}>
                                <div style={{ background: color }}></div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div id="envelope-aside-inner">
                <label>Choose material:</label>
                <ul id="envelope-liner-list" className="color-list">
                    {envelopes.map((envelope) => (
                        <li key={envelope} data-pattern={envelope}>
                            <div className="lazy" data-bg={`assets/img/patterns/${envelope}.jpg`}></div>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
