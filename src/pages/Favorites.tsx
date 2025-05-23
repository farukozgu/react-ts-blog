
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import BlogCard from "@/components/BlogCard";

const Favorites = () => {
  const { user } = useAuth();
  const { userFavorites } = useBlog();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const favorites = userFavorites(user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">My Favorite Posts</h1>

      {favorites.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center">
          <h2 className="text-xl font-medium">You haven't favorited any posts yet</h2>
          <p className="mt-2 text-gray-600">
            Explore posts and bookmark the ones you like!
          </p>
          <button
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            onClick={() => navigate("/")}
          >
            Explore Posts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
