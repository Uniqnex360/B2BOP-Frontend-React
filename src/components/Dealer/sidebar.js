// // src/components/Dealer/sidebar.js
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
// import Logout from '../Login/Logout'; 
// import { Dashboard, Receipt, Settings, ShoppingCart } from '@mui/icons-material'; 
// import CloseIcon from '@mui/icons-material/Close';
// const drawerWidth = 230;

// const Sidebar = ({ isOpen , toggleSidebar }) => {
//     const location = useLocation();

//     const getActiveStyle = (path) => {
//       return location.pathname === path
//         ? { backgroundColor: '#f4f6f8', color: '#1976d2', fontWeight: 'bold' }
//         : {};
//     };

//     const isProductsPage = location.pathname === '/dealer/products';

//     return (
//         <Drawer
//         variant="temporary"
//         open={isOpen}
//         onClose={toggleSidebar}
//         ModalProps={{
//           keepMounted: true, // Better performance on mobile
//         }}
//         sx={{
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//             boxSizing: 'border-box',
//           },
//         }}
//       >
//             <List sx={{ p: 0 }}>
//             <ListItem disablePadding >
//                     <ListItemButton onClick={toggleSidebar} sx={{ justifyContent: 'flex-end' , px:0 , py:1}}>
//                         <CloseIcon sx={{ mr: 1 }} /> 
//                     </ListItemButton>
//                 </ListItem>
//                 <ListItem disablePadding>
//                     <ListItemButton component={Link} to="/dealer" sx={getActiveStyle('/dealer')} onClick={toggleSidebar}>
//                         <Dashboard sx={{ mr: 1 }} /> 
//                         <ListItemText primary="Dashboard" />
//                     </ListItemButton>
//                 </ListItem>
//                 <ListItem disablePadding>
//                     <ListItemButton component={Link} to="/dealer/products" sx={getActiveStyle('/dealer/products')} onClick={toggleSidebar}>
//                         <ShoppingCart sx={{ mr: 1 }} /> 
//                         <ListItemText primary="Products" />
//                     </ListItemButton>
//                 </ListItem>
//                 <ListItem disablePadding>
//                     <ListItemButton component={Link} to="/dealer/orders" sx={getActiveStyle('/dealer/orders')} onClick={toggleSidebar}>
//                         <Receipt sx={{ mr: 1 }} /> 
//                         <ListItemText primary="Orders" />
//                     </ListItemButton>
//                 </ListItem>
//                 <ListItem disablePadding>
//                     <ListItemButton component={Link} to="/dealer/settings" sx={getActiveStyle('/dealer/settings')} onClick={toggleSidebar}>
//                         <Settings sx={{ mr: 1 }} />
//                         <ListItemText primary="Settings" />
//                     </ListItemButton>
//                 </ListItem>
//             </List>

//             <Divider />





            

//             <Box sx={{ mt: 'auto', mb: 2, px: 2 }}>
//                 <ListItem sx={{mt:'15px'}} disablePadding>
//                     <ListItemButton component={Logout}> 
//                         <ListItemText primary="Logout" />
//                     </ListItemButton>
//                 </ListItem>
//             </Box>
//         </Drawer>
//     );
// };

// export default Sidebar;
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
    if (path.includes('/dealer/products')) return 'products';
    if (path.includes('/dealer/orders')) return 'orders';
    if (path.includes('/dealer/settings')) return 'settings';
    if (path === '/dealer') return 'dashboard';
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
          <li onClick={() => navigate('/dealer')}
              className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', cursor: 'pointer', color: activeSection === 'dashboard' ? '#007bff' : '#000' }}>
            <FontAwesomeIcon icon={faColumns} className="icon" style={{ marginRight: '10px' }} />
            Dashboard
          </li>

          <li onClick={() => navigate('/dealer/products')}
              className={`menu-item ${activeSection === 'products' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', cursor: 'pointer', color: activeSection === 'products' ? '#007bff' : '#000', backgroundColor: activeSection === 'products' ? '#f5f7fa' : 'transparent', borderRadius: '4px' }}>
            <FontAwesomeIcon icon={faBox} className="icon" style={{ marginRight: '10px' }} />
            Products
          </li>

          <li onClick={() => navigate('/dealer/orders')}
              className={`menu-item ${activeSection === 'orders' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', padding: '10px 5px', cursor: 'pointer', color: activeSection === 'orders' ? '#007bff' : '#000' }}>
            <FontAwesomeIcon icon={faReceipt} className="icon" style={{ marginRight: '10px' }} />
            Orders
          </li>
          <li onClick={() => navigate('/dealer/settings')}
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
