import React from 'react';
import { Link } from 'react-router-dom';
import './SellGear.css';

function SellGear() {
    return (
        <div className="sell-gear-container">
            <h2>Vælg en kategori</h2>
            <ul className="category-list">
                <li><Link to="/SellGuiBassGear" className="category-link">Guitar/Bas</Link></li>
                <li><Link to="/SellDrumsGear" className="category-link">Trommer</Link></li>
                <li><Link to="/SellStudioGear" className="category-link">Studio</Link></li>
                <li><Link to="/SellKeysGear" className="category-link">Keys</Link></li>
                <li><Link to="/SellStringsGear" className="category-link">Strygere</Link></li>
                <li><Link to="/SellHornsGear" className="category-link">Blæsere</Link></li>
            </ul>
        </div>
    );
}

export default SellGear;