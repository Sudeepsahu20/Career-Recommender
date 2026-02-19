'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { DemandLevel, MarketOutLook } from "@prisma/client";
import { generateAiInsights } from "./dashboard";

export async function updateUser(data) {
    
  const {userId}=await auth();
    if(!userId){
         throw new Error('Unauthorized')
    }

   const user= await db.user.findUnique({
        where:{
            clerkUserId:userId
        }
    })

    if(!user) throw new Error("User not found");

    try {
    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
         const insights=await generateAiInsights(data.industry);
        
                industryInsight= await db.industryInsight.create({
                data:{
                    industry:data.industry,
                    ...insights,
                    nextUpdate:new Date(Date.now()+7*24*60*60*1000)
                }
               })
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return updatedUser;
      },
      {
        timeout: 10000, // default: 5000
      }
    );

   
    return { success: true, user:result };
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error(error.message);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        industry: true,
      },
    });

    if (!user) throw new Error("User not found");

    return { isOnboarded: !!user.industry };

  } catch (error) {
    console.log("Error in onboarding user", error.message);
    throw new Error("Failed to check onboarding status");
  }
}
