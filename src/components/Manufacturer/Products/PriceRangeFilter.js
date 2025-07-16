// Import necessary modules
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Slider,Button, TextField, Typography } from '@mui/material';

const PriceRangeFilter = ({ onPriceChange, PriceClear, currentRange }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState({ price_from: 0, price_to: '' });
  const [maxPrice, setMaxPrice] = useState(0);
  const [currency, setCurrency] = useState();

  const MaxPrice = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = localStorage.getItem("user");
      let manufactureUnitId = "";
      let role_name = "";

      if (userData) {
        const data = JSON.parse(userData);
        manufactureUnitId = data.manufacture_unit_id;
        role_name = data.role_name;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_IP}get_highest_priced_product/?manufacture_unit_id=${manufactureUnitId}&role_name=${role_name}`
      );

      const responseData = response.data?.data || {};
      const fetchedMaxPrice = responseData.price || 1000;
      setMaxPrice(fetchedMaxPrice);
      setCurrency(responseData.currency);

      // If parent passed a valid range, use it, else use default
      if (currentRange?.price_from !== undefined && currentRange?.price_to !== '') {
        setPriceRange(currentRange);
      } else {
        setPriceRange({ price_from: 0, price_to: fetchedMaxPrice });
      }

    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load price range.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    MaxPrice();
  }, []);

  const handleSliderChange = (event, newValue) => {
    setPriceRange({ price_from: newValue[0], price_to: newValue[1] });
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    onPriceChange({ price_from: newValue[0], price_to: newValue[1] });
  };

  const ClearPrice = () => {
    setPriceRange({ price_from: 0, price_to: maxPrice });
  };

  useEffect(() => {
    PriceClear(ClearPrice);
  }, [PriceClear]);

  return (
    <Box sx={{ padding: 2, maxWidth: '100%', overflow: 'hidden' }}>
      <Typography variant="h6" gutterBottom sx={{ fontSize: "14px", fontWeight: 600 }}>
        Price Range
      </Typography>

      <Slider
        value={[priceRange.price_from, priceRange.price_to]}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderChangeCommitted}
        valueLabelDisplay="auto"
        min={0}
        max={maxPrice}
        step={100}
        sx={{
          marginRight: 2,
          marginBottom: 1,
          height: 2,
          '& .MuiSlider-thumb': {
            width: 10,
            height: 10,
            '&:hover': { boxShadow: 'none' },
            '&:focus, &:focus-visible': { boxShadow: 'none' },
          },
          '& .MuiSlider-track': { height: 2 },
          '& .MuiSlider-rail': { height: 2 },
        }}
      />

      <Box>
        <Typography variant="h6" sx={{ fontSize: "13px" }}>
          {currency}{priceRange.price_from} - {currency}{priceRange.price_to}
        </Typography>
      </Box>
    </Box>
  );
};

export default PriceRangeFilter;