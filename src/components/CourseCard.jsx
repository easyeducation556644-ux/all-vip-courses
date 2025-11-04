"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertCircle, Check, ShoppingCart, Send } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function CourseCard({ course, paymentStatus, showButton = false }) {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const hasPendingPayment = paymentStatus === "pending"
  const hasAccess = paymentStatus === "approved"
  const [hasClickedTelegram, setHasClickedTelegram] = useState(false)

  useEffect(() => {
    if (hasAccess && currentUser && course.id) {
      const clickedLinks = JSON.parse(localStorage.getItem(`telegram_clicks_${currentUser.uid}`) || '{}')
      setHasClickedTelegram(!!clickedLinks[course.id])
    }
  }, [hasAccess, currentUser, course.id])

  const handleButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (hasAccess && course.telegramLink) {
      return
    } else if (hasPendingPayment) {
      navigate('/payment-history')
    } else {
      const tempCartItem = {
        id: course.id,
        title: course.title,
        price: course.price || 0,
        thumbnailURL: course.thumbnailURL
      }
      localStorage.setItem("tempCheckoutItem", JSON.stringify([tempCartItem]))
      navigate('/checkout')
    }
  }

  const handleTelegramClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!course.telegramLink || !currentUser || hasClickedTelegram) return
    
    let telegramAppUrl
    const link = course.telegramLink
    
    if (link.includes('joinchat/') || link.includes('+')) {
      let inviteCode = link
      if (inviteCode.includes('joinchat/')) {
        inviteCode = inviteCode.split('joinchat/')[1].split('?')[0]
      } else if (inviteCode.includes('+')) {
        inviteCode = inviteCode.split('+')[1].split('?')[0]
      }
      telegramAppUrl = `tg://join?invite=${inviteCode}`
    } else if (link.includes('t.me/')) {
      const username = link.split('t.me/')[1].split('/')[0].split('?')[0]
      telegramAppUrl = `tg://resolve?domain=${username}`
    } else {
      telegramAppUrl = link
    }
    
    window.location.href = telegramAppUrl
    
    setTimeout(() => {
      const clickedLinks = JSON.parse(localStorage.getItem(`telegram_clicks_${currentUser.uid}`) || '{}')
      clickedLinks[course.id] = true
      localStorage.setItem(`telegram_clicks_${currentUser.uid}`, JSON.stringify(clickedLinks))
      setHasClickedTelegram(true)
    }, 500)
  }

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
          
          {!showButton && hasPendingPayment && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Pending
            </div>
          )}
          
          {!showButton && hasAccess && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" />
              Enrolled
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
            <div className={`text-xs text-muted-foreground ${showButton ? 'mb-3' : ''}`}>
              {course.category}
            </div>
          )}

          {showButton && (
            <div className="mt-auto pt-3 border-t border-border">
              {hasAccess && course.telegramLink ? (
                <button
                  onClick={handleTelegramClick}
                  disabled={hasClickedTelegram}
                  className={`w-full py-2.5 rounded-md text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    hasClickedTelegram
                      ? 'bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm hover:shadow-md'
                  }`}
                >
                  {hasClickedTelegram ? (
                    <>
                      <Check className="w-4 h-4" />
                      Joined Telegram Group
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Join Telegram Group
                    </>
                  )}
                </button>
              ) : hasPendingPayment ? (
                <button
                  onClick={handleButtonClick}
                  className="w-full py-2.5 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  Pending Payment
                </button>
              ) : (
                <button
                  onClick={handleButtonClick}
                  className="w-full py-2.5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
