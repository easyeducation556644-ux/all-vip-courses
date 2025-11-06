import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Mail, Phone, Send, Youtube, MessageCircle } from "lucide-react"
import { fetchActiveFooterConfig } from "../lib/headerFooterUtils"
import { useAuth } from "../contexts/AuthContext"
import Footer from "./Footer"

const iconMap = {
  Mail,
  Phone,
  Send,
  Youtube,
  MessageCircle
}

export default function DynamicFooter() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const { currentUser, isAdmin } = useAuth()
  const location = useLocation()
  
  useEffect(() => {
    loadFooterConfig()
  }, [location.pathname, currentUser])
  
  const loadFooterConfig = async () => {
    try {
      const userRole = currentUser ? (isAdmin ? 'admin' : 'user') : 'guest'
      const deviceType = window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile'
      
      const footerConfig = await fetchActiveFooterConfig(location.pathname, userRole, deviceType)
      
      if (footerConfig) {
        setConfig(footerConfig)
      }
    } catch (error) {
      console.error("Error loading footer config:", error)
    } finally {
      setLoading(false)
    }
  }
  
  // Fallback to original Footer if no config or still loading
  if (loading || !config) {
    return <Footer />
  }
  
  const { content } = config
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          {content?.brand?.enabled && (
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">
                {content.brand.text}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {content.brand.description}
              </p>
            </div>
          )}
          
          {/* Footer Sections */}
          {content?.sections?.map((section) => (
            <div key={section.id}>
              <h4 className="font-semibold mb-4 text-foreground">
                {section.title}
              </h4>
              <div className="flex flex-col gap-3">
                {section.links?.filter(link => link.isVisible !== false).map((link) => {
                  const IconComponent = link.icon ? iconMap[link.icon] : null
                  
                  if (link.type === 'email') {
                    return (
                      <a
                        key={link.id}
                        href={`mailto:${link.value}`}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                        <span className="break-all">{link.label || link.value}</span>
                      </a>
                    )
                  }
                  
                  if (link.type === 'phone') {
                    return (
                      <a
                        key={link.id}
                        href={`tel:${link.value}`}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
                        {link.label || link.value}
                      </a>
                    )
                  }
                  
                  if (link.type === 'external') {
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target={link.openInNewTab ? "_blank" : undefined}
                        rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    )
                  }
                  
                  return (
                    <Link
                      key={link.id}
                      to={link.url}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
          
          {/* Social Links */}
          {content?.socialLinks?.enabled && content?.socialLinks?.links?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-4 text-foreground">
                {content.socialLinks.title}
              </h4>
              <div className="flex gap-3">
                {content.socialLinks.links.filter(link => link.isVisible).map((link) => {
                  const IconComponent = iconMap[link.icon] || Send
                  
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-muted hover:bg-primary/20 rounded-lg transition-colors text-muted-foreground hover:text-primary"
                      aria-label={link.platform}
                    >
                      <IconComponent className="w-5 h-5" />
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Copyright Section */}
        {content?.copyright?.enabled && (
          <div className="mt-10 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            {content.copyright.text.replace('{year}', currentYear)}
          </div>
        )}
        
        {/* Developer Credit */}
        <div className={`${content?.copyright?.enabled ? 'mt-6' : 'mt-10 pt-8 border-t border-border/50'}`}>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Developed by{" "}
              <a 
                href="https://t.me/hermanoMayorBot" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Hermano Mayor
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
