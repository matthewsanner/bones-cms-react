import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, TextField, Button } from "@mui/material";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const handleChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`;
      const response = await fetch(apiUrl, {
        method: "PUT", // Use PUT method to update the post
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        // Post update successful, redirect to home page
        navigate(`/posts/${postId}`);
        toast.success("Edited post successfully!");
      } else {
        // Handle error response from the server
        console.error("Failed to update post");
        toast.error("Failed to update post. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error(
        "An error occurred while updating post. Please try again later."
      );
    }
  };

  // Custom toolbar options for the ReactQuill editor
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // Text style options
    ["blockquote", "code-block"], // Additional formatting options
    [{ list: "ordered" }, { list: "bullet" }], // Lists
    ["link", "image"], // Link and image insertion
  ];

  useEffect(() => {
    // Fetch the post data from the backend using postId
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Populate the form fields with the post data
        setFormData({
          title: data.title,
          content: data.content,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [postId]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{ margin: 3 }}>
          <TextField
            label="Title"
            variant="outlined"
            value={formData.title}
            fullWidth
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </Box>
        <Box sx={{ margin: 3 }}>
          <ReactQuill
            value={formData.content}
            onChange={(value) => handleChange("content", value)}
            modules={{ toolbar: toolbarOptions }} // Provide custom toolbar options
          />
        </Box>
        <Box sx={{ margin: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Update Post
          </Button>
        </Box>
      </form>
      <Box sx={{ margin: 3 }}>
        <Link to={"/"}>Back to Home</Link>
      </Box>
    </>
  );
}

export default EditPost;
