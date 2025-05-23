
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BlogCard from "@/components/BlogCard";
import CategoryFilter from "@/components/CategoryFilter";
import { useBlog, Category } from "@/contexts/BlogContext";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getPosts } = useBlog();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Extract category from URL query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category") as Category | null;
    setSelectedCategory(categoryParam);
  }, [location.search]);

  // Update URL when category changes
  const handleCategoryChange = (category: Category | null) => {
    setSelectedCategory(category);
    if (category) {
      navigate(`/?category=${category}`);
    } else {
      navigate("/");
    }
  };

  const posts = getPosts(selectedCategory || undefined);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-left text-3xl font-bold md:text-4xl">
        {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Articles` : "Latest Articles"}
      </h1>
      
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onChange={handleCategoryChange}
      />

      {posts.length === 0 ? (
        <div className="mt-16 text-left">
          <p className="text-lg text-gray-600">No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;
