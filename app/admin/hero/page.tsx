"use client";

import { SingleImageUpload } from "@/components/admin/single-image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface HeroSettings {
  id: string;
  title: string;
  subtitle: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  backgroundImage: string | null;
  isActive: boolean;
}

export default function HeroSettingsPage() {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    primaryBtnText: "",
    primaryBtnLink: "",
    secondaryBtnText: "",
    secondaryBtnLink: "",
    backgroundImage: "",
  });

  useEffect(() => {
    fetchHeroSettings();
  }, []);

  const fetchHeroSettings = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getHeroSettings();
      const data = response.data;
      setSettings(data);
      setFormData({
        title: data.title,
        subtitle: data.subtitle,
        primaryBtnText: data.primaryBtnText,
        primaryBtnLink: data.primaryBtnLink,
        secondaryBtnText: data.secondaryBtnText,
        secondaryBtnLink: data.secondaryBtnLink,
        backgroundImage: data.backgroundImage || "",
      });
    } catch (error: any) {
      console.error("Error fetching hero settings:", error);
      toast.error(error.message || "Failed to fetch hero settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setIsSaving(true);
      console.log("Updating hero settings with ID:", settings.id);
      console.log("Form data:", formData);
      const response = await apiClient.updateHeroSettings(
        settings.id,
        formData
      );
      console.log("Update response:", response);
      toast.success("Hero settings updated successfully");
      fetchHeroSettings();
    } catch (error: any) {
      console.error("Error updating hero settings:", error);
      console.error("Error message:", error.message);
      console.error("Full error:", JSON.stringify(error, null, 2));
      toast.error(error.message || "Failed to update hero settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (url: string) => {
    setFormData({
      ...formData,
      backgroundImage: url,
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hero Settings</h1>
        <p className="text-muted-foreground">
          Customize the hero banner on your homepage
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Hero Banner Content</CardTitle>
            <CardDescription>
              Update the text, buttons, and background image for your hero
              section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter hero title"
                required
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Enter hero subtitle"
                rows={3}
                required
              />
            </div>

            {/* Primary Button */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primaryBtnText">Primary Button Text</Label>
                <Input
                  id="primaryBtnText"
                  name="primaryBtnText"
                  value={formData.primaryBtnText}
                  onChange={handleChange}
                  placeholder="e.g., Shop Now"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primaryBtnLink">Primary Button Link</Label>
                <Input
                  id="primaryBtnLink"
                  name="primaryBtnLink"
                  value={formData.primaryBtnLink}
                  onChange={handleChange}
                  placeholder="e.g., /products"
                  required
                />
              </div>
            </div>

            {/* Secondary Button */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="secondaryBtnText">Secondary Button Text</Label>
                <Input
                  id="secondaryBtnText"
                  name="secondaryBtnText"
                  value={formData.secondaryBtnText}
                  onChange={handleChange}
                  placeholder="e.g., Learn More"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryBtnLink">Secondary Button Link</Label>
                <Input
                  id="secondaryBtnLink"
                  name="secondaryBtnLink"
                  value={formData.secondaryBtnLink}
                  onChange={handleChange}
                  placeholder="e.g., /about"
                  required
                />
              </div>
            </div>

            {/* Background Image */}
            <div className="space-y-2">
              <Label>Background Image (Optional)</Label>
              <SingleImageUpload
                onUploadSuccess={handleImageUpload}
                currentImage={formData.backgroundImage || undefined}
                onRemove={() =>
                  setFormData({ ...formData, backgroundImage: "" })
                }
              />
              <p className="text-sm text-muted-foreground">
                Upload a background image for the hero section. Leave empty for
                gradient background.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
