import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function BrandShow({ selectedBrandsProp, onBrandChangeShow, industryId, selectedCategoryId, isParent , searchRemoveBrand}) {
  const [selectedBrandNames, setSelectedBrandNames] = useState(() => {
    const saved = localStorage.getItem('dealerBrand');
    try {
      return saved ? JSON.parse(saved) : []; // Retrieve saved brands or default to empty array
    } catch (error) {
      console.error("Error parsing 'dealerBrand' from localStorage", error);
      return [];
    }
  });

  const [selectedBrandIds, setSelectedBrandIds] = useState(() => {
    const savedIds = localStorage.getItem('selectedBrandIds');
    try {
      return savedIds ? JSON.parse(savedIds) : []; // Retrieve saved brand ids or default to empty array
    } catch (error) {
      console.error("Error parsing 'selectedBrandIds' from localStorage", error);
      return [];
    }
  });

  const [selectedBrands, setSelectedBrands] = useState(() => {
    const saved = localStorage.getItem("dealerBrand");
    return saved ? JSON.parse(saved) : [];
  });

    useEffect(() => {
      if (selectedBrands.length > 0) {
        localStorage.setItem("dealerBrand", JSON.stringify(selectedBrands));
      }
    }, [selectedBrands, selectedBrandIds]);
  
  // Reset selected brands when industryId changes, but only clear if industryId is explicitly reset or empty
  useEffect(() => {
console.log('oppo phone', selectedBrands, selectedBrandIds)
        if (industryId || selectedCategoryId || isParent ) {
      setSelectedBrandNames([]);
      setSelectedBrands([])
      setSelectedBrandIds([]);
      localStorage.removeItem('dealerBrand');
      localStorage.removeItem('selectedBrandIds');
    }
  }, [industryId, selectedCategoryId, isParent]); // Dependency on industryId, selectedCategoryId, isParent to trigger reset

  // Sync selectedBrandNames and selectedBrandIds with selectedBrandsProp from parent component
  useEffect(() => {
    if (Array.isArray(selectedBrandsProp) && selectedBrandsProp.length > 0) {
      setSelectedBrandNames(selectedBrandsProp);
      setSelectedBrandIds(selectedBrandsProp.map(brand => brand.id)); // Sync selectedBrandIds from prop
    }
  }, [selectedBrandsProp]);

  // Update localStorage whenever selectedBrandNames or selectedBrandIds changes
  useEffect(() => {
    if (selectedBrandNames.length === 0) {
      localStorage.removeItem('dealerBrand');
      localStorage.removeItem('selectedBrandIds');
    } else {
      try {
        localStorage.setItem('dealerBrand', JSON.stringify(selectedBrandNames));
        localStorage.setItem('selectedBrandIds', JSON.stringify(selectedBrandIds));
      } catch (error) {
        console.error("Error saving to localStorage", error);
      }
    }
  }, [selectedBrandNames, selectedBrandIds]); // This useEffect will run when selectedBrandNames or selectedBrandIds change

  // Function to remove a brand from selected brands
  const handleTagRemove = (id, brandNew) => {
    console.log('Removing brand', brandNew);

    // Remove the brand from selectedBrandNames and selectedBrandIds
    const updatedNames = selectedBrandNames.filter(brand => brand.id !== id);
    const updatedIds = selectedBrandIds.filter(brandId => brandId !== id);

    // Update state for the selected brands
    setSelectedBrandNames(updatedNames);
    setSelectedBrandIds(updatedIds);

    
    // Update localStorage with updated selectedBrandIds and dealerBrand
    try {
      localStorage.setItem('selectedBrandIds', JSON.stringify(updatedIds));  // Save updated ids
      localStorage.setItem('dealerBrand', JSON.stringify(updatedNames));  // Save updated names
      localStorage.setItem('dealerBrandNew', JSON.stringify(updatedNames));  // Save updated names
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }

    // Notify the parent component about the change, if onBrandChangeShow exists
    if (onBrandChangeShow) {
      onBrandChangeShow({ updatedNames, updatedIds });
    }
    // window.location.reload()
  };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, margin: '10px' }}>
      {selectedBrandNames?.map((brand) => (
        <Box key={brand.id} sx={{ display: 'flex', alignItems: 'center', padding: '3px 9px', backgroundColor: '#d3d3d38c', borderRadius: '25px' }}>
          <Typography sx={{ fontSize: '10px', fontWeight: 500, textTransform: 'none', color: 'black' }}>
            {brand.name}
          </Typography>
          <CloseIcon sx={{ fontSize: '12px', cursor: 'pointer', marginLeft: '5px' }} onClick={() => handleTagRemove(brand.id, brand)} />
        </Box>
      ))}
    </Box>
  );
}

export default BrandShow;
