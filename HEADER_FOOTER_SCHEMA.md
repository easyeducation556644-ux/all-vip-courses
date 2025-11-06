# Header & Footer Builder - Data Structure

## Firestore Collections

### 1. `headerConfigs` Collection

Stores header configurations with dynamic content, styling, and conditional display rules.

```javascript
{
  id: "default",  // Auto-generated or custom ID
  name: "Default Header",  // User-friendly name
  isActive: true,  // Whether this config is currently active
  isPublished: true,  // Draft or published
  
  // Content Configuration
  content: {
    logo: {
      type: "image" | "text",
      imageUrl: "https://...",  // If type is image
      text: "All Vip Courses",  // If type is text
      link: "/",
      alt: "Site Logo"
    },
    
    navigation: [
      {
        id: "nav-1",
        label: "Home",
        type: "internal" | "external",
        url: "/",  // If external
        pageId: null,  // If internal (reference to page)
        order: 0,
        isVisible: true,
        openInNewTab: false,
        children: []  // For dropdown menus
      },
      {
        id: "nav-2",
        label: "Courses",
        type: "internal",
        url: "/courses",
        pageId: null,
        order: 1,
        isVisible: true,
        openInNewTab: false,
        children: []
      }
    ],
    
    // Additional elements (search, theme toggle, user menu, etc.)
    elements: {
      showSearch: true,
      showThemeToggle: true,
      showUserMenu: true,
      showInstallButton: true,
      customButtons: []  // For future custom buttons
    },
    
    // Mobile menu configuration
    mobileMenu: {
      enabled: true,
      position: "left" | "right",
      showIcons: true
    }
  },
  
  // Styling Configuration
  styling: {
    layout: {
      height: "auto",
      maxWidth: "container",  // "full" | "container" | custom
      padding: {
        top: "1rem",
        bottom: "1rem",
        left: "1rem",
        right: "1rem"
      },
      sticky: true,
      zIndex: 50
    },
    
    colors: {
      background: "bg-card",
      text: "text-foreground",
      border: "border-border",
      hoverBackground: "hover:bg-accent",
      hoverText: "hover:text-accent-foreground"
    },
    
    typography: {
      logoFont: "font-bold",
      logoSize: "text-xl",
      navFont: "font-medium",
      navSize: "text-sm"
    },
    
    effects: {
      shadow: "shadow-sm",
      borderRadius: "rounded-none",
      animation: "fade-in"  // on scroll
    }
  },
  
  // Conditional Display Rules
  displayRules: {
    pages: {
      type: "all" | "specific" | "exclude",
      pages: ["/", "/courses"]  // If specific or exclude
    },
    
    userRoles: {
      type: "all" | "specific",
      roles: ["admin", "user", "guest"]  // If specific
    },
    
    devices: {
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    }
  },
  
  // Versioning
  version: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: "userId",
  updatedBy: "userId",
  
  // Revision History - Complete snapshots for rollback capability
  revisions: [
    {
      version: 1,
      content: {...},  // Full content snapshot
      styling: {...},  // Full styling snapshot
      displayRules: {...},  // Full display rules snapshot
      isActive: true,
      isPublished: true,
      updatedAt: Timestamp,
      updatedBy: "userId",
      notes: "Initial version"
    }
  ]
}
```

### 2. `footerConfigs` Collection

Stores footer configurations similar to header but with different content structure.

```javascript
{
  id: "default",
  name: "Default Footer",
  isActive: true,
  isPublished: true,
  
  // Content Configuration
  content: {
    // Brand/About Section
    brand: {
      enabled: true,
      type: "image" | "text",
      imageUrl: "",
      text: "All Vip Courses",
      description: "HSC academic & admission courses at low price.",
      order: 0
    },
    
    // Link Sections
    sections: [
      {
        id: "section-1",
        title: "Quick Links",
        order: 1,
        links: [
          {
            id: "link-1",
            label: "Home",
            type: "internal" | "external",
            url: "/",
            pageId: null,
            order: 0,
            isVisible: true,
            openInNewTab: false
          }
        ]
      },
      {
        id: "section-2",
        title: "Contact",
        order: 2,
        links: [
          {
            id: "contact-1",
            label: "Email",
            type: "email",
            value: "easyeducation556644@gmail.com",
            icon: "Mail",
            order: 0
          },
          {
            id: "contact-2",
            label: "Phone",
            type: "phone",
            value: "+8801969752197",
            icon: "Phone",
            order: 1
          }
        ]
      }
    ],
    
    // Social Links
    socialLinks: {
      enabled: true,
      title: "Connect",
      order: 3,
      links: [
        {
          id: "social-1",
          platform: "telegram",
          url: "https://t.me/...",
          icon: "Send",
          order: 0,
          isVisible: true
        },
        {
          id: "social-2",
          platform: "youtube",
          url: "https://youtube.com/...",
          icon: "Youtube",
          order: 1,
          isVisible: true
        }
      ]
    },
    
    // Copyright/Bottom Section
    copyright: {
      enabled: true,
      text: "© {year} All Vip Courses. All rights reserved.",
      links: []
    }
  },
  
  // Styling Configuration (similar to header)
  styling: {
    layout: {
      columns: 4,  // Grid columns on desktop
      gap: "2rem",
      padding: {
        top: "2rem",
        bottom: "2rem",
        left: "1rem",
        right: "1rem"
      }
    },
    
    colors: {
      background: "bg-card",
      text: "text-muted-foreground",
      headingText: "text-foreground",
      border: "border-border",
      hoverText: "hover:text-primary"
    },
    
    typography: {
      headingFont: "font-semibold",
      headingSize: "text-base",
      linkFont: "font-normal",
      linkSize: "text-sm"
    },
    
    effects: {
      borderTop: true,
      shadow: "none"
    }
  },
  
  // Conditional Display Rules
  displayRules: {
    pages: {
      type: "all",
      pages: []
    },
    userRoles: {
      type: "all",
      roles: []
    },
    devices: {
      showOnMobile: true,
      showOnTablet: true,
      showOnDesktop: true
    }
  },
  
  // Versioning
  version: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: "userId",
  updatedBy: "userId",
  
  revisions: []
}
```

### 3. `sitePages` Collection (Helper for Internal Link Selection)

Stores available pages for the internal link picker.

```javascript
{
  id: "auto-generated",
  title: "Home",
  slug: "/",
  type: "static" | "dynamic",  // static pages vs course pages, etc.
  isVisible: true,
  order: 0,
  createdAt: Timestamp
}
```

## Usage Flow

1. **Admin creates/edits** header/footer in the builder interface
2. **Configuration saved** to Firestore (headerConfigs/footerConfigs)
3. **Frontend components** fetch active configuration on load
4. **Conditional logic** determines which config to display
5. **Dynamic rendering** based on fetched configuration
6. **Real-time updates** when admin publishes changes

## Benefits

- ✅ No code changes needed for header/footer updates
- ✅ Multiple configurations for different pages/user types
- ✅ Version history for rollback capability
- ✅ Draft/publish workflow for safe editing
- ✅ Complete styling control from admin panel
- ✅ SEO-friendly with proper link structure
