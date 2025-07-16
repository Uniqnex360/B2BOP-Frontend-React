import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Modal,
  LinearProgress,
  Paper,
  IconButton, FormControl, InputLabel, Select, MenuItem, FormHelperText 
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ApiResponseModal from "../Products/ApiResponseModel";  // Ensure this path is correct for your imports

const PersonalImport = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(true); // Show modal on mount
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedFilepath, setSelectedFilepath] = useState("");

  const [isMounted, setIsMounted] = useState(false); // Track if the component is mounted
  const [industries, setIndustries] = useState([]);
  const [industriesEdit, setIndustriesEdit] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [industryId, setIndustriesId] = useState([]);
  // Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const fetchIndustries = async () => {
    try {
      const manufactureUnitId = getManufactureUnitId();

      // Ensure your API URL is correct
      const response = await axios.get(`${process.env.REACT_APP_IP}obtainIndustryForManufactureUnit/?manufacture_unit_id=${manufactureUnitId}`);
      console.log('Industry data:', response.data);
      setIndustries(response.data.data); // Set fetched industries to state
    } catch (err) {
      console.error('Error fetching industry list:', err);
    }
  };

  // Fetch industries on component mount
  useEffect(() => {
    fetchIndustries();
  }, []);
  const handleFieldChange = (field, value) => {
    if (field === 'industries') {
      setIndustriesEdit(value);
    }
  };
  const getManufactureUnitId = () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).manufacture_unit_id : '';
  };

  // Handle File Drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Prevent default drag behavior
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Close Modal
  const closeImportModal = () => {
    setShowImportModal(false);
    setSelectedFile(null);
    setUploadProgress(0);
    navigate("/manufacturer/products/"); // Update the path if necessary
  };

  // Handle Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm-side',
        },
      });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', selectedFile);

    // Retrieve manufacture unit ID from localStorage
    const userData = localStorage.getItem("user");
    let manufactureUnitId = "";

    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        manufactureUnitId = parsedUserData.manufacture_unit_id || "";
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }

    try {
      // Sending the file and manufacture_unit_id as query parameter
      const response = await axios.post(
        `${process.env.REACT_APP_IP}upload_file_new/`,  // The URL
        formData, // The form data with the file
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            manufacture_unit_id: manufactureUnitId,  // Pass the manufactureUnitId as a query param
            industry_id_str:industriesEdit,
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);  // Update the progress bar
          },
        }
      );

      setSelectedFilepath(response.data.data.file_path);
      setIndustriesId(response.data.data.industry_id_str)
      console.log('Status:', response.data.data.status); // Check the status in the response

      if (response.data && response.data.data.status) {
        // If status is true, show the response modal with data
        setApiResponse(response.data.data);
        setShowResponseModal(true);
        setShowImportModal(false);
      } else {
        Swal.fire({
          title: 'Success!',
          text: 'File uploaded successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
          },
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showUploadErrorSwal('An error occurred while uploading the file.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Show upload error message
  const showUploadErrorSwal = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        container: 'swal-custom-container',
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm-side',
      },
    });
  };

  // Set the isMounted state to true when the component mounts
  useEffect(() => {
    setIsMounted(true);

    // Cleanup function for component unmount
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Ensure to prevent state update if component is unmounted
  useEffect(() => {
    if (isMounted && apiResponse) {
      setShowResponseModal(true);
    }
  }, [apiResponse, isMounted]);

  return (
    <>
      <Modal open={showImportModal} onClose={closeImportModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 450,
            bgcolor: "white",
            p: 4,
            borderRadius: "12px",
            boxShadow: 3,
            textAlign: "center",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={closeImportModal}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Upload File
          </Typography>

          {/* Drag & Drop Zone */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              border: "2px dashed #3498db",
              borderRadius: "10px",
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { backgroundColor: "#f9f9f9" },
            }}
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <CloudUploadIcon sx={{ fontSize: 40, color: "#3498db" }} />
            <Typography variant="body1" color="textSecondary">
              Drag & Drop file here or <b style={{ color: "#3498db" }}>Choose file</b>
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Supported formats: XLS, XLSX | Max size: 25MB
            </Typography>
          </Paper>



          {/* Selected File Display */}
          {selectedFile && (
            <Box
              mt={2}
              p={2}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Box display="flex" alignItems="center">
                <InsertDriveFileIcon sx={{ color: "#3498db", mr: 1 }} />
                <Typography variant="body2">{selectedFile.name}</Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedFile(null)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}


<Box sx={{marginTop:'20px'}}>
        <FormControl fullWidth error={locationError}>
  <InputLabel>Industry</InputLabel>
  <Select
    label="Industry"
    value={industriesEdit || ""} // Selected industry ID
    onChange={(e) => {
      setIndustriesEdit(e.target.value); // Update the selected industry
      setLocationError(false); // Clear error if an industry is selected
    }}
    size="small"
    sx={{
      width: "300px", // Increase the width of the select field
      height: "35px", // Reduce the height of the dropdown
    }}
  >
    {industries.map((industry) => (
      <MenuItem key={industry.id} value={industry.id}>
        {industry.name}
      </MenuItem>
    ))}
  </Select>
  {locationError && <FormHelperText>Industry must be selected</FormHelperText>}
</FormControl>


</Box>

          {/* Progress Bar */}
          {loading && (
            <Box mt={2}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" mt={1}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={closeImportModal} sx={{ flex: 1, mr: 1, textTransform:'capitalize' }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              disabled={loading}
              sx={{ flex: 1, textTransform:'capitalize' }}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </Box>

          {/* Download Sample File */}
       
        </Box>
      </Modal>

      {showResponseModal && (
        <ApiResponseModal
          showResponseModal={showResponseModal}
          setShowResponseModal={setShowResponseModal}
          apiResponse={apiResponse}
          selectedFilepath={selectedFilepath || ""}
          industryValue= {industryId}
        />
      )}
    </>
  );
};

export default PersonalImport;
