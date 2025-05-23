
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card, CardContent } from "@/components/ui/card";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { createPost, categories } = useBlog();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !excerpt || !content || !coverImage || !category || !user) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await createPost({
        title,
        excerpt,
        content,
        coverImage,
        category: category as Category,
        authorId: user.id,
        authorName: user.name,
        authorImage: user.profilePicture,
      });
      
      toast({
        title: "Success",
        description: "Your post has been published"
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Create New Post</h1>
      
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter a captivating title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-lg"
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
              <Label htmlFor="excerpt">Short Description</Label>
              <Textarea
                id="excerpt"
                placeholder="Write a brief summary of your post (this will appear on the home page)"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                className="resize-none h-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image</Label>
              <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-md bg-gray-50">
                {coverImage ? (
                  <div className="relative w-full">
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-md mb-2"
                    />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setCoverImage(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a cover image for your post
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required={!coverImage}
                    />
                    <Button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <div className="text-sm text-muted-foreground mb-2">
                Write your post content here. You can format text and add images.
              </div>
              <RichTextEditor onChange={setContent} />
            </div>
            
            <div className="flex justify-center pt-4 space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Publishing..." : "Publish Post"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
