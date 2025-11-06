export default function PreviewPanel({ config, type, device }) {
  if (!config) return null
  
  const deviceClass = {
    desktop: 'w-full',
    tablet: 'max-w-3xl mx-auto',
    mobile: 'max-w-sm mx-auto'
  }[device]
  
  return (
    <div className="bg-muted p-6 rounded-lg">
      <div className={`${deviceClass} bg-background border border-border rounded-lg shadow-lg overflow-hidden`}>
        {type === 'header' ? (
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xl">
                {config.content.logo.type === 'text' ? config.content.logo.text : 'Logo'}
              </div>
              <div className="flex items-center gap-4">
                {config.content.navigation.slice(0, 3).map((item) => (
                  <span key={item.id} className="text-sm font-medium">{item.label}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {config.content.brand.enabled && (
                <div>
                  <h3 className="font-bold mb-2">{config.content.brand.text}</h3>
                  <p className="text-sm text-muted-foreground">{config.content.brand.description}</p>
                </div>
              )}
              {config.content.sections.slice(0, 3).map((section) => (
                <div key={section.id}>
                  <h4 className="font-semibold mb-3 text-sm">{section.title}</h4>
                  <div className="space-y-2">
                    {section.links.slice(0, 4).map((link) => (
                      <div key={link.id} className="text-sm text-muted-foreground">{link.label}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {config.content.copyright.enabled && (
              <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
                {config.content.copyright.text.replace('{year}', new Date().getFullYear())}
              </div>
            )}
          </div>
        )}
      </div>
      
      <p className="text-center text-sm text-muted-foreground mt-4">
        Preview Mode - This is a simplified representation
      </p>
    </div>
  )
}
