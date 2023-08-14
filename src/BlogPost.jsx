import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";

const BlogPost = ({ authenticated }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [authorizedToEdit, setAuthorizedToEdit] = useState(false);

  // Function to format the date to a more readable format
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    // Get individual date components
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM
    const amOrPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert to 12-hour clock format

    // Return the formatted date and time
    return `${month} ${day}, ${year} at ${formattedHours}:${minutes
      .toString()
      .padStart(2, "0")} ${amOrPm}`;
  };

  // Function to fetch user data by userId
  const fetchUserData = async (userId) => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`;
    const response = await fetch(apiUrl, {
      credentials: "include", // Include cookies with the request
    });
    const userData = await response.json();
    return userData;
  };

  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then(async (data) => {
        const userData = await fetchUserData(data.author);
        data.username = userData.username;
        setPost(data);

        // Fetch the user ID of the currently signed-in user
        const userStatusApiUrl = `${
          import.meta.env.VITE_API_BASE_URL
        }/users/status`;
        const userStatusResponse = await fetch(userStatusApiUrl, {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });
        const userStatusData = await userStatusResponse.json();
        const authenticatedUserId = userStatusData.userId;

        // Check if the current user is authorized to edit the post
        if (authenticated && authenticatedUserId === data.author) {
          setAuthorizedToEdit(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error(
          "An error occurred while retrieving post. Please try again later."
        );
      });
  }, [postId, authenticated]);

  if (!post) {
    return null;
  }

  return (
    <Card key={post._id} variant="outlined" sx={{ margin: 3 }}>
      <CardHeader
        title={post.title}
        subheader={`Posted by ${post.username} on ${formatDateTime(post.date)}`}
      />
      <CardContent sx={{ py: 0 }}>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content),
          }}></Typography>
      </CardContent>
      <CardActions sx={{ padding: 2 }}>
        {/* The link to the home page */}
        <Link to={"/"}>Back to Home</Link>
        {authorizedToEdit && (
          <Link to={`/posts/${post._id}/edit`}>Edit Post</Link>
        )}
      </CardActions>
    </Card>
  );
};

export default BlogPost;
