import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "../sidebar";
import ManufacturerHome from "./ManufacturerHome";
import Orders from "../Orders/OrderList";
import Products from "../Products/ProductList";
import AddNewDealer from "../Dealers/AddNewDealer";
import DealerList from "../Dealers/DealerList";
import "../../Manufacturer/manufacturer.css";
import NotificationBar from "../NotificationBar";
import ProductDetail from "../Products/ProductDetail";
import Import from "../Products/Import";
import PersonalImport from "../Products/PersonalImport";
import ImportValidate from "../Products/ImportValidate";
import DealerDetail from "../Dealers/DealerDetail";
import OrderDetail from "../Orders/OrderDetail";
import UserProfile from "./UserProfile";
import SettingsPage from "../Settings/Settingspage";
import { Button, Tooltip } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const ManufacturerDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [iframeData, setIframeData] = useState({ category: null, filters: [] }); // Store selected category and filters
  const location = useLocation();
  const [category, setCategory] = useState(null);  // State to store category name
  const [selectedFilters, setSelectedFilters] = useState({});  // Store selected filters

  // Listen to messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      // Ensure the message is coming from the expected origin
      if (!event.origin ) return;

      // Debugging: log the data received
      console.log('Message received from iframe:', event.data);

      // Check if the message contains the expected data
      if (event.data) {
        console.log('Received category and filters:', event.data);
        // Set selected filters and category name if present
        setSelectedFilters(event.data.filters || {});  // Ensure filters is an object
        setCategory(event.data.categoryName || null);    // Ensure category is set
      } else {
        console.error('No data found in the message');
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    // Cleanup event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);


  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }} >
        <NotificationBar />
        <div className="main-container">
        <div className="sidebar">
          <Sidebar />
        </div>
        <div className="right-container">
          <Routes>
            <Route path="/" element={<ManufacturerHome />} />
            <Route path="userProfile" element={<UserProfile />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order-details/:id" element={<OrderDetail />} />
          <Route path="AddNewDealer" element={<AddNewDealer />} />
          <Route path="dealerList" element={<DealerList />} />
          <Route path="dealer-details/:id" element={<DealerDetail />} />
          <Route
            path="products"
            element={<Products category={category} selectedFilters={selectedFilters} />}
          />
          <Route path="products/details/:id" element={<ProductDetail />} />
          <Route path="products/import" element={<Import />} />
          <Route path="products/validate" element={<ImportValidate />} />
          <Route path="products/personalimport" element={<PersonalImport />} />
          <Route path="settings" element={<SettingsPage />} />
        </Routes>
      </div>
      </div>
      </Box>

      {/* Back to top button */}
      {isVisible && (
        <Tooltip title="Back to Top" arrow>
          <Button
            onClick={scrollToTop}
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#1976d2",
              color: "white",
              zIndex: 9,
              padding: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ArrowUpwardIcon />
          </Button>
        </Tooltip>
      )}

      {/* Conditionally render iframe only for the Products page */}

      {/* Conditionally render iframe only for the Products page */}
      {/* {location.pathname === "/manufacturer/products" && (
        <iframe
          id="filterIframe"
          src="http://127.0.0.1:5500/index.html"
          title="Filter Plugin"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "400px",
            height: "600px",
            border: "none",
            background: "transparent",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        />
      )} */}
    </Box>
  );
};

export default ManufacturerDashboard;
