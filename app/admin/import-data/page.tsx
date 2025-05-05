"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Download, FileSpreadsheet, FileText, HelpCircle, Upload, X } from "lucide-react"

export default function ImportDataPage() {
  const [importType, setImportType] = useState("students")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setUploadStatus("idle")
      setErrorMessage("")
    }
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadStatus("success")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleCancel = () => {
    setFile(null)
    setIsUploading(false)
    setUploadProgress(0)
    setUploadStatus("idle")
    setErrorMessage("")
  }

  const downloadTemplate = () => {
    // In a real app, this would download a template file
    console.log(`Downloading ${importType} template`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Import Data</h1>
          <p className="text-muted-foreground">Import student, guide, class, and activity data from CSV files.</p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Download Templates
        </Button>
      </div>

      <Tabs defaultValue="students" className="space-y-4" onValueChange={setImportType}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="students" className="rounded-md">
            Students
          </TabsTrigger>
          <TabsTrigger value="guides" className="rounded-md">
            Guides
          </TabsTrigger>
          <TabsTrigger value="classes" className="rounded-md">
            Classes
          </TabsTrigger>
          <TabsTrigger value="activities" className="rounded-md">
            Activities
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>Import {importType.charAt(0).toUpperCase() + importType.slice(1)}</CardTitle>
            <CardDescription>
              Upload a CSV file containing {importType} data. Make sure to follow the template format.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Upload CSV File</Label>
                <div className="flex items-center gap-2">
                  <Input id="file" type="file" accept=".csv" onChange={handleFileChange} className="flex-1" />
                  {file && !isUploading && (
                    <Button variant="outline" size="icon" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {file && (
                  <p className="text-xs text-muted-foreground">
                    Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>

              {importType === "students" && (
                <div className="grid gap-2">
                  <Label htmlFor="class">Assign to Class (Optional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5a">Class 5A</SelectItem>
                      <SelectItem value="4b">Class 4B</SelectItem>
                      <SelectItem value="3c">Class 3C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {importType === "guides" && (
                <div className="grid gap-2">
                  <Label htmlFor="sendInvite">Send Email Invites</Label>
                  <Select defaultValue="yes">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, send email invites</SelectItem>
                      <SelectItem value="no">No, I'll invite them later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {file && isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {uploadStatus === "success" && (
                <Alert className="bg-emerald-50 border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <AlertTitle className="text-emerald-600">Upload Successful</AlertTitle>
                  <AlertDescription className="text-emerald-700">
                    Your {importType} data has been successfully uploaded and processed.
                  </AlertDescription>
                </Alert>
              )}

              {uploadStatus === "error" && (
                <Alert className="bg-red-50 border-red-200">
                  <X className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-600">Upload Failed</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {errorMessage ||
                      `There was an error processing your ${importType} data. Please check the file format and try again.`}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={isUploading || !file}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={isUploading || !file}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload and Process
                </Button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Import Instructions</h3>
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Prepare your CSV file</p>
                    <p className="text-sm text-muted-foreground">
                      Download our template and fill it with your {importType} data. Make sure to follow the required
                      format.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Upload your file</p>
                    <p className="text-sm text-muted-foreground">
                      Select your CSV file and click the "Upload and Process" button.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Review and confirm</p>
                    <p className="text-sm text-muted-foreground">
                      After processing, review the imported data and confirm that everything is correct.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Need help?</p>
                    <p className="text-sm text-muted-foreground">
                      If you encounter any issues, please contact our support team for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
