import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, TextField, Button } from "@mui/material";

const Login = () => {
  const navigate = useNavigate(); // Hook to navigate to different routes
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/login`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        navigate("/");
        toast.success("Signed in successfully!");
      } else {
        // Handle error response from the server
        console.error("Login failed");
        toast.error("Failed to login. Please try again later.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(
        "An error occurred while submitting login. Please try again later."
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
          Login
        </Button>
      </Box>
    </form>
  );
};

export default Login;
