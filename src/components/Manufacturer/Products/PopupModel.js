import React from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import LayersIcon from "@mui/icons-material/Layers";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "rgba(255, 255, 255, 0.8)", // Glass effect
  backdropFilter: "blur(10px)",
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
  p: 4,
  borderRadius: "16px",
  textAlign: "center",
};

const iconStyle = {
  fontSize: "40px",
  color: "#3498db",
};

const cardStyle = {
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
  cursor: "pointer",
  transition: "0.3s",
  textAlign: "center",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
  },
};

const PopupModal = ({ open = false, onClose = () => {} }) => {
  const navigate = useNavigate();

  const handleGeneralImport = () => {
    onClose();
    window.open("/manufacturer/products/import", "_blank");
  };

  const handlePersonalImport = () => {
    onClose();
    navigate("/manufacturer/products/personalimport");
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          id="modal-title"
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Import Files
        </Typography>

        <Grid container spacing={2} justifyContent="center">
  <Grid item xs={5} onClick={handleGeneralImport} sx={{ ...cardStyle, marginRight: '16px' }}>
    <DescriptionIcon sx={iconStyle} />
    <Typography variant="body1" sx={{ mt: 1 }}>
      General Import
    </Typography>
  </Grid>

  <Grid item xs={5} onClick={handlePersonalImport} sx={cardStyle}>
    <LayersIcon sx={iconStyle} />
    <Typography variant="body1" sx={{ mt: 1 }}>
      Personal Import
    </Typography>
  </Grid>
</Grid>


        {/* <Button
          onClick={onClose}
          variant="contained"
          sx={{
            mt: 3,
            width: "100%",
            height: "50px",
            borderRadius: "24px",
            fontSize: "16px",
            background: "#3498db",
            "&:hover": { background: "#2980b9" },
          }}
        >
          Close
        </Button> */}
      </Box>
    </Modal>
  );
};

export default PopupModal;
