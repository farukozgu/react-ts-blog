
import { Link } from "react-router-dom";
import { BlogPost } from "@/contexts/BlogContext";
import { format } from "date-fns";
import { 
  ThumbsUp, 
  ThumbsDown, 
  Bookmark 
} from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg">
      <Link to={`/post/${post.id}`} className="block h-48 w-full overflow-hidden">
        <img
          src={post.coverImage}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="text-left">
          <Link to={`/?category=${post.category}`}>
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium uppercase text-gray-800 mb-3">
              {post.category}
            </span>
          </Link>
          <Link to={`/post/${post.id}`} className="block">
            <h3 className="text-xl font-semibold leading-tight text-gray-900 hover:text-gray-600">
              {post.title}
            </h3>
            <p className="mt-3 line-clamp-3 text-gray-600">
              {post.excerpt}
            </p>
          </Link>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 overflow-hidden rounded-full">
                <img
                  src={post.authorImage || "https://i.pravatar.cc/150?u=unknown"}
                  alt={post.authorName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">{post.authorName}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(post.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center space-x-4 border-t pt-3">
            <button className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-xs">{post.likes.length}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-destructive transition-colors">
              <ThumbsDown className="h-4 w-4" />
              <span className="text-xs">{post.dislikes.length}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-primary transition-colors ml-auto">
              <Bookmark className="h-4 w-4" />
              <span className="text-xs">{post.favorites.length}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
