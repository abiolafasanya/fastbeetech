"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BookOpen, HelpCircle, FileText, Archive, Wand2 } from "lucide-react";
import { CourseModule } from "@/api/CourseApi";

interface CourseContentDemoProps {
  onLoadDemo: (modules: CourseModule[]) => void;
}

export function CourseContentDemo({ onLoadDemo }: CourseContentDemoProps) {
  const generateDemoContent = () => {
    const demoModules: CourseModule[] = [
      {
        title: "Introduction to Web Development",
        description:
          "Learn the fundamentals of web development with hands-on exercises and quizzes.",
        order: 1,
        contents: [
          {
            title: "Welcome Video",
            description: "Introduction to the course and what you'll learn",
            type: "video",
            order: 1,
            videoUrl: "https://youtube.com/watch?v=example",
            duration: 15,
            transcript:
              "Welcome to our comprehensive web development course. In this course, you'll learn HTML, CSS, JavaScript, and modern web frameworks...",
            isPreview: true,
          },
          {
            title: "HTML Fundamentals Quiz",
            description: "Test your understanding of HTML basics",
            type: "quiz",
            order: 2,
            isPreview: false,
            quiz: {
              title: "HTML Fundamentals Quiz",
              description:
                "Test your knowledge of HTML elements, attributes, and structure.",
              timeLimit: 15,
              passingScore: 80,
              maxAttempts: 3,
              showAnswers: true,
              order: 1,
              isRequired: true,
              questions: [
                {
                  question:
                    "Which HTML element is used to define the largest heading?",
                  type: "multiple-choice",
                  options: ["<h1>", "<h6>", "<header>", "<heading>"],
                  correctAnswer: "<h1>",
                  explanation:
                    "The <h1> element defines the largest heading in HTML.",
                  points: 2,
                },
                {
                  question: "HTML stands for HyperText Markup Language.",
                  type: "true-false",
                  correctAnswer: "true",
                  explanation:
                    "HTML indeed stands for HyperText Markup Language.",
                  points: 1,
                },
                {
                  question:
                    "What attribute is used to specify a unique identifier for an HTML element?",
                  type: "fill-blank",
                  correctAnswer: "id",
                  explanation:
                    "The 'id' attribute provides a unique identifier for HTML elements.",
                  points: 2,
                },
              ],
            },
          },
          {
            title: "Build Your First Website",
            description:
              "Create a personal portfolio website using HTML and CSS",
            type: "assignment",
            order: 3,
            isPreview: false,
            assignmentInstructions: `Create a personal portfolio website with the following requirements:

1. Use semantic HTML5 elements
2. Include a header with navigation
3. Add a hero section with your introduction
4. Create sections for projects, skills, and contact
5. Style with CSS (external stylesheet)
6. Make it responsive for mobile devices

Submission Guidelines:
- Submit as a ZIP file containing all HTML, CSS, and image files
- Include a README.md with setup instructions
- Test your website in multiple browsers`,
            dueDate: "2025-09-25T23:59",
            maxFileSize: 25,
            submissionFormat: ["zip", "pdf"],
            gradingRubric: [
              {
                criteria: "HTML Structure & Semantics",
                maxPoints: 25,
                description:
                  "Proper use of semantic HTML5 elements, valid markup, and logical structure",
              },
              {
                criteria: "CSS Styling & Layout",
                maxPoints: 25,
                description:
                  "Clean CSS code, responsive design, and visual appeal",
              },
              {
                criteria: "Content Quality",
                maxPoints: 20,
                description:
                  "Well-written content, professional presentation, and completeness",
              },
              {
                criteria: "Code Quality & Documentation",
                maxPoints: 15,
                description: "Clean, commented code and proper documentation",
              },
              {
                criteria: "Innovation & Creativity",
                maxPoints: 15,
                description:
                  "Creative design choices and additional features beyond requirements",
              },
            ],
          },
          {
            title: "Development Resources",
            description: "Essential tools and references for web development",
            type: "resource",
            order: 4,
            isPreview: true,
            allowDownloads: true,
            resources: [
              {
                title: "HTML5 Cheat Sheet",
                url: "https://example.com/html5-cheatsheet.pdf",
                type: "pdf",
              },
              {
                title: "CSS Grid Complete Guide",
                url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
                type: "link",
              },
              {
                title: "Starter Template Files",
                url: "/downloads/starter-templates.zip",
                type: "zip",
              },
              {
                title: "Web Development Tools Collection",
                url: "https://github.com/example/web-dev-tools",
                type: "other",
              },
            ],
          },
        ],
      },
      {
        title: "Advanced JavaScript Concepts",
        description:
          "Deep dive into JavaScript ES6+ features, async programming, and modern practices.",
        order: 2,
        contents: [
          {
            title: "Async Programming Concepts",
            description: "Understanding Promises, async/await, and event loops",
            type: "text",
            order: 1,
            isPreview: false,
            textContent: `# Asynchronous Programming in JavaScript

## Understanding the Event Loop

JavaScript is single-threaded, but it can handle asynchronous operations through the event loop. The event loop allows JavaScript to perform non-blocking I/O operations.

## Promises

Promises represent the eventual completion or failure of an asynchronous operation:

\`\`\`javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Data fetched successfully!");
    }, 2000);
  });
};

fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

## Async/Await

A more readable way to handle promises:

\`\`\`javascript
async function getData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
\`\`\`

## Best Practices

1. Always handle errors in async operations
2. Use async/await for better readability
3. Be careful with Promise.all vs Promise.allSettled
4. Understand the difference between concurrent and sequential execution`,
          },
          {
            title: "JavaScript Advanced Quiz",
            description: "Test your knowledge of advanced JavaScript concepts",
            type: "quiz",
            order: 2,
            isPreview: false,
            quiz: {
              title: "Advanced JavaScript Assessment",
              description:
                "This quiz covers ES6+ features, async programming, and advanced concepts.",
              timeLimit: 25,
              passingScore: 75,
              maxAttempts: 2,
              showAnswers: false,
              order: 1,
              isRequired: true,
              questions: [
                {
                  question:
                    "What will be the output of the following code?\\n\\n```javascript\\nconsole.log('A');\\nsetTimeout(() => console.log('B'), 0);\\nPromise.resolve().then(() => console.log('C'));\\nconsole.log('D');\\n```",
                  type: "code-review",
                  correctAnswer: "A, D, C, B",
                  explanation:
                    "Due to the event loop, synchronous code runs first (A, D), then microtasks like Promise callbacks (C), then macrotasks like setTimeout (B).",
                  points: 3,
                },
                {
                  question: "Arrow functions have their own 'this' binding.",
                  type: "true-false",
                  correctAnswer: "false",
                  explanation:
                    "Arrow functions do not have their own 'this' binding; they inherit 'this' from the enclosing scope.",
                  points: 2,
                },
                {
                  question:
                    "Which method is used to create a new array with all elements that pass a test implemented by a provided function?",
                  type: "multiple-choice",
                  options: ["map()", "filter()", "reduce()", "forEach()"],
                  correctAnswer: "filter()",
                  explanation:
                    "The filter() method creates a new array with all elements that pass the test implemented by the provided function.",
                  points: 2,
                },
              ],
            },
          },
          {
            title: "Build a Todo App with JavaScript",
            description:
              "Create a fully functional todo application using vanilla JavaScript",
            type: "assignment",
            order: 3,
            isPreview: false,
            assignmentInstructions: `Build a Todo Application with the following features:

**Core Requirements:**
- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Filter todos (All, Active, Completed)
- Local storage persistence
- Responsive design

**Technical Requirements:**
- Use ES6+ JavaScript features (arrow functions, destructuring, modules)
- Implement proper error handling
- Write clean, commented code
- Use semantic HTML and CSS Grid/Flexbox
- No frameworks allowed (vanilla JavaScript only)

**Bonus Features (for extra credit):**
- Drag and drop reordering
- Due date functionality
- Categories/tags
- Dark mode toggle
- Search functionality

**Deliverables:**
1. Complete source code (HTML, CSS, JS)
2. README with setup instructions
3. Brief documentation of your code structure
4. Screenshots or video demo`,
            dueDate: "2025-10-05T23:59",
            maxFileSize: 50,
            submissionFormat: ["zip", "pdf"],
            gradingRubric: [
              {
                criteria: "Functionality & Features",
                maxPoints: 30,
                description:
                  "All required features work correctly, proper error handling",
              },
              {
                criteria: "Code Quality & Best Practices",
                maxPoints: 25,
                description:
                  "Clean, readable code using ES6+ features, proper structure",
              },
              {
                criteria: "User Interface & Experience",
                maxPoints: 20,
                description:
                  "Intuitive design, responsive layout, accessibility considerations",
              },
              {
                criteria: "Documentation & Testing",
                maxPoints: 15,
                description:
                  "Clear documentation, code comments, and testing evidence",
              },
              {
                criteria: "Innovation & Bonus Features",
                maxPoints: 10,
                description:
                  "Additional features beyond requirements, creative solutions",
              },
            ],
          },
        ],
      },
    ];

    onLoadDemo(demoModules);
    toast.success(
      "Demo content loaded! Switch to Preview mode to see the results."
    );
  };

  return (
    <Card className="border-dashed border-2 border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-blue-600" />
          Course Content Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Load a comprehensive demo showcasing all content types with realistic
          course material. This will populate your course with sample quizzes,
          assignments, and resources.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center">
              <HelpCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-sm font-medium">Quizzes</div>
            <div className="text-xs text-muted-foreground">
              2 sample quizzes
            </div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-sm font-medium">Assignments</div>
            <div className="text-xs text-muted-foreground">2 projects</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center">
              <Archive className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-sm font-medium">Resources</div>
            <div className="text-xs text-muted-foreground">4 resources</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-sm font-medium">Mixed Content</div>
            <div className="text-xs text-muted-foreground">Video & text</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Multiple Choice Questions</Badge>
          <Badge variant="secondary">True/False</Badge>
          <Badge variant="secondary">Fill in the Blank</Badge>
          <Badge variant="secondary">Code Review</Badge>
          <Badge variant="secondary">Grading Rubrics</Badge>
          <Badge variant="secondary">File Submissions</Badge>
          <Badge variant="secondary">Resource Downloads</Badge>
        </div>

        <Button onClick={generateDemoContent} className="w-full">
          <Wand2 className="mr-2 h-4 w-4" />
          Load Demo Content
        </Button>
      </CardContent>
    </Card>
  );
}
