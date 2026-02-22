'use client'
import { generateCoverLetter } from "@/actions/cover-letter";
import { coverLetterSchema } from "@/app/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/useFetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CoverLetterGenerator = () => {
   const router = useRouter();
    
   //this my zod validation
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    isLoading: generating,
    fun: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  // content fir render hoga jab generate hoga ai se content
  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated successfully!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter]);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn(data);
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Provide information about the position you're applying for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Form fields remain the same */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  placeholder="Enter company name here...."
                  id="companyName"
                  {...register("companyName")}
                />
              </div>
              {errors.companyName && (
                <p className="text-sm text-red-500">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  placeholder="Enter job title here...."
                  id="jobTitle"
                  {...register("jobTitle")}
                />
                
              </div>
              {errors.jobTitle && (
                <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Input
                  placeholder="Paste the job description here..."
                  id="jobDescription"
                  {...register("jobDescription")}
                />
               
              </div>
              {errors.jobDescription && (
                <p className="text-sm text-red-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>
        <div className="flex justify-end">
              <Button type="submit" disabled={generating}>
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Cover Letter"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoverLetterGenerator;
