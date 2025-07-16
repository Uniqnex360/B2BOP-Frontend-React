import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faColumns,
  faBox,
  faReceipt,
  faUsers,
  faCog,
  faSignOutAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Logout from '../Login/Logout';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection = (() => {
    const path = location.pathname;
    if (path.includes('/manufacturer/products')) return 'products';
    if (path.includes('/manufacturer/orders')) return 'orders';
    if (path.includes('/manufacturer/dealerList')) return 'buyers';
    if (path.includes('/manufacturer/settings')) return 'settings';
    if (path === '/manufacturer') return 'dashboard';
    return '';
  })();

  return (
    <div style={{ width: '170px', backgroundColor: '#fff', minHeight: '100vh', position: 'fixed', left: 0, top: 0, boxShadow: '2px 0 5px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      {/* Close Button */}
      <div>
        <div style={{ textAlign: 'right', padding: '10px' }}>
          <FontAwesomeIcon icon={faTimes} className="icon" onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
        </div>

        {/* Menu Items */}
        <ul className="topMenu" style={{ listStyle: 'none', padding: '0 10px', margin: '20px 0px 0px 0px' }}>
          <li onClick={() => navigate('/manufacturer')}
              className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', cursor: 'pointer', color: activeSection === 'dashboard' ? '#007bff' : '#000' }}>
            <FontAwesomeIcon icon={faColumns} className="icon" style={{ marginRight: '10px' }} />
            Dashboard
          </li>

          <li onClick={() => navigate('/manufacturer/products')}
              className={`menu-item ${activeSection === 'products' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', cursor: 'pointer', color: activeSection === 'products' ? '#007bff' : '#000', backgroundColor: activeSection === 'products' ? '#f5f7fa' : 'transparent', borderRadius: '4px' }}>
            <FontAwesomeIcon icon={faBox} className="icon" style={{ marginRight: '10px' }} />
            Products
          </li>

          <li onClick={() => navigate('/manufacturer/orders')}
              className={`menu-item ${activeSection === 'orders' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', cursor: 'pointer', color: activeSection === 'orders' ? '#007bff' : '#000' }}>
            <FontAwesomeIcon icon={faReceipt} className="icon" style={{ marginRight: '10px' }} />
            Orders
          </li>

          <li onClick={() => navigate('/manufacturer/dealerList')}
              className={`menu-item ${activeSection === 'buyers' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', cursor: 'pointer', color: activeSection === 'buyers' ? '#007bff' : '#000' }}>
            <FontAwesomeIcon icon={faUsers} className="icon" style={{ marginRight: '10px' }} />
            Buyers
          </li>

          <li onClick={() => navigate('/manufacturer/settings')}
              className={`menu-item ${activeSection === 'settings' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', cursor: 'pointer', color: activeSection === 'settings' ? '#007bff' : '#000' }}>
            <FontAwesomeIcon icon={faCog} className="icon" style={{ marginRight: '10px' }} />
            Settings
          </li>
        </ul>
      </div>

      {/* Logout Button at the Bottom */}
      <div style={{ padding: '10px', cursor: 'pointer' }}>
        <Logout>
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" style={{ marginRight: '10px' }} />
          Logout
        </Logout>
      </div>
    </div>
  );
};

export default Sidebar;
