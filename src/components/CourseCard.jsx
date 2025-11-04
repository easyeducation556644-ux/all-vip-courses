"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"

export default function CourseCard({ course }) {
  return (
    <Link to={`/${course.slug || course.id}`} className="h-full">
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        className="h-full bg-card border border-border rounded-lg overflow-hidden hover:border-primary hover:shadow-sm transition-all flex flex-col group"
      >
        <div className="relative overflow-hidden bg-muted aspect-video">
          {course.thumbnailURL ? (
            <img
              src={course.thumbnailURL || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="text-4xl mb-1">📚</div>
                <p className="text-xs">{course.category}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-semibold text-foreground line-clamp-2 flex-1 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            {course.price && (
              <span className="text-sm font-bold text-primary whitespace-nowrap">৳{course.price}</span>
            )}
          </div>

          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
            {course.description || "Learn at your own pace"}
          </p>

          {course.instructorName && (
            <div className="mb-2">
              <p className="text-xs text-muted-foreground">
                By <span className="font-medium text-foreground">{course.instructorName}</span>
              </p>
            </div>
          )}

          {course.category && (
            <div className="text-xs text-muted-foreground">
              {course.category}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
