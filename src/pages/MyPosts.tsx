
import { useState } from "react";
import { useBlog } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Category } from "@/contexts/BlogContext";

const MyPosts = () => {
  const { user } = useAuth();
  const { userPosts, deletePost } = useBlog();
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  const posts = userPosts(user.id);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deletePost(id);
    } finally {
      setIsDeleting(null);
    }
  };

  const getCategoryLabel = (category: Category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold md:text-3xl">My Posts</h1>
        <Button onClick={() => navigate("/create")}>Create New Post</Button>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center">
          <h2 className="text-xl font-medium">You haven't written any posts yet</h2>
          <p className="mt-2 text-gray-600">
            Start sharing your thoughts with the world!
          </p>
          <Button className="mt-4" onClick={() => navigate("/create")}>
            Create Your First Post
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Stats
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div
                          className="cursor-pointer font-medium text-gray-900 hover:text-blue-600"
                          onClick={() => navigate(`/post/${post.id}`)}
                        >
                          {post.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium">
                      {getCategoryLabel(post.category)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <div>{post.likes.length} likes</div>
                      <div>{post.favorites.length} favorites</div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/edit/${post.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(post.id)}
                        disabled={isDeleting === post.id}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        {isDeleting === post.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPosts;
