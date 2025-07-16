// src\components\Dealer\Products\ProductDetailPage.js

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  CircularProgress,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Container,
  Tooltip,
  Breadcrumbs,
  Link,  Accordion, AccordionSummary, AccordionDetails,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import soonImg from "../../assets/soon-img.png";
import fallbackImage from "../../../../src/whirlpool.jpeg";

const ProductDetail = ({ fetchCartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [RelatedProducts, setRelatedProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [mainImage, setMainImage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { industry, category } = location.state || {};
  const [mainImage, setMainImage] = useState(product?.images?.[0] || soonImg);
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const currentPage = queryParams.get('page') || 0;
  //   const { industry, category } = location.state || {};
  // console.log("Industry from state:", industry);
  // console.log("Category from state:", category);
const [expanded, setExpanded] = useState(false);
  const [expandedAttributes, setExpandedAttributes] = useState(false);
  const [expandedfeatures, setExpandedfeatures] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const handleExpandAttributesClick = () => {
    setExpandedAttributes(!expandedAttributes);
  };
   const handleExpandFeaturesClick = () => {
    setExpandedfeatures(!expandedfeatures);
  };
  const { searchQuery } = location.state || {};
  console.log("searchQuery-Details:", searchQuery);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_IP}obtainProductDetails/?product_id=${id}`
        );

        const data = response.data.data || {};
        setProduct(data);
        setMainImage(data.logo || "");

        const userData = localStorage.getItem("user");

        let manufactureUnitId = "";

        if (userData) {
          const data = JSON.parse(userData);
          manufactureUnitId = data.manufacture_unit_id;
        }

        const relatedResponse = await axios.get(
          `${process.env.REACT_APP_IP}get_related_products/?product_id=${id}&manufacture_unit_id=${manufactureUnitId}`
        );
        const relatedData = relatedResponse.data.data || [];
        setRelatedProducts(relatedData);
      } catch (err) {
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // const handleCancel = (type) => {
  //   navigate("/dealer/products", {
  //     state: {
  //       searchQuery,
  //       ...(type === "industry" && { industry }),
  //       ...(type === "category" && { category }),
  //     },
  //   });
  // };

  const handleBreadcrumbClick = (type) => {
    navigate("/dealer/products", {
      state: {
        searchQuery,
        ...(type === "industry" && { industry }),
        ...(type === "category" && { category }),
      },
    });
  };

  const handleQuantityChange = (type) => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : Math.max(prev - 1, 1)
    );
  };

  const handleAddToCart = async (product, quantity, isBuyNow = false) => {
    try {
      console.log("Add to Cart triggered");
      const userData = localStorage.getItem("user");
      const user = JSON.parse(userData); // Assuming user data is stored in localStorage
      const userId = user.id; // Extract user ID

      // Check if the product already exists in the cart
      const existingItem = cartItems.find(
        (item) => item.product_id === product.id
      );

      if (existingItem) {
        // Update quantity if product is already in the cart
        const updatedCartItems = cartItems.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        setCartItems(updatedCartItems);

        // Send API request to update the cart
        await axios.post(
          `${process.env.REACT_APP_IP}createOrUpdateUserCartItem/`,
          {
            user_id: userId,
            product_id: product.id,
            quantity: existingItem.quantity + quantity,
            price: product.list_price,
          }
        );

        toast.success("Product quantity updated.");
      } else {
        // Add new item to the cart
        const newCartItem = {
          product_id: product.id,
          quantity: quantity,
          price: product.list_price,
        };
        setCartItems([...cartItems, newCartItem]);

        // Send API request to create or update the cart item
        await axios.post(
          `${process.env.REACT_APP_IP}createOrUpdateUserCartItem/`,
          {
            user_id: userId,
            product_id: product.id,
            quantity: quantity,
            price: product.list_price,
          }
        );

        toast.success("Product added successfully.");
      }

      console.log("Cart updated successfully!");

      fetchCartCount();
      // If "Buy Now", navigate to checkout
      if (isBuyNow) {
        // Navigate to the checkout page after adding the product
        navigate("/dealer/checkout", {
          state: { product: { ...product, quantity } },
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(product, quantity, true);
  };

  // const handleBreadcrumbClick = (filterType, value) => {
  //   navigate("/dealer/products", {
  //     state: {
  //       [filterType]: value,
  //     },
  //   });
  // };

  // Function to handle image click
  const handleImageClick = (image, index) => {
    setMainImage(image);
    setCurrentIndex(index);
  };

  // Function to go to the previous image
  const handlePrev = () => {
    const newIndex =
      (currentIndex - 1 + product?.images?.length) % product?.images?.length;
    setMainImage(product?.images?.[newIndex] || soonImg);
    setCurrentIndex(newIndex);
  };

  // Function to go to the next image
  const handleNext = () => {
    const newIndex = (currentIndex + 1) % product?.images?.length;
    setMainImage(product?.images?.[newIndex] || soonImg);
    setCurrentIndex(newIndex);
  };

  // Adding keyboard navigation for arrow keys
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    // Cleanup event listener
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [currentIndex, product?.images]);
 
 
  const handleProductClick = (productId) => {
    const url = `/dealer/products/${productId}?searchQuery=${encodeURIComponent(searchQuery)}`;
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    }
  };

  useEffect(() => {
    const handleBackButton = () => {
      // Custom logic for when the back button is pressed
      console.log('Back button pressed');
    };

    // Listen for history changes (back button)
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton); // Clean up listener
    };
  }, []);

  if (loading) return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh", // Adjust height as needed
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error) return <div>{error}</div>;

  // src\components\Dealer\Products\ProductDetailPage.js - Continue

  return (
    <Box sx={{ padding:"10px" }}>

      <Box sx={{padding:'0px 0px 10px 0px'}}>
      <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(`/dealer/products?page=${currentPage}`)}  // Use navigate(-1) instead of history.goBack()
      variant="text"
      sx={{ textTransform: 'capitalize' }}
    >
      Back to Products
    </Button>
      </Box>
      {/* <Box>
        <Breadcrumbs aria-label="breadcrumb" sx={{ margin: "16px 0" }}>
          <Link
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => handleBreadcrumbClick()}
          >
            Back to Products
          </Link>

          {industry && (
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleBreadcrumbClick("industry")}
            >
              {industry.name}
            </Link>
          )}

          {category && (
            <Link
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleBreadcrumbClick("category")}
            >
              {category.name}
            </Link>
          )}

          {searchQuery && (
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              "{searchQuery}"
            </Typography>
          )}
        </Breadcrumbs>
      </Box> */}

      {/* {(!industry || !category) && (
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleCancel}
            variant="text"
            sx={{ textTransform: "capitalize" }}
          >
            Back to Products
          </Button>
        </Box>
      )} */}

      <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Main Product Image */}
                <Box
                  sx={{
                    width: '100%',
                    height: '500px',
                    backgroundColor: '#fdfafa',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '10px',
                    position: 'relative',
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: '95%',
                      height: '95%',
                      objectFit: 'fill',
                    }}
                    image={
                      mainImage &&
                      (mainImage.startsWith("http://example.com")
                        ? soonImg
                        : mainImage.startsWith("http") || mainImage.startsWith("https")
                        ? mainImage
                        : soonImg)
                    }
                    alt={product?.product_name}
                  />
                </Box>
          
                {/* Thumbnails below main image */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  {product?.images?.map((image, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: '70px',
                        height: '70px',
                        border: index === currentIndex ? '2px solid #6c63ff' : '1px solid #e0e0e0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#fff',
                      }}
                      onClick={() => handleImageClick(image, index)}
                    >
                      <img
                        src={
                          image &&
                          (image.startsWith("http://example.com")
                            ? soonImg
                            : image.startsWith("http") || image.startsWith("https")
                            ? image
                            : soonImg)
                        }
                        alt={`Thumbnail ${index}`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 2, boxShadow: "none" }}>
            <CardContent>
              {product.brand_logo ? (
                <img
                  src={product.brand_logo}
                  alt={product.brand_name}
                  style={{ width: "30px", height: "30px" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <Typography
                  variant="h5"
                  style={{ fontSize: "19px", fontWeight:'600' }}
                  gutterBottom
                >
                  {product.brand_name}
                </Typography>
              )}

              <Typography
                variant="h5"
                style={{ fontSize: "19px", fontWeight:'500' }}
                gutterBottom
              >
                {product?.product_name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, fontSize: "15px" }}>
                {product?.short_description}
              </Typography>
              {/* <Typography variant="body1" sx={{ mt: 1, fontSize: "15px" }}>
                SKU Number: {product.sku_number_product_code_item_number}
              </Typography> */}
              <Typography variant="body1" sx={{ mt: 1, fontSize: "15px" }}>
                MPN Number: {product.mpn} | UPC Number: {product.upc_ean}
              </Typography>
              {/* <Typography variant="body1" sx={{ mt: 1, fontSize: "15px" }}>
              </Typography> */}
              <Typography
                variant="body1"
                sx={{ mt: 1, fontSize: "15px", mb: 2 }}
              >
                MSRP : {product.msrp.toFixed(2)}
              </Typography>

              {/* Price */}
              <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <p
                  style={{
                    color: "#0F1111",
                    fontSize: "26px",
                    fontWeight: 700,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      margin: "2px",
                      position: "absolute",
                      top: "3px",
                      left: "-12px",
                    }}
                  >
                    {product.currency}
                  </span>
                  {product.list_price.toFixed(2)}
                </p>
                  <Typography
                variant="h6"
                style={{
                  fontSize: "18px",
                  textDecoration:
                    product.list_price.toFixed(2) ===
                    product.was_price.toFixed(2)
                      ? "none"
                      : "line-through",
                  color: "gray",
                }}
              >
                Was: {product.was_price.toFixed(2)}
              </Typography>
                              {product.discount !== "0%" && (
                  <p
                    style={{
                      color: "white",
                      fontSize: "18px",
                      fontWeight: 400,
                      backgroundColor:'rgb(255 5 5)',
                      borderRadius:'5px',
                      minWidth:'18%',
                      textAlign:'center'
                    }}
                  >
                    {product.discount} OFF
                  </p>
                )}

              </Box>
              {/* Quantity Selection */}
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 2,
                    border: "1px solid #1976d2",
                    borderRadius: "5px",
                  }}
                >
                  <Button
                    sx={{ minWidth: "40px" }}
                    onClick={() => handleQuantityChange("decrement")}
                  >
                    -
                  </Button>
                  <Typography sx={{ mx: 1 }}>{quantity}</Typography>
                  <Button
                    sx={{ minWidth: "40px" }}
                    onClick={() => handleQuantityChange("increment")}
                  >
                    +
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2, fontSize: "12px", width: "22%" }}
                  onClick={() => handleAddToCart(product, quantity)}
                >
                  Add to Cart
                </Button>
                 <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "0px",
                  justifyContent:"flex-end",
                }}
              >
                <Tooltip title="Functionality in progress">
                  <span>
                    {" "}
                    {/* Wrap the Button in a span to ensure Tooltip works on disabled elements */}
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ marginBottom: "0px" }}
                      onClick={() => handleBuyNow(product, quantity, true)}
                      disabled
                    >
                      Buy Now
                    </Button>
                  </span>
                </Tooltip>
              </Box>
              </Box>

              {/* Buy Now and Add to Cart Buttons */}
             
            </CardContent>
          </Card>
           <Accordion expanded={expanded} onChange={handleExpandClick} sx={{boxShadow:'none' }}>
                      <AccordionSummary     expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}>
                        <Typography variant="h6">Product Information</Typography>
                      </AccordionSummary>
                      <AccordionDetails style={{padding:'10px'}}>
                        <TableContainer sx={{ marginTop: "10px" }}>
                        <Table
                          sx={{
                            "& .MuiTableCell-root": {
                              border: "1px solid rgba(224, 224, 224, 1)",
                            },
                          }}
                        >
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                                Model Name
                              </TableCell>
                              <TableCell>{product.model}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                                Brand Name
                              </TableCell>
                              <TableCell>{product.brand_name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                                Product Category
                              </TableCell>
                              <TableCell>{product.end_level_category}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                                Industry
                              </TableCell>
                              <TableCell>{product.industry_name}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                                Product Description
                              </TableCell>
                              <TableCell>{product.long_description}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      </AccordionDetails>
            </Accordion>
          <Accordion expanded={expandedAttributes} onChange={handleExpandAttributesClick} sx={{boxShadow:'none' }}>
                      <AccordionSummary     expandIcon={expandedAttributes ? <RemoveIcon /> : <AddIcon />}>
                        <Typography variant="h6">Product Attributes</Typography>
                      </AccordionSummary>
                      <AccordionDetails style={{padding:'10px'}}>
                         <TableContainer
                          sx={{
                            marginTop: "10px",
                          }}
                        >
                          <Table
                            sx={{
                              "& .MuiTableCell-root": {
                                border: "1px solid rgba(224, 224, 224, 1)",
                              },
                            }}
                          >
                            <TableBody>
                              {Object.entries(product.attributes).map(([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell sx={{ width: "250px", fontWeight: "bold" }}>
                                    {key}
                                  </TableCell>
                                  <TableCell>{value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
            </Accordion>
          <Accordion expanded={expandedfeatures} onChange={handleExpandFeaturesClick} sx={{boxShadow:'none'}}>
                      <AccordionSummary     expandIcon={expandedfeatures ? <RemoveIcon /> : <AddIcon />}>
                        <Typography variant="h6">Features</Typography>
                      </AccordionSummary>
                      <AccordionDetails style={{padding:'10px'}}>
                        {product.features && product.features.length > 0 ? (
                product.features.map((feature, index) => (
                  <ul
                    style={{
                      paddingLeft: "20px",
                      color: "rgba(0, 0, 0, 0.87)",
                    }}
                    key={index}
                  >
                    <li
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.43,
                        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                      }}
                    >
                      {feature}
                    </li>
                  </ul>
                ))
              ) : (
                <Typography
                  variant="p"
                  color="textSecondary"
                  sx={{ textAlign: "left" }}
                >
                  No data available for features
                </Typography>
              )}
                      </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Grid container spacing={4} style={{ marginTop: "16px", display:'none' }}>
        {/* First Nested Grid */}
        <Grid item xs={12} md={8}>
          <Box sx={{ p: 0 }}>
            <Typography variant="h5" color="textSecondary">
              Product Information
            </Typography>

            {/* Product Info */}
            <TableContainer sx={{ marginTop: "10px" }}>
              <Table
                sx={{
                  "& .MuiTableCell-root": {
                    border: "1px solid rgba(224, 224, 224, 1)",
                  },
                }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                      Model Name
                    </TableCell>
                    <TableCell>{product.model}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                      Brand Name
                    </TableCell>
                    <TableCell>{product.brand_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                      Product Category
                    </TableCell>
                    <TableCell>{product.end_level_category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                      Industry
                    </TableCell>
                    <TableCell>{product.industry_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ width: "120px", fontWeight: "bold" }}>
                      Product Description
                    </TableCell>
                    <TableCell>{product.long_description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Product Attributes Table */}
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="h5" color="textSecondary">
                Product Attributes
              </Typography>
              <TableContainer
                sx={{
                  marginTop: "10px",
                }}
              >
                <Table
                  sx={{
                    "& .MuiTableCell-root": {
                      border: "1px solid rgba(224, 224, 224, 1)",
                    },
                  }}
                >
                  <TableBody>
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell sx={{ width: "250px", fontWeight: "bold" }}>
                          {key}
                        </TableCell>
                        <TableCell>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Features Table */}
            <Box sx={{ marginTop: "30px" }}>
              <Typography sx={{ mb: 1 }} variant="h5" color="textSecondary">
                Features
              </Typography>
              {product.features && product.features.length > 0 ? (
                product.features.map((feature, index) => (
                  <ul
                    style={{
                      paddingLeft: "20px",
                      color: "rgba(0, 0, 0, 0.87)",
                    }}
                    key={index}
                  >
                    <li
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.43,
                        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                      }}
                    >
                      {feature}
                    </li>
                  </ul>
                ))
              ) : (
                <Typography
                  variant="p"
                  color="textSecondary"
                  sx={{ textAlign: "left" }}
                >
                  No data available for features
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* From The Manufacturer */}
      <Box sx={{ marginY: "20px" }}>
        <Typography variant="h6" color="textSecondary">
          From The Manufacturer
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: "10px",
          }}
        >
          {product.from_the_manufacture && product.from_the_manufacture !== "N/A" ? (
            <img
              src={product.from_the_manufacture}
              alt="Manufacturer"
              style={{ width: "100%", height: "auto" }}
            />
          ) : (
            <>
              <img
                src={fallbackImage}
                alt="Fallback Manufacturer"
                style={{ width: "100%", height: "auto" }}
              />
              {/* <Typography
                variant="body2"
                color="textSecondary"
                sx={{ textAlign: "left", marginTop: "8px" }}
              >
                Image will get uploaded soon
              </Typography> */}
            </>
          )}
          
        </Box>
      </Box>

      <Grid container spacing={4} style={{ marginTop: "16px" }}>
        {/* Display products vertically */}
        <Grid item xs={12} md={12} direction="column">
          <Box sx={{ p: 0 }}>
            <Typography variant="h5" color="textSecondary">
              Related Products
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: "18px", mt: 2,padding:'0px 0px 0px 5px' }}>
            {RelatedProducts.length > 0 ? (
              RelatedProducts.map((product) => (
                <Grid item key={product.id}>
                  <Card
                    onClick={() => handleProductClick(product.id)}
                    elevation={2}
                     sx={{
                    width: "180px",
                    minHeight: "300px",
                    p: 1,
                    mb: 2,
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'scale(1.02)',
                      border: '1px solid #1976d2',
                    },
                  }}
                  >
                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      sx={{
                        width: 120,
                        height: 120,
                        objectFit: "contain",
                        mr: 2,
                        pointerEvents: "none",
                      }}
                      image={
                        product.logo &&
                        product.logo.startsWith("http://example.com")
                          ? soonImg // Use `soonImg` if the URL is `http://example.com`
                          : product.logo.startsWith("http") ||
                              product.logo.startsWith("https")
                            ? product.logo // Use `product.logo` if it's a valid URL
                            : soonImg // Fallback to `soonImg` for all other cases
                      }
                      alt={product?.name}
                    />
                    {/* Product Info */}
                    <CardContent sx={{ flex: 1, p: 0, pb: 0 }}>
                      <Tooltip title={product.name} arrow>
                        <Box
                          sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 3,
                            textOverflow: "ellipsis",
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {product.name}
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Box
                        sx={{
                          // display: "flex",
                          // columnGap: "10px",
                          // flexWrap: "wrap",
                          margin: "5px 0px",
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          SKU: {product.sku_number}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          MPN: {product.mpn}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          UPC: {product.upc_ean}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          MSRP: ${product.msrp}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                      >
                        <Typography
                          variant="body2"
                          color="error"
                          fontWeight="bold"
                        >
                          {product.currency}
                          {product.price} ({product.discount}%)
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: "line-through" }}
                        >
                          Was Price: ${product.was_price}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body2"
                color="textSecondary"
                textAlign="center"
              >
                No items found
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default ProductDetail;
