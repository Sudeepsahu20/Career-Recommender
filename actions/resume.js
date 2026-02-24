'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { error } from "node:console";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function saveResume({content}){

 const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const saveResume=await db.resume.upsert({
       where:{
        userId:user.id
      },
    update:{
        content,
    },
    create:{
        userId:user.id,
        content,
        
    }
})

revalidatePath('/resume');
return saveResume;
  } catch (error) {
     console.error("Error in saving ths resume", error.message);
    throw new Error(error.message);
  }

}

export async function getResume() {
    const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

 try {
     const resume=await db.resume.findUnique({
    where:{
        userId:user.id,
    },
  })

  return resume;
 } catch (error) {
   console.error("Error in getting ths resume", error.message);
    throw new Error(error.message);
 }
}

export async function improveWithAi({type,current,company}) {

     if (!type || !current) {
    throw new Error("Type and current content are required");
  }
    const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

   try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
             text: `
As an expert resume writer, improve the following ${type} description 
for a ${user.industry} professional${company ? ` who worked at ${company}` : ""}.

Make it more impactful, quantifiable, and aligned with industry standards.

Current content: "${current}"

Requirements:
1. Use action verbs
2. Include metrics and results where possible
3. Highlight relevant technical skills
4. Keep it concise but detailed
5. Focus on achievements over responsibilities
6. Use industry-specific keywords

Format the response as a single paragraph without any additional text or explanations.`
            },
          ],
        },
      ],
    });

    let text = result.text?.trim() || "";

      if (!text) {
      throw new Error("AI returned empty response");
    }

    return text;
}catch(error){
  console.error("Error improving resume:", error);
    throw new Error("Failed to improve resume");
}
}

export async function improveProSummaryWithAi(data){

   const {userId}=await auth();
   if(!userId){
    throw new Error("User not found");
   }

   const user=await db.user.findUnique({
    where:{
      clerkUserId:userId
    }
   })

   if(!user){
    throw new Error("User does not exist")
   }

   if(!data){
    throw new Error('Data must not be empty');
   }

   try {
       const response=await ai.models.generateContent({
         model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            {
             text: `
You are an expert resume writer and career coach.

Generate a concise, professional summary for the following candidate:

- Industry: ${data.industry}
- Key Skills: ${
  Array.isArray(data.skills)
    ? data.skills.join(", ")
    : data.skills || "Not specified"
}
- Years of Experience: ${data.experience || "Not specified"}
- Bio / Background: ${data.bio || "Not specified"}

Requirements:
1. Write 3-4 sentences maximum — keep it little bit of large and punchy
2. Start with a strong professional identity statement (e.g., "Results-driven software engineer with 5+ years...")
3. Highlight top 2-3 skills most relevant to ${user.industry}
4. Mention a key strength or value the candidate brings to employers
5. Use industry-specific keywords for ATS optimization
6. Avoid buzzwords like "passionate", "hardworking", "team player"
7. Write in third-person implied style (no "I" or "my")

Return ONLY the summary paragraph. No labels, no explanations, no bullet points.`
            }
            ]
        }]
       })

       const result= response.text?.trim();
       if(!result){
              throw new error("AI Returned empty response");
       }
   return result;
   } catch (error) {
      console.error("Error improving professional summary:", error);
    throw new Error("Failed to improve professional summary");
   }
}