import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { createDefaultHeaderConfig, createDefaultFooterConfig } from "../src/lib/headerFooterUtils.js"

// Firebase config (same as in src/lib/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyDTXQlq6y6Fs5gVDpHNexiH82Lfn8hVz2s",
  authDomain: "easy-education-real.firebaseapp.com",
  projectId: "easy-education-real",
  storageBucket: "easy-education-real.appspot.com",
  messagingSenderId: "688089994768",
  appId: "1:688089994768:web:e78baed6ebbf36bd82d2e0"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function initializeDefaultConfigs() {
  try {
    console.log("🚀 Initializing default header and footer configurations...")
    
    // Create default header config
    const headerConfig = createDefaultHeaderConfig("admin")
    console.log("📝 Creating default header config...")
    await setDoc(doc(db, "headerConfigs", "default"), headerConfig)
    console.log("✅ Default header config created successfully!")
    
    // Create default footer config
    const footerConfig = createDefaultFooterConfig("admin")
    console.log("📝 Creating default footer config...")
    await setDoc(doc(db, "footerConfigs", "default"), footerConfig)
    console.log("✅ Default footer config created successfully!")
    
    // Create default site pages
    console.log("📝 Creating default site pages...")
    const defaultPages = [
      { id: "page-home", title: "Home", slug: "/", type: "static", isVisible: true, order: 0 },
      { id: "page-courses", title: "Courses", slug: "/courses", type: "static", isVisible: true, order: 1 },
      { id: "page-community", title: "Community", slug: "/community", type: "static", isVisible: true, order: 2 },
      { id: "page-announcements", title: "Announcements", slug: "/announcements", type: "static", isVisible: true, order: 3 },
      { id: "page-my-courses", title: "My Courses", slug: "/my-courses", type: "static", isVisible: true, order: 4 },
      { id: "page-profile", title: "Profile", slug: "/profile", type: "static", isVisible: true, order: 5 },
      { id: "page-admin", title: "Admin Dashboard", slug: "/admin", type: "static", isVisible: true, order: 6 }
    ]
    
    for (const page of defaultPages) {
      await setDoc(doc(db, "sitePages", page.id), {
        ...page,
        createdAt: new Date()
      })
    }
    console.log("✅ Default site pages created successfully!")
    
    console.log("\n🎉 All default configurations initialized successfully!")
    console.log("\n📌 Next steps:")
    console.log("   1. Go to Admin Dashboard > Header & Footer")
    console.log("   2. Customize your header and footer")
    console.log("   3. Click 'Publish' to make changes live")
    
    process.exit(0)
  } catch (error) {
    console.error("❌ Error initializing configurations:", error)
    process.exit(1)
  }
}

initializeDefaultConfigs()
