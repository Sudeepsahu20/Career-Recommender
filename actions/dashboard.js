'use server'

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const  generateAiInsights=async(industry)=> {
     try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
     contents: `
Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "HIGH" | "MEDIUM" | "LOW",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

IMPORTANT: Return ONLY the JSON. No markdown. No explanations.
Include at least 5 common roles.
Growth rate should be numeric (example: 12.5).
`

    });

    let text = result.text;

    // Clean markdown if Gemini adds it
    text = text.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(text);
      console.log(parsed);
    return parsed;

  } catch (error) {
    console.error("AI generation failed:", error);
    throw new Error("Failed to generate AI insights");
  }
}

export async function getIndustryInsights(){
      const { userId } = await auth();
    
      if (!userId) {
        throw new Error("Unauthorized");
      }
    
      const user=await db.user.findUnique({
        where:{
          clerkUserId:userId
        },
        include:{
            industryInsight:true
        }
      })
    
      if(!user) throw new Error("User not found");
       
      if(!user.industryInsight) {
        const insights=await generateAiInsights(user.industry);
         

       const  industryInsight= await db.industryInsight.create({
        data:{
            industry:user.industry,
            ...insights,
            nextUpdate:new Date(Date.now()+7*24*60*60*1000)
        }
       })
       return industryInsight;
      }
       return user.industryInsight;
}