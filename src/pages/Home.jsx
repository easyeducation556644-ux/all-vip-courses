"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, BookOpen, Award, Infinity, ChevronRight } from "lucide-react"
import CourseCard from "../components/CourseCard"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { db } from "../lib/firebase"
import { useAuth } from "../contexts/AuthContext"

export default function Home() {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [trendingCourses, setTrendingCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [isAdmin])

  const fetchData = async () => {
    try {
      if (!db) {
        console.warn(" Firebase not available, skipping data fetch")
        setLoading(false)
        return
      }

      const coursesQuery = query(collection(db, "courses"), orderBy("createdAt", "desc"), limit(20))
      const coursesSnapshot = await getDocs(coursesQuery)
      let coursesData = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      if (!isAdmin) {
        coursesData = coursesData.filter((course) => course.publishStatus !== "draft")
      }

      setTrendingCourses(coursesData.slice(0, 6))

      const categoriesQuery = query(
        collection(db, "categories"), 
        where("showOnHomepage", "==", true),
        orderBy("order", "asc"),
        limit(8)
      )
      const categoriesSnapshot = await getDocs(categoriesQuery)
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCategories(categoriesData)
    } catch (error) {
      console.error(" Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate("/courses", { state: { searchQuery: searchQuery.trim() } })
      setSearchQuery("")
    }
  }

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}`)
  }

  return (
    <div className="min-h-screen">
      <section className="relative bg-background py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="max-w-2xl mx-auto text-center">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight text-foreground"
            >
              All Vip Course
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto"
            >
              Access premium education from anywhere, anytime. Learn from industry experts and advance your career.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col items-center justify-center gap-4"
            >
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all font-medium text-sm"
              >
                Browse Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-12 md:py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Browse Categories</h2>
              <p className="text-muted-foreground text-sm">Explore our collection of courses</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button onClick={() => handleCategoryClick(category)} className="w-full text-left group">
                    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-sm transition-all">
                      {category.imageURL && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={category.imageURL} 
                            alt={category.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                      </div>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12 md:py-16 px-4 bg-background">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Featured Courses</h2>
            <p className="text-muted-foreground text-sm">Start your learning journey</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                  <div className="aspect-video bg-muted rounded-md mb-3"></div>
                  <div className="h-5 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : trendingCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {trendingCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No courses available yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-all font-medium text-sm"
            >
              View All Courses
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
