import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 bg-gray-900 text-white text-center">
      <p className="text-sm mb-4">
        &copy; {new Date().getFullYear()} Hexonest. All rights reserved.
      </p>

      <div className="flex justify-center gap-6">
        <Link href="https://facebook.com/hexonest" target="_blank" aria-label="Facebook">
          <Facebook className="w-5 h-5 hover:text-blue-500" />
        </Link>
        <Link href="https://twitter.com/hexonest" target="_blank" aria-label="Twitter">
          <Twitter className="w-5 h-5 hover:text-sky-400" />
        </Link>
        <Link
          href="https://instagram.com/hexonest"
          target="_blank"
          aria-label="Instagram"
        >
          <Instagram className="w-5 h-5 hover:text-pink-400" />
        </Link>
        <Link href="https://linkedin.com/hexonest" target="_blank" aria-label="LinkedIn">
          <Linkedin className="w-5 h-5 hover:text-blue-400" />
        </Link>
      </div>
    </footer>
  );
}
