
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog, Category } from "@/contexts/BlogContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import RichTextEditor from "@/components/RichTextEditor";

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPost, updatePost, categories } = useBlog();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState(getPost(id || ""));

  useEffect(() => {
    if (!id) {
      navigate("/not-found");
      return;
    }
    
    const foundPost = getPost(id);
    
    if (!foundPost) {
      navigate("/not-found");
      return;
    }
    
    if (user?.id !== foundPost.authorId) {
      toast({
        title: "Unauthorized",
        description: "You can only edit your own posts",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    setPost(foundPost);
    setTitle(foundPost.title);
    setExcerpt(foundPost.excerpt);
    setContent(foundPost.content);
    setCoverImage(foundPost.coverImage);
    setCategory(foundPost.category);
  }, [id, getPost, navigate, user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!post || !title || !excerpt || !content || !coverImage || !category) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updatePost(post.id, {
        title,
        excerpt,
        content,
        coverImage,
        category: category as Category,
      });
      
      toast({
        title: "Success",
        description: "Your post has been updated"
      });
      navigate(`/post/${post.id}`);
    } catch (error) {
      console.error("Failed to update post:", error);
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) {
    return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">Edit Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt (short description)</Label>
          <Textarea
            id="excerpt"
            placeholder="Enter a short description of your post"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as Category)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input
            id="coverImage"
            placeholder="https://example.com/image.jpg"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            required
          />
          {coverImage && (
            <div className="mt-2 h-40 overflow-hidden rounded-md border">
              <img
                src={coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/640x360?text=Invalid+Image+URL";
                }}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <div className="text-sm text-muted-foreground mb-2">
            You can add images within your post by clicking the image icon in the toolbar
          </div>
          <RichTextEditor initialValue={content} onChange={setContent} />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(`/post/${post.id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
