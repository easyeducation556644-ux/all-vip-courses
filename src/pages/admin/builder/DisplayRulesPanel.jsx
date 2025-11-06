import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

export default function DisplayRulesPanel({ config, onChange, sitePages }) {
  if (!config) return null
  
  const updatePageRules = (field, value) => {
    onChange({
      ...config,
      displayRules: {
        ...config.displayRules,
        pages: {
          ...config.displayRules.pages,
          [field]: value
        }
      }
    })
  }
  
  const updateUserRoles = (field, value) => {
    onChange({
      ...config,
      displayRules: {
        ...config.displayRules,
        userRoles: {
          ...config.displayRules.userRoles,
          [field]: value
        }
      }
    })
  }
  
  const updateDeviceRules = (field, value) => {
    onChange({
      ...config,
      displayRules: {
        ...config.displayRules,
        devices: {
          ...config.displayRules.devices,
          [field]: value
        }
      }
    })
  }
  
  return (
    <div className="space-y-4">
      {/* Page Rules */}
      <div className="space-y-3">
        <h5 className="font-medium text-xs text-muted-foreground uppercase">Page Rules</h5>
        
        <div>
          <Label className="text-xs">Display On</Label>
          <Select 
            value={config.displayRules.pages.type} 
            onValueChange={(value) => updatePageRules('type', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pages</SelectItem>
              <SelectItem value="specific">Specific Pages Only</SelectItem>
              <SelectItem value="exclude">All Except Specific</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {config.displayRules.pages.type !== 'all' && (
          <p className="text-xs text-muted-foreground">
            Specific page selection coming soon. Currently affects all pages.
          </p>
        )}
      </div>
      
      {/* User Role Rules */}
      <div className="space-y-3">
        <h5 className="font-medium text-xs text-muted-foreground uppercase">User Roles</h5>
        
        <div>
          <Label className="text-xs">Show To</Label>
          <Select 
            value={config.displayRules.userRoles.type} 
            onValueChange={(value) => updateUserRoles('type', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="specific">Specific Roles Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Device Rules */}
      <div className="space-y-3">
        <h5 className="font-medium text-xs text-muted-foreground uppercase">Devices</h5>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.displayRules.devices.showOnDesktop}
              onChange={(e) => updateDeviceRules('showOnDesktop', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Show on Desktop</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.displayRules.devices.showOnTablet}
              onChange={(e) => updateDeviceRules('showOnTablet', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Show on Tablet</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.displayRules.devices.showOnMobile}
              onChange={(e) => updateDeviceRules('showOnMobile', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Show on Mobile</span>
          </label>
        </div>
      </div>
    </div>
  )
}
