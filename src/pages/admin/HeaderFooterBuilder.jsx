import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  GripVertical, 
  Image as ImageIcon, 
  Type, 
  Link as LinkIcon,
  Settings,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { toast } from "sonner"
import {
  createDefaultHeaderConfig,
  createDefaultFooterConfig,
  fetchActiveHeaderConfig,
  fetchActiveFooterConfig,
  saveHeaderConfig,
  saveFooterConfig,
  createRevision,
  initializeDefaultSitePages,
  fetchSitePages
} from "../../lib/headerFooterUtils"
import HeaderContentEditor from "./builder/HeaderContentEditor"
import FooterContentEditor from "./builder/FooterContentEditor"
import StylingPanel from "./builder/StylingPanel"
import DisplayRulesPanel from "./builder/DisplayRulesPanel"
import PreviewPanel from "./builder/PreviewPanel"

export default function HeaderFooterBuilder() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState("header")
  const [viewMode, setViewMode] = useState("edit") // 'edit' or 'preview'
  const [devicePreview, setDevicePreview] = useState("desktop") // 'desktop', 'tablet', 'mobile'
  
  // Header state
  const [headerConfig, setHeaderConfig] = useState(null)
  const [headerLoading, setHeaderLoading] = useState(true)
  
  // Footer state
  const [footerConfig, setFooterConfig] = useState(null)
  const [footerLoading, setFooterLoading] = useState(true)
  
  // Site pages for link picker
  const [sitePages, setSitePages] = useState([])
  
  // Save state
  const [saving, setSaving] = useState(false)
  
  useEffect(() => {
    loadConfigurations()
    loadSitePages()
  }, [])
  
  const loadConfigurations = async () => {
    try {
      // Load header config
      setHeaderLoading(true)
      let header = await fetchActiveHeaderConfig()
      if (!header && currentUser) {
        // Create default header if none exists
        header = createDefaultHeaderConfig(currentUser.uid)
        await saveHeaderConfig(header)
      }
      setHeaderConfig(header)
      setHeaderLoading(false)
      
      // Load footer config
      setFooterLoading(true)
      let footer = await fetchActiveFooterConfig()
      if (!footer && currentUser) {
        // Create default footer if none exists
        footer = createDefaultFooterConfig(currentUser.uid)
        await saveFooterConfig(footer)
      }
      setFooterConfig(footer)
      setFooterLoading(false)
    } catch (error) {
      console.error("Error loading configurations:", error)
      toast.error("Failed to load configurations")
      setHeaderLoading(false)
      setFooterLoading(false)
    }
  }
  
  const loadSitePages = async () => {
    try {
      // Initialize default pages if needed
      await initializeDefaultSitePages()
      
      // Fetch all pages
      const pages = await fetchSitePages()
      setSitePages(pages)
    } catch (error) {
      console.error("Error loading site pages:", error)
    }
  }
  
  const handleSaveHeader = async (createNewRevision = false) => {
    if (!headerConfig || !currentUser) return
    
    setSaving(true)
    try {
      // Create revision if requested
      if (createNewRevision) {
        await createRevision("header", headerConfig.id, headerConfig, currentUser.uid, "Manual save")
      }
      
      // Save configuration
      const result = await saveHeaderConfig({
        ...headerConfig,
        updatedBy: currentUser.uid
      })
      
      if (result.success) {
        toast.success("Header configuration saved successfully")
      } else {
        toast.error(result.error || "Failed to save header configuration")
      }
    } catch (error) {
      console.error("Error saving header:", error)
      toast.error("Failed to save header configuration")
    } finally {
      setSaving(false)
    }
  }
  
  const handleSaveFooter = async (createNewRevision = false) => {
    if (!footerConfig || !currentUser) return
    
    setSaving(true)
    try {
      // Create revision if requested
      if (createNewRevision) {
        await createRevision("footer", footerConfig.id, footerConfig, currentUser.uid, "Manual save")
      }
      
      // Save configuration
      const result = await saveFooterConfig({
        ...footerConfig,
        updatedBy: currentUser.uid
      })
      
      if (result.success) {
        toast.success("Footer configuration saved successfully")
      } else {
        toast.error(result.error || "Failed to save footer configuration")
      }
    } catch (error) {
      console.error("Error saving footer:", error)
      toast.error("Failed to save footer configuration")
    } finally {
      setSaving(false)
    }
  }
  
  const handlePublishHeader = async () => {
    if (!headerConfig || !currentUser) return
    
    setSaving(true)
    try {
      const updatedConfig = {
        ...headerConfig,
        isPublished: true,
        updatedBy: currentUser.uid
      }
      
      // Create revision before publishing
      await createRevision("header", headerConfig.id, updatedConfig, currentUser.uid, "Published")
      
      // Save as published
      const result = await saveHeaderConfig(updatedConfig)
      
      if (result.success) {
        setHeaderConfig(updatedConfig)
        toast.success("Header published successfully")
      } else {
        toast.error(result.error || "Failed to publish header")
      }
    } catch (error) {
      console.error("Error publishing header:", error)
      toast.error("Failed to publish header")
    } finally {
      setSaving(false)
    }
  }
  
  const handlePublishFooter = async () => {
    if (!footerConfig || !currentUser) return
    
    setSaving(true)
    try {
      const updatedConfig = {
        ...footerConfig,
        isPublished: true,
        updatedBy: currentUser.uid
      }
      
      // Create revision before publishing
      await createRevision("footer", footerConfig.id, updatedConfig, currentUser.uid, "Published")
      
      // Save as published
      const result = await saveFooterConfig(updatedConfig)
      
      if (result.success) {
        setFooterConfig(updatedConfig)
        toast.success("Footer published successfully")
      } else {
        toast.error(result.error || "Failed to publish footer")
      }
    } catch (error) {
      console.error("Error publishing footer:", error)
      toast.error("Failed to publish footer")
    } finally {
      setSaving(false)
    }
  }
  
  if (headerLoading || footerLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Header & Footer Builder</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your site's header and footer without coding
          </p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "edit" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("edit")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant={viewMode === "preview" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("preview")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>
      
      {/* Device Preview Selector (shown in preview mode) */}
      {viewMode === "preview" && (
        <div className="flex items-center gap-2 p-4 bg-card border border-border rounded-lg">
          <span className="text-sm text-muted-foreground">Preview on:</span>
          <Button
            variant={devicePreview === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setDevicePreview("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={devicePreview === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setDevicePreview("tablet")}
          >
            <Tablet className="w-4 h-4" />
          </Button>
          <Button
            variant={devicePreview === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setDevicePreview("mobile")}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>
        
        {/* Header Tab */}
        <TabsContent value="header" className="space-y-4">
          {viewMode === "edit" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Content Editor - 2 columns */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Content</h3>
                  <HeaderContentEditor 
                    config={headerConfig}
                    onChange={setHeaderConfig}
                    sitePages={sitePages}
                  />
                </div>
              </div>
              
              {/* Sidebar - 1 column */}
              <div className="space-y-4">
                {/* Styling Panel */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Styling</h3>
                  <StylingPanel 
                    config={headerConfig}
                    onChange={setHeaderConfig}
                    type="header"
                  />
                </div>
                
                {/* Display Rules Panel */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Display Rules</h3>
                  <DisplayRulesPanel 
                    config={headerConfig}
                    onChange={setHeaderConfig}
                    sitePages={sitePages}
                  />
                </div>
                
                {/* Actions */}
                <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                  <Button 
                    onClick={() => handleSaveHeader(true)}
                    disabled={saving}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    onClick={handlePublishHeader}
                    disabled={saving}
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <PreviewPanel 
              config={headerConfig}
              type="header"
              device={devicePreview}
            />
          )}
        </TabsContent>
        
        {/* Footer Tab */}
        <TabsContent value="footer" className="space-y-4">
          {viewMode === "edit" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Content Editor - 2 columns */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Content</h3>
                  <FooterContentEditor 
                    config={footerConfig}
                    onChange={setFooterConfig}
                    sitePages={sitePages}
                  />
                </div>
              </div>
              
              {/* Sidebar - 1 column */}
              <div className="space-y-4">
                {/* Styling Panel */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Styling</h3>
                  <StylingPanel 
                    config={footerConfig}
                    onChange={setFooterConfig}
                    type="footer"
                  />
                </div>
                
                {/* Display Rules Panel */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Display Rules</h3>
                  <DisplayRulesPanel 
                    config={footerConfig}
                    onChange={setFooterConfig}
                    sitePages={sitePages}
                  />
                </div>
                
                {/* Actions */}
                <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                  <Button 
                    onClick={() => handleSaveFooter(true)}
                    disabled={saving}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button 
                    onClick={handlePublishFooter}
                    disabled={saving}
                    variant="default"
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <PreviewPanel 
              config={footerConfig}
              type="footer"
              device={devicePreview}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
