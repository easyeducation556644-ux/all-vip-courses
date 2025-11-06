import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { Menu, X, User, LogOut, LayoutDashboard, Sun, Moon, Search } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { fetchActiveHeaderConfig } from "../lib/headerFooterUtils"
import Header from "./Header"

export default function DynamicHeader() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser, userProfile, signOut, isAdmin } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    loadHeaderConfig()
  }, [location.pathname, currentUser])
  
  const loadHeaderConfig = async () => {
    try {
      const userRole = currentUser ? (isAdmin ? 'admin' : 'user') : 'guest'
      const deviceType = window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile'
      
      const headerConfig = await fetchActiveHeaderConfig(location.pathname, userRole, deviceType)
      
      if (headerConfig) {
        setConfig(headerConfig)
      }
    } catch (error) {
      console.error("Error loading header config:", error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSignOut = async () => {
    try {
      await signOut()
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }
  
  // Fallback to original Header if no config or still loading
  if (loading || !config) {
    return <Header />
  }
  
  const { content, styling } = config
  
  return (
    <header 
      className={`${styling.colors.background} ${styling.colors.border} border-b ${styling.effects.shadow} ${styling.layout.sticky ? 'sticky top-0' : ''} z-${styling.layout.zIndex}`}
    >
      <div className={`${styling.layout.maxWidth === 'container' ? 'container' : ''} mx-auto px-${styling.layout.padding.left} py-${styling.layout.padding.top}`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={content.logo.link} className={`${styling.typography.logoFont} ${styling.typography.logoSize} ${styling.colors.text} bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
            {content.logo.type === 'text' ? content.logo.text : (
              <img src={content.logo.imageUrl} alt={content.logo.alt} className="h-8" />
            )}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {content.navigation.filter(item => item.isVisible).map((item) => (
              <Link
                key={item.id}
                to={item.url}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                className={`${styling.typography.navFont} ${styling.typography.navSize} ${styling.colors.text} ${styling.colors.hoverText} transition-colors`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {content.elements.showThemeToggle && (
              <button
                onClick={toggleTheme}
                className={`p-2 ${styling.colors.hoverBackground} rounded-lg transition-colors`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}
            
            {/* User Menu */}
            {content.elements.showUserMenu && currentUser && (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile" className={`p-2 ${styling.colors.hoverBackground} rounded-lg transition-colors`}>
                  <User className="w-5 h-5" />
                </Link>
                {isAdmin && (
                  <Link to="/admin" className={`p-2 ${styling.colors.hoverBackground} rounded-lg transition-colors`}>
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <button onClick={handleSignOut} className={`p-2 ${styling.colors.hoverBackground} rounded-lg transition-colors`}>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {!currentUser && (
              <Link
                to="/login"
                className="hidden md:block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Login
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            {content.mobileMenu.enabled && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`md:hidden p-2 ${styling.colors.hoverBackground} rounded-lg transition-colors`}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      {content.mobileMenu.enabled && sidebarOpen && (
        <motion.div
          initial={{ x: content.mobileMenu.position === 'left' ? -300 : 300 }}
          animate={{ x: 0 }}
          exit={{ x: content.mobileMenu.position === 'left' ? -300 : 300 }}
          className="md:hidden fixed inset-y-0 left-0 w-64 bg-card border-r border-border shadow-lg z-50"
        >
          <div className="p-4 space-y-4">
            {content.navigation.filter(item => item.isVisible).map((item) => (
              <Link
                key={item.id}
                to={item.url}
                onClick={() => setSidebarOpen(false)}
                className={`block ${styling.typography.navFont} ${styling.typography.navSize} ${styling.colors.text} ${styling.colors.hoverText} transition-colors p-2`}
              >
                {item.label}
              </Link>
            ))}
            
            {content.elements.showUserMenu && currentUser && (
              <>
                <hr className="border-border" />
                <Link
                  to="/profile"
                  onClick={() => setSidebarOpen(false)}
                  className="block p-2"
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setSidebarOpen(false)}
                    className="block p-2"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setSidebarOpen(false)
                    handleSignOut()
                  }}
                  className="block w-full text-left p-2"
                >
                  Sign Out
                </button>
              </>
            )}
            
            {!currentUser && (
              <Link
                to="/login"
                onClick={() => setSidebarOpen(false)}
                className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-center"
              >
                Login
              </Link>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </header>
  )
}
