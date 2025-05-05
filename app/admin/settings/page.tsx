"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Bell, Globe, Lock, Save, User } from "lucide-react"

export default function SettingsPage() {
  const [settingsTab, setSettingsTab] = useState("profile")
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")

  // Profile settings
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@attendly.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    bio: "School administrator responsible for managing the Attendly system.",
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    activitySummary: true,
    attendanceAlerts: true,
    systemUpdates: false,
  })

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    academicYear: "2024-2025",
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSystemChange = (name: string, value: string) => {
    setSystemSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (name: string, value: string | boolean) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = () => {
    setSaveStatus("saving")

    // Simulate API call
    setTimeout(() => {
      setSaveStatus("success")

      // Reset status after 3 seconds
      setTimeout(() => {
        setSaveStatus("idle")
      }, 3000)
    }, 1000)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and system preferences.</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={saveStatus === "saving"}>
          <Save className="mr-2 h-4 w-4" />
          {saveStatus === "saving" ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {saveStatus === "success" && (
        <Alert className="bg-emerald-50 border-emerald-200">
          <AlertCircle className="h-4 w-4 text-emerald-600" />
          <AlertTitle className="text-emerald-600">Settings Saved</AlertTitle>
          <AlertDescription className="text-emerald-700">Your settings have been successfully saved.</AlertDescription>
        </Alert>
      )}

      {saveStatus === "error" && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-600">Error</AlertTitle>
          <AlertDescription className="text-red-700">
            There was an error saving your settings. Please try again.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-4" onValueChange={setSettingsTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="profile" className="rounded-md">
            <User className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-md">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-md">
            <Globe className="mr-2 h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-md">
            <Lock className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your personal information and profile details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Admin" />
                    <AvatarFallback className="text-2xl">AD</AvatarFallback>
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
              <CardTitle>Notification Settings</CardTitle>
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

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide preferences and options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={systemSettings.language}
                    onValueChange={(value) => handleSystemChange("language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={systemSettings.timezone}
                    onValueChange={(value) => handleSystemChange("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={systemSettings.dateFormat}
                    onValueChange={(value) => handleSystemChange("dateFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <Select
                    value={systemSettings.timeFormat}
                    onValueChange={(value) => handleSystemChange("timeFormat", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select
                    value={systemSettings.academicYear}
                    onValueChange={(value) => handleSystemChange("academicYear", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and privacy preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => handleSecurityChange("sessionTimeout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select
                    value={securitySettings.passwordExpiry}
                    onValueChange={(value) => handleSecurityChange("passwordExpiry", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
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
