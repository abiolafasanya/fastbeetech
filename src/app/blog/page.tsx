// app/blog/page.tsx (Blog Index Page)
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-4 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">Fastbeetech Blog</h1>
      <p className="text-center text-lg text-muted-foreground mb-12">
        Insights, tutorials, updates and engineering stories.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Post Title {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Short summary of the post content...
              </p>
              <Link href={`/blog/post-${i}`} className="text-blue-600 text-sm">
                Read More
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
