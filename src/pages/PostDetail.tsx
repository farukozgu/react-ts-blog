
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { BookmarkIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, likePost, dislikePost, toggleFavorite, isLiked, isDisliked, isFavorite, deletePost } = useBlog();
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(getPost(id || ""));

  useEffect(() => {
    if (id) {
      const foundPost = getPost(id);
      if (foundPost) {
        setPost(foundPost);
      } else {
        navigate("/not-found");
      }
    }
  }, [id, getPost, navigate]);

  if (!post) {
    return <div className="container mx-auto px-4 py-16 text-left">Loading...</div>;
  }

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    likePost(post.id, user!.id);
  };

  const handleDislike = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dislikePost(post.id, user!.id);
  };

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    toggleFavorite(post.id, user!.id);
  };

  const handleDelete = async () => {
    await deletePost(post.id);
    navigate("/");
  };

  const isAuthor = user && user.id === post.authorId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <header className="mb-8 text-left">
        <Link
          to={`/?category=${post.category}`}
          className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase text-gray-800 hover:bg-gray-200"
        >
          {post.category}
        </Link>
        <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
          {post.title}
        </h1>
        
        {/* Author info and date */}
        <div className="mt-4 flex items-center">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <img
              src={post.authorImage || "https://i.pravatar.cc/150?u=unknown"}
              alt={post.authorName}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-2">
            <p className="font-medium">{post.authorName}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(post.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
          
          {isAuthor && (
            <div className="ml-auto space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/edit/${post.id}`)}
              >
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </header>
      
      {/* Cover image */}
      <div className="mb-8 overflow-hidden rounded-lg">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-auto w-full object-cover"
        />
      </div>
      
      {/* Post content */}
      <div 
        className="prose prose-lg max-w-none text-left mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Interactions */}
      <div className="mt-6 border-t border-gray-100 pt-6">
        <div className="flex items-center space-x-6">
          <Button
            variant="ghost"
            onClick={handleLike}
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${isAuthenticated && isLiked(post.id, user!.id) ? "bg-red-50" : ""}`}
          >
            <ThumbsUpIcon 
              className="h-5 w-5" 
              color={isAuthenticated && isLiked(post.id, user!.id) ? "#ea384c" : "currentColor"}
              fill={isAuthenticated && isLiked(post.id, user!.id) ? "#ea384c" : "none"}
            />
            <span className="font-medium">{post.likes.length}</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleDislike}
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${isAuthenticated && isDisliked(post.id, user!.id) ? "bg-gray-100" : ""}`}
          >
            <ThumbsDownIcon 
              className="h-5 w-5"
              color={isAuthenticated && isDisliked(post.id, user!.id) ? "#000000" : "currentColor"}
              fill={isAuthenticated && isDisliked(post.id, user!.id) ? "#000000" : "none"}
            />
            <span className="font-medium">{post.dislikes.length}</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleFavorite}
            className={`flex items-center gap-2 rounded-full px-4 py-2 ${isAuthenticated && isFavorite(post.id, user!.id) ? "bg-gray-100" : ""}`}
          >
            <BookmarkIcon 
              className="h-5 w-5"
              color={isAuthenticated && isFavorite(post.id, user!.id) ? "#000000" : "currentColor"}
              fill={isAuthenticated && isFavorite(post.id, user!.id) ? "#000000" : "none"}
            />
            <span className="font-medium">{post.favorites.length}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
