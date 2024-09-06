'use client'; // This marks the component as a Client Component

export default function AsideCover({customClassName, activeTool }) {

    const covers = Array.from({ length: 18 }, (_, i) => i + 1); // This creates an array [1, 2, 3, ..., 15]

    return (
        <aside id="cover-aside">
            <button className="aside-close">&times</button>

            <label>Free</label>
            <div>
                <ul id="covers-list">
                    {covers.map((cover, index) => (
                        <li key={index} data-cover={cover}>
                            <img
                                className="lazy"
                                src={`assets/img/covers/${cover}.jpg`}
                                alt={`Cover ${cover}`}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
        );
}
