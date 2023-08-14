import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, TextField, Button } from "@mui/material";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/users/create-account`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Include cookies with the request
      });

      if (response.ok) {
        // Account creation successful, redirect to home page
        navigate("/");
        toast.success("Created account successfully!");
      } else {
        // Handle error response from the server
        console.error("Failed to create account");
        toast.error("Failed to create account. Please try again later.");
      }
    } catch (error) {
      console.error("Error creating account:", error);
      toast.error(
        "An error occurred while creating account. Please try again later."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ margin: 3 }}>
        <TextField
          label="Username"
          variant="outlined"
          value={formData.username}
          fullWidth
          onChange={(e) => handleChange("username", e.target.value)}
        />
      </Box>
      <Box sx={{ margin: 3 }}>
        <TextField
          label="Email"
          variant="outlined"
          value={formData.email}
          fullWidth
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </Box>
      <Box sx={{ margin: 3 }}>
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          value={formData.password}
          fullWidth
          onChange={(e) => handleChange("password", e.target.value)}
        />
      </Box>
      <Box sx={{ margin: 3 }}>
        <Button type="submit" variant="contained" color="primary">
          Create Account
        </Button>
      </Box>
    </form>
  );
};

export default CreateAccount;
