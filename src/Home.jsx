import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

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

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Function to handle pagination navigation
  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchUserData = async (userId) => {
    const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`;
    const response = await fetch(apiUrl, {
      credentials: "include", // Include cookies with the request
    });
    const userData = await response.json();
    return userData.username;
  };

  // Fetch paginated blog posts from the backend API, and retrieve usernames
  useEffect(() => {
    const apiUrl = `${
      import.meta.env.VITE_API_BASE_URL
    }/posts?page=${currentPage}&limit=10`;
    fetch(apiUrl)
      .then((response) => response.json())
      .then(async (data) => {
        // For each post, fetch the associated user data and update the posts array
        for (const post of data.posts) {
          const username = await fetchUserData(post.author);
          post.username = username;
        }
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error(
          "There was an error fetching post data. Please try again later."
        );
      });
  }, [currentPage]);

  return (
    <div>
      {/* Display the list of blog posts */}
      {posts.map((post) => (
        <Card key={post._id} variant="outlined" sx={{ margin: 3 }}>
          <CardHeader
            title={post.title}
            subheader={`Posted by ${post.username} on ${formatDateTime(
              post.date
            )}`}
          />
          <CardContent sx={{ py: 0 }}>
            <Typography
              variant="body1"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content),
              }}></Typography>
          </CardContent>
          <CardActions sx={{ padding: 2 }}>
            {/* The link to the full post page */}
            <Link to={`/posts/${post._id}`}>Read More</Link>
          </CardActions>
        </Card>
      ))}
      {/* Pagination controls */}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ margin: 3 }}
      />
    </div>
  );
}
