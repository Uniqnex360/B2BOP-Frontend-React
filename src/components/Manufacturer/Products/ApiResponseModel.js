import React, { useState, useEffect } from "react";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';
import "../../Manufacturer/Products/ModelImport.css";

const ApiResponseModal = ({
  showResponseModal,
  setShowResponseModal,
  apiResponse,
  selectedFilepath,
  industryValue
}) => {
  const [mapping, setMapping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSource, setDraggedSource] = useState(null);
  const [allMapped, setAllMapped] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  console.log('valid', validationErrors)
  const navigate = useNavigate();

  const databaseOptions = apiResponse?.Database_options || [];
  const databaseList = apiResponse?.Database_list || [];

  if (selectedFilepath) {
    localStorage.setItem("selectedFile", selectedFilepath);
  }
  let selectedFiles = localStorage.getItem("selectedFile");
  
  useEffect(() => {
    console.log('Updated validation errors:', validationErrors);
  }, [validationErrors]); 


  useEffect(() => {
    if (apiResponse?.extract_list) {
      const initialMapping = apiResponse.extract_list.map((item) => {
        let resultKey = null;

        // Find the key corresponding to the value in item
        for (const [key, value] of Object.entries(databaseList)) {
          if (value === item) {
            resultKey = key;
            break;
          }
        }

        return {
          columnHeader: item,
          databaseOption: resultKey,
        };
      });
      setMapping(initialMapping); // Update mapping state
    }
    setLoading(false); // Stop loading after setting mapping
  }, [apiResponse, databaseList]);

  useEffect(() => {
    const allMappedValues = mapping.every(row => row.databaseOption !== "");
    setAllMapped(allMappedValues);
  }, [mapping]);

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <CircularProgress size={50} />
        <span>Processing...</span>
      </div>
    );
  }

  const handleDragStart = (item, index, source) => {
    setDraggedItem(item);
    setDraggedIndex(index);
    setDraggedSource(source);
  };

  const handleDropDatabaseOption = () => {
    if (draggedSource === "mapToWhere") {
      const updatedMapping = mapping.map((row, index) => {
        if (index === draggedIndex) {
          return { ...row, databaseOption: "" };
        }
        return row;
      });
      setMapping(updatedMapping);
    }
    setDraggedItem(null);
    setDraggedSource(null);
  };

  const handleDropMapToWhere = (targetIndex) => {
    const updatedMapping = [...mapping];

    if (draggedSource === "databaseOptions") {
      updatedMapping[targetIndex].databaseOption = draggedItem;
    } else if (draggedSource === "mapToWhere") {
      const temp = updatedMapping[targetIndex].databaseOption;
      updatedMapping[targetIndex].databaseOption = draggedItem;
      updatedMapping[draggedIndex].databaseOption = temp;
    }

    setMapping(updatedMapping);
    setDraggedItem(null);
    setDraggedSource(null);
  };

  const handleDashboard = async () => {
    navigate('/manufacturer/products/personalimport');
    window.location.reload();
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    // Retrieve user data from localStorage
    const userData = localStorage.getItem("user");
    let manufactureUnitId = "";
  
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      manufactureUnitId = parsedUserData.manufacture_unit_id || "";
    }
  
    // Prepare field data based on the mapping
    const fieldData = {};
    mapping.forEach((row) => {
      if (row.databaseOption) {
        fieldData[row.databaseOption] = row.columnHeader;
      }
    });
  
    // Fields that need to be validated for mapping
    const requiredFields = [
      "sku_number_product_code_item_number",
      "mpn",
      "brand_name",
      "product_name",
      "long_description",
      "msrp",
      "list_price",
      "quantity",
      "availability",
      "return_applicable",
      "level1 category",
      "level2 category"
    ];
  
    // Check if all required fields are mapped
    const missingFields = requiredFields.filter(field => !fieldData[field]);
  
    if (missingFields.length > 0) {
      Swal.fire({
        title: 'Validation Error!',
        text: `Please map the following required fields: ${missingFields.join(", ")}`,
        icon: 'error',
        confirmButtonText: 'OK'
      });
      setLoading(false);
      return;
    }
  
    // Create the body for the request
    const bodyParams = {
      file_path: selectedFiles, // Include the selected file
      field_data: JSON.stringify(fieldData), // Convert field data to string
      manufacture_unit_id: manufactureUnitId,
      industry_id_str: industryValue
    };
  
    try {
      // Make the POST request with the body parameters
      const response = await axios.post(
        `${process.env.REACT_APP_IP}save_xl_data_new/`,
        bodyParams, // Send the body with the parameters
        {
          headers: {
            "Content-Type": "application/json", // Send as JSON
          }
        }
      );
  
      if (response.data && response.data.data.status === true) {
        // Success case
        Swal.fire({
          title: 'Success!',
          text: 'File uploaded successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/manufacturer/products');
          window.location.reload();
        });
      }else if (response.data && response.data.data.status === false) {
        // If the response indicates validation errors
        const errors = response.data.data.validation_error || [];
        console.log('error message', errors); // Make sure you are logging the correct structure
      
        // Set the validation errors in state
        setValidationErrors(errors);
 console.log('2 error message', errors); // Make sure you are logging the correct structure

// Proceed to display errors if any
if (errors.length > 0) {
    // Create a string to hold the HTML content
    let errorHtml = '';

    errors.forEach((errorValue) => {
        errorHtml += `<div><strong>Row ${errorValue.row}:</strong>
        `;
        
        if (errorValue.error && errorValue.error.length > 0) {
            errorValue.error.forEach((err) => {
                errorHtml += `<li>${err}</li>`;
            });
        }
        
        errorHtml += `
        </div>`;
    });

    Swal.fire({
        title: 'Validation Errors',
        html: errorHtml, // Use the constructed HTML string
        icon: 'error',
        confirmButtonText: 'OK',
    })
    .then(() => {
        window.location.reload();
        // navigate('/manufacturer/products/personalimport');
        
      });
}
          
        // Optionally close modal after showing validation errors
        setShowResponseModal(false);
      }
      
    } catch (err) {
      // Handle error from API call
      console.error("API Error:", err);
      setError("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  
  const isMatched = (value) => draggedItem && value && draggedItem === value;
  const isUnmatched = (value) => draggedItem && value && draggedItem !== value && value !== "";

  // Utility function to ensure data is a valid renderable type (string or number)
  const renderValue = (value) => {
    if (value === undefined || value === null) return "";
    return value.toString();
  };

  return (
    <>
      {showResponseModal && (
        <div className="modal-overlay">
          <div className="modal-content-import">
            <div className="modal-header">
              <h2>Field Mapping</h2>
              <button onClick={() => { setShowResponseModal(false); handleDashboard(); }} className="btn-close">X</button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="loading-spinner-container">
                  <CircularProgress size={50} />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="modal-content-box">
                  <div className="table-container">
                    <table className="styled-table">
                      <thead>
                        <tr>
                          <th>Your Column Header</th>
                          <th>Map to Where</th>
                          <th>Unmatched values</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mapping.map((row, index) => (
                          <tr key={index}>
                            <td>{renderValue(row.columnHeader)}</td>
                            <td
                              onDrop={() => handleDropMapToWhere(index)}
                              onDragOver={(e) => e.preventDefault()}
                              className={`map-to-where-cell ${allMapped || isMatched(row.databaseOption) ? "" : "highlight"} ${isMatched(row.databaseOption) ? "matched" : ""} ${isUnmatched(row.databaseOption) ? "unmatched" : ""}`}
                            >
                              <div
                                className={`draggable-item ${isMatched(row.databaseOption) ? "matched" : ""} ${isUnmatched(row.databaseOption) ? "unmatched" : ""}`}
                                draggable={!!row.databaseOption}
                                onDragStart={() =>
                                  row.databaseOption &&
                                  handleDragStart(row.databaseOption, index, "mapToWhere")
                                }
                              >
                                {renderValue(row.databaseOption) || "Drop here"}
                              </div>
                            </td>
                            {index === 0 ? (
                              <td rowSpan={mapping.length}>
                                <div
                                  className="options-list"
                                  onDrop={handleDropDatabaseOption}
                                  onDragOver={(e) => e.preventDefault()}
                                >
                                  {databaseOptions
                                    .filter((option) => !mapping.some((row) => row.databaseOption === option))
                                    .map((option, i) => (
                                      <div
                                        key={i}
                                        className={`draggable-item ${isMatched(option) ? "matched" : ""} ${isUnmatched(option) ? "unmatched" : ""}`}
                                        draggable
                                        onDragStart={() => handleDragStart(option, null, "databaseOptions")}
                                      >
                                        {renderValue(option)}
                                      </div>
                                    ))}
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Mapping"}
              </button>
              <button className="btn-close-down" onClick={() => { setShowResponseModal(false); handleDashboard(); }}>Close</button>
            </div>
          </div>
        </div>
      )}
{/* {validationErrors.length > 0 && (
  <div className="validation-errors">
    <h3>Validation Errors:</h3>
    <ul>
      {validationErrors.map((error, index) => (
        <li key={index}>
          <strong>Row {error.row}:</strong>
          <ul>
       
            {Array.isArray(error.error) && error.error.length > 0 && error.error.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </div>
)}

<div className="modal-footer">
  <button className="btn-close" onClick={() => setShowResponseModal(false)}>Close</button>
</div> */}



    </>
  );


  
}

export default ApiResponseModal;
