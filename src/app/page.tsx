import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import BlogApi, { BlogPost } from "@/api/BlogApi";
import { demoBlogs, DemoBlog } from "@/data/blog";

function getPostKey(post: BlogPost | DemoBlog, idx: number) {
  if ((post as BlogPost)._id) return String((post as BlogPost)._id);
  // demoBlogs items have a slug property
  if ("slug" in post) return (post as DemoBlog).slug;
  return String(idx);
}

export default async function LandingPage() {
  let posts: (BlogPost | DemoBlog)[] = demoBlogs;
  try {
    const res = await BlogApi.list({ limit: 3, status: "published" });
    if (res && res.status && Array.isArray(res.data) && res.data.length) {
      posts = res.data;
    }
  } catch {
    // keep demoBlogs as fallback

  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar with Logo & Mobile Toggle */}

      {/* Hero Section */}
      <section className="py-24 text-center bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <h1 className="text-4xl font-bold md:text-6xl mb-4">
          Empowering Africa’s Digital Future
        </h1>
        <p className="text-xl mb-8 max-w-xl mx-auto">
          We build world-class software, train the next generation, and drive
          innovation.
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="#services" className="font-medium">
              Get Started
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-foreground"
          >
            <Link href="#internship" className="font-medium">
              Become an Intern
            </Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              "Web Development",
              "Mobile App Development",
              "Microservices Architecture",
              "AI Automations",
              "Digital Marketing",
              "UI/UX & Graphics Design",
              "Software Engineering Training",
              "Tech Consultation",
            ].map((service) => (
              <Card key={service} className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle>{service}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We provide expert solutions in {service.toLowerCase()} to
                    scale your business.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Internship Banner */}
      <section id="internship" className="py-16 bg-muted text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Join Our Internship Program
          </h2>
          <p className="mb-6 text-muted-foreground">
            We take in passionate learners in Software Engineering & Graphics
            Design. Learn by doing.
          </p>
          <Button asChild>
            <Link href="/internship">Apply for Internship</Link>
          </Button>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Latest Blog Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((blog, i: number) => (
              <Card key={getPostKey(blog, i)}>
                <CardHeader>
                  <CardTitle>{blog.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {blog.excerpt}
                  </p>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-blue-600 text-sm flex items-center"
                  >
                    Read More <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/blog" className="text-blue-600 underline">
              View All Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
