export default function Sidebar({ onTabChange, activeTool }) {
    const tabs = [
        { id: 'templates', icon: 'assets/img/icon-templates.svg', label: 'Templates' },
        { id: 'text', icon: 'assets/img/icon-text.svg', label: 'Text' },
        { id: 'stickers', icon: 'assets/img/icon-sticker.svg', label: 'Stickers' },
        { id: 'paint', icon: 'assets/img/icon-brush.svg', label: 'Paint' },
        { id: 'photo', icon: 'assets/img/icon-photo.svg', label: 'Photo' },
        { id: 'base', icon: 'assets/img/icon-drop.svg', label: 'Base' }
    ];

    return (
        <nav className="active">
            <ul id="content-nav">
                {tabs.map((tab) => (
                    <li
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={activeTool === tab.id ? 'active' : ''}
                        data-nav={tab.id} 
                    >
                        <img src={tab.icon} alt={tab.label} />
                        <p>{tab.label}</p>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
