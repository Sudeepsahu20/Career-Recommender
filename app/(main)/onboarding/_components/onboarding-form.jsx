"use client";
import { onboardingSchema } from "@/app/lib/schema";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";
import { Loader } from "lucide-react";


const OnboardingForm = ({ industries }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const router = useRouter();

 const {isLoading:updateLoading,fun:UpdateUserFn,data:updateResult}=  useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit=async(values)=>{
      try {
        const formattedIndustry=`${values.industry}-${values.subIndustry}`.toLowerCase().replace(/ /g,"-");
        await UpdateUserFn({
          ...values,
          industry:formattedIndustry
        })
      } catch (error) {
console.error("Onboarding error",error.message);
      }
  }

  useEffect(()=>{
     if(updateResult?.success && !updateLoading){
     toast.success("Profile Completed Successfully");
     router.push('/dashboard');
     router.refresh();
     }
     console.log("it runs");
  },[updateResult,updateLoading])

     const watchIndustry=watch('industry');

  return (
    <div className="flex justify-center items-center bg-background">
      <Card className="w-full max-w-lg mx-2 mt-10">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Select Your Industry
          </CardTitle>
          <CardDescription>
            Select Your Industry to get career personalize and career insights
            and recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* form here */}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="industry">Select Industry</Label>

              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value),
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem value={ind.id} key={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-600">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>

                <Select
                  onValueChange={(value) => {
                    setValue("subIndustry", value);
                  }}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.subIndustries.map((ind) => (
                      <SelectItem value={ind} key={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-600">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                min="0"
                max="50"
                type="number"
                placeholder="Enter your experience in years"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-600">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Enter your Skills</Label>
              <Input
                id="skills"
                type="text"
                placeholder="eg: Python,Java,Javascript etc..."
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">Seperate multiple skills with commas</p>
              {errors.skills && (
                <p className="text-sm text-red-600">
                  {errors.skills.message}
                </p>
              )}
            </div>

             <div className="space-y-2">
              <Label htmlFor="bio">Professional bio</Label>
              <Textarea
              className='h-32'
                id="bio"
                type="text"
                placeholder="Tell us something about yourself..."
                {...register("bio")}
              />
              {/* <p className="text-sm text-muted-foreground">Seperate multiple skills with commas</p> */}
              {errors.bio && (
                <p className="text-sm text-red-600">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <Button 
  type='submit' 
  className='w-full' 
  disabled={updateLoading}
>
  {updateLoading ? (
    <>
      <Loader className="animate-spin mr-2 h-4 w-4" />
      Saving...
    </>
  ) : (
    "Complete Profile"
  )}
</Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingForm;
