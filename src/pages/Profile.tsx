
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || "");
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || "");
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await updateProfile({
        name,
        profilePicture,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold md:text-3xl">Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profilePicture || "https://i.pravatar.cc/150?u=unknown"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm text-gray-500">{user.email}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button variant="outline" className="w-full" onClick={() => navigate("/my-posts")}>
                  My Posts
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/favorites")}>
                  Favorited Posts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  {profilePicture && (
                    <div className="mt-2 h-20 w-20 overflow-hidden rounded-full">
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/150?text=Invalid+URL";
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <Button type="submit" disabled={saving || isLoading}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
