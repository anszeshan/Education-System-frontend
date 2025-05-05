"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Bell, Lock, Save, User } from "lucide-react"

export default function GuideProfilePage() {
  const [profileTab, setProfileTab] = useState("personal")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "guide", // Fixed as "guide" for guides
    bio: "",
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    activitySummary: true,
    attendanceAlerts: true,
    systemUpdates: false,
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://education-system-backend-gray.vercel.app/api/users/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
        
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: "guide", // Force role to "guide" for consistency
          bio: data.bio || "",
        });
        setNotificationSettings(data.notificationSettings || {
          emailNotifications: true,
          activitySummary: true,
          attendanceAlerts: true,
          systemUpdates: false,
        });
      } catch (err: any) {
        setErrorMessage(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecuritySettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaveStatus("saving");
    setErrorMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/users/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          notificationSettings,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update profile");

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      setSaveStatus("error");
      setErrorMessage(err.message);
    }
  };

  const handleChangePassword = async () => {
    setSaveStatus("saving");
    setErrorMessage(null);

    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      setSaveStatus("error");
      setErrorMessage("New password and confirm password do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://education-system-backend-gray.vercel.app/api/users/change-password", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: securitySettings.currentPassword,
          newPassword: securitySettings.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to change password");

      setSaveStatus("success");
      setSecuritySettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err: any) {
      setSaveStatus("error");
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="p-6 space-y-6 md:ml-64 ml-0"> {/* Adjusted alignment for guide-side */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences as a guide.</p>
        </div>
        {profileTab !== "security" && (
          <Button onClick={handleSaveProfile} disabled={saveStatus === "saving"}>
            <Save className="mr-2 h-4 w-4" />
            {saveStatus === "saving" ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      {saveStatus === "success" && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <AlertCircle className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-600">Changes Saved</AlertTitle>
          <AlertDescription className="text-emerald-700">
            Your profile has been successfully updated.
          </AlertDescription>
        </Alert>
      )}

      {saveStatus === "error" && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Error</AlertTitle>
          <AlertDescription className="text-red-700">
            {errorMessage || "There was an error saving your changes. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="personal" className="space-y-4" onValueChange={setProfileTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="personal" className="rounded-md">
            <User className="mr-2 h-4 w-4" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-md">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-md">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Guide" />
                    <AvatarFallback className="text-2xl">
                      {profileData.name ? profileData.name.charAt(0).toUpperCase() : "G"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>
                <div className="flex-1 grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={profileData.phone} onChange={handleProfileChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" value={profileData.role} onChange={handleProfileChange} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleProfileChange} rows={4} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="activitySummary">Activity Summary</Label>
                    <p className="text-sm text-muted-foreground">Receive daily activity summary reports</p>
                  </div>
                  <Switch
                    id="activitySummary"
                    checked={notificationSettings.activitySummary}
                    onCheckedChange={(checked) => handleNotificationChange("activitySummary", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="attendanceAlerts">Attendance Alerts</Label>
                    <p className="text-sm text-muted-foreground">Receive alerts for low attendance rates</p>
                  </div>
                  <Switch
                    id="attendanceAlerts"
                    checked={notificationSettings.attendanceAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("attendanceAlerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemUpdates">System Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about system updates and maintenance
                    </p>
                  </div>
                  <Switch
                    id="systemUpdates"
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => handleNotificationChange("systemUpdates", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Update your password and security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={securitySettings.currentPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={securitySettings.newPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={securitySettings.confirmPassword}
                    onChange={handleSecurityChange}
                  />
                </div>
                <div className="pt-4">
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      saveStatus === "saving" ||
                      !securitySettings.currentPassword ||
                      !securitySettings.newPassword ||
                      !securitySettings.confirmPassword
                    }
                    className="w-full"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}