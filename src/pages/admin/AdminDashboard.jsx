"use client"

import { Routes, Route, Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  Users,
  BookOpen,
  CreditCard,
  Menu,
  X,
  FolderTree,
  BarChart3,
  Layout,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { db } from "../../lib/firebase"
import ManageUsers from "./ManageUsers"
import ManageCourses from "./ManageCourses"
import ManagePayments from "./ManagePayments"
import ManageCategories from "./ManageCategories"
import Overview from "./Overview"
import HeaderFooterBuilder from "./HeaderFooterBuilder"

export default function AdminDashboard() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0)

  useEffect(() => {
    const paymentsQuery = query(
      collection(db, "payments"),
      where("status", "==", "pending")
    )
    
    const unsubscribe = onSnapshot(paymentsQuery, (snapshot) => {
      setPendingPaymentsCount(snapshot.size)
    }, (error) => {
      console.error("Error listening to pending payments:", error)
    })

    return () => unsubscribe()
  }, [])

  const navItems = [
    { name: "Overview", path: "/admin", icon: BarChart3 },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Categories", path: "/admin/categories", icon: FolderTree },
    { name: "Courses", path: "/admin/courses", icon: BookOpen },
    { name: "Payments", path: "/admin/payments", icon: CreditCard, badge: pendingPaymentsCount },
    { name: "Header & Footer", path: "/admin/header-footer", icon: Layout },
  ]

  const currentPage = navItems.find((item) => item.path === location.pathname)?.name || "Overview"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-border bg-card sticky top-[57px] z-40 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground font-medium">{currentPage}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-[57px] z-40 shadow-sm">
        <div>
          <h1 className="text-base font-bold text-foreground">Admin Panel</h1>
          <p className="text-xs text-muted-foreground font-medium">{currentPage}</p>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex flex-col w-56 bg-card border-r border-border overflow-y-auto">
          <div className="p-3">
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-md transition-all duration-200 text-xs ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm font-medium"
                        : "hover:bg-muted text-foreground hover:text-primary font-normal"
                    }`}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-lg overflow-y-auto"
            >
              <div className="p-4">
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm font-medium"
                            : "hover:bg-muted text-foreground hover:text-primary font-normal"
                        }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.name}</span>
                        {item.badge > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="p-3 sm:p-4 lg:p-4">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="categories" element={<ManageCategories />} />
              <Route path="courses" element={<ManageCourses />} />
              <Route path="payments" element={<ManagePayments />} />
              <Route path="header-footer" element={<HeaderFooterBuilder />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}
