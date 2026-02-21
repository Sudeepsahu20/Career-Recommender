'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";

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
        clerkUserId:user.id
    }
,{
    update:{
        content,
    },
    create:{
        clerkUserId:user.id,
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