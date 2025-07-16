import React, { useState, useEffect } from 'react';

const FilterIframe = ({ selectedFiltersIframe }) => {
    const [category, setCategory] = useState(null);  // State to store category name
    const [selectedFilters, setSelectedFilters] = useState({});  // Store selected filters

    // Listen to messages from the iframe
    useEffect(() => {
        const handleMessage = (event) => {
            // Ensure the message is coming from the expected origin
            if (event.origin !== "http://127.0.0.1:5500") return;
    
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

    // Send updated filters and category name back to the parent component
    useEffect(() => {
        // Send updated filters to parent whenever category or selectedFilters change
        if (category || selectedFilters !== null && typeof selectedFilters === 'object' && Object.keys(selectedFilters).length > 0) {
            console.log('Sending updated filters and category to parent:', category, selectedFilters);

            if (selectedFiltersIframe) {
                selectedFiltersIframe({
                    category,
                    selectedFilters
                });
            }
        }
    }, [category, selectedFilters]);  // Run this effect when either category or selectedFilters change

    return (
        <div>
             <iframe
      id="productIframe"
      src="http://127.0.0.1:5500/index.html"
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
    />
        </div>
    );
};

export default FilterIframe;
