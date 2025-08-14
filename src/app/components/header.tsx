"use client";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useHeader from "./hooks/useHeader";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const { isOpen, setIsOpen, theme, toggleTheme } = useHeader();
  const { logout, user, isLoggedOut } = useAuthStore();

  return (
    <>
      <header className="w-full py-4 px-6 flex items-center justify-between border-b bg-background sticky top-0 z-50">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image
              src="/fastbeetnamelogo2.jpeg"
              alt="Fastbeetech Logo"
              width={160}
              height={40}
              priority
              className="dark:invert"
            />
          </div>
        </Link>

        {/* Theme toggle + Mobile */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link
            href="/#services"
            className="text-sm font-medium hover:underline"
          >
            Services
          </Link>
          <Link
            href="/internship"
            className="text-sm font-medium hover:underline"
          >
            Internship
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:underline">
            Blog
          </Link>
          {isLoggedOut ? (
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
          ) : (
            <>
              {user && user.role !== "user" && (
                <Link
                  href="/dashboard"
                  className="text-sm font-medium hover:underline"
                >
                  Dashboard
                </Link>
              )}
              <Button onClick={() => logout()}>Logout</Button>
            </>
          )}
        </nav>
      </header>

      {/* Framer Motion: Animated mobile nav dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsOpen(false)} // click anywhere to close
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              // className="absolute top-16 left-0 w-full bg-background px-6 py-4 shadow-md"
              className="absolute top-[4.5rem] left-4 right-4 bg-background rounded-xl shadow-lg px-6 py-4 z-50"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
            >
              <nav className="flex flex-col gap-4">
                <Link
                  href="/#services"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium"
                >
                  Services
                </Link>
                <Link
                  href="/internship"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium"
                >
                  Internship
                </Link>
                <Link
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium"
                >
                  Blog
                </Link>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
