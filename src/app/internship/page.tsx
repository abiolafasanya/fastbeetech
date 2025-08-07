// app/internship/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import InternshipModal from "../components/internshipModal";

export default function InternshipPage() {
  const [openModal, setOpenModal] = useState(true);

  return (
    <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-start bg-background text-foreground">
      <div className="max-w-xl text-center space-y-4 mb-6">
        <h1 className="text-4xl font-bold">Apply for Internship</h1>
        <p className="text-muted-foreground">
          Join our internship program and gain real-world experience in Software
          Engineering or Graphics Design. We mentor passionate learners ready to
          grow.
        </p>
      </div>

      <Button onClick={() => setOpenModal(true)} size="lg">
        Open Application Form
      </Button>

      <InternshipModal open={openModal} onOpenChange={setOpenModal} />
    </div>
  );
}
