import { Label } from "../../../components/ui/label"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"

export default function StylingPanel({ config, onChange, type }) {
  if (!config) return null
  
  const updateLayoutStyling = (field, value) => {
    onChange({
      ...config,
      styling: {
        ...config.styling,
        layout: {
          ...config.styling.layout,
          [field]: value
        }
      }
    })
  }
  
  const updateColorStyling = (field, value) => {
    onChange({
      ...config,
      styling: {
        ...config.styling,
        colors: {
          ...config.styling.colors,
          [field]: value
        }
      }
    })
  }
  
  const updateTypographyStyling = (field, value) => {
    onChange({
      ...config,
      styling: {
        ...config.styling,
        typography: {
          ...config.styling.typography,
          [field]: value
        }
      }
    })
  }
  
  const updateEffectsStyling = (field, value) => {
    onChange({
      ...config,
      styling: {
        ...config.styling,
        effects: {
          ...config.styling.effects,
          [field]: value
        }
      }
    })
  }
  
  return (
    <div className="space-y-4">
      {/* Layout */}
      <div className="space-y-3">
        <h5 className="font-medium text-xs text-muted-foreground uppercase">Layout</h5>
        
        {type === 'header' && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.styling.layout.sticky}
              onChange={(e) => updateLayoutStyling('sticky', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Sticky Header</span>
          </label>
        )}
        
        <div>
          <Label className="text-xs">Max Width</Label>
          <Select 
            value={config.styling.layout.maxWidth} 
            onValueChange={(value) => updateLayoutStyling('maxWidth', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full">Full Width</SelectItem>
              <SelectItem value="container">Container (1200px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Colors */}
      <div className="space-y-3">
        <h5 className="font-medium text-xs text-muted-foreground uppercase">Colors</h5>
        
        <div>
          <Label className="text-xs">Background</Label>
          <Input
            value={config.styling.colors.background}
            onChange={(e) => updateColorStyling('background', e.target.value)}
            placeholder="bg-card"
            className="h-8 text-xs font-mono"
          />
        </div>
        
        <div>
          <Label className="text-xs">Text Color</Label>
          <Input
            value={config.styling.colors.text}
            onChange={(e) => updateColorStyling('text', e.target.value)}
            placeholder="text-foreground"
            className="h-8 text-xs font-mono"
          />
        </div>
        
        <div>
          <Label className="text-xs">Border Color</Label>
          <Input
            value={config.styling.colors.border}
            onChange={(e) => updateColorStyling('border', e.target.value)}
            placeholder="border-border"
            className="h-8 text-xs font-mono"
          />
        </div>
      </div>
      
      {/* Typography */}
      <div className="space-y-3">
        <h5 className="font-medium text-xs text-muted-foreground uppercase">Typography</h5>
        
        <div>
          <Label className="text-xs">{type === 'header' ? 'Logo Font' : 'Heading Font'}</Label>
          <Input
            value={type === 'header' ? config.styling.typography.logoFont : config.styling.typography.headingFont}
            onChange={(e) => updateTypographyStyling(type === 'header' ? 'logoFont' : 'headingFont', e.target.value)}
            placeholder="font-bold"
            className="h-8 text-xs font-mono"
          />
        </div>
        
        <div>
          <Label className="text-xs">{type === 'header' ? 'Logo Size' : 'Heading Size'}</Label>
          <Input
            value={type === 'header' ? config.styling.typography.logoSize : config.styling.typography.headingSize}
            onChange={(e) => updateTypographyStyling(type === 'header' ? 'logoSize' : 'headingSize', e.target.value)}
            placeholder="text-xl"
            className="h-8 text-xs font-mono"
          />
        </div>
      </div>
      
      {/* Effects */}
      <div className="space-y-3">
        <h5 className="font-medium text-xs text-muted-foreground uppercase">Effects</h5>
        
        <div>
          <Label className="text-xs">Shadow</Label>
          <Select 
            value={config.styling.effects.shadow} 
            onValueChange={(value) => updateEffectsStyling('shadow', value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="shadow-sm">Small</SelectItem>
              <SelectItem value="shadow">Medium</SelectItem>
              <SelectItem value="shadow-lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {type === 'footer' && config.styling.effects && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={config.styling.effects.borderTop}
              onChange={(e) => updateEffectsStyling('borderTop', e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm">Show Top Border</span>
          </label>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mt-4">
        Use Tailwind CSS classes for styling. Changes apply immediately on save.
      </p>
    </div>
  )
}
