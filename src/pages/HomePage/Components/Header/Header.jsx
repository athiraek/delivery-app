import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className='header'>
      {/* Animated background overlay */}
      <div className="header-overlay"></div>
      
      {/* Floating particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>

      <div className='header-contents'>
        <h2 className='header-title'>Order Your Favourite food here</h2>
        
        <p className='header-description'>
          Choose from a diverse menu featuring a delectable array of dishes crafted with the finest 
          ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate 
          your dining experience, one delicious meal at a time.
        </p>
        
        <button className='header-button'>
          <a href="/menu" className='button-link'>
            <span>View Menu</span>
            <svg className='button-arrow' width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </button>
      </div>
    </div>
  );
};

export default Header;