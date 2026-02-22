'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateCoverLetter(data){
        const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  if (!data.jobTitle || !data.companyName || !data.jobDescription) {
  throw new Error("Missing required fields");
}

  try {
     const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: [
        {
          role: "user",
          parts: [
            {
             text:  `
    Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.`
      },
          ],
        },
      ],
    });


    const content = response.text?.trim();

if (!content) {
  throw new Error("AI did not return any content");
}

    const coverLetter=await db.coverLetter.create({
      data:{
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        content:content,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      }
    })
     
    return coverLetter;
  } catch (error) {
     console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
   
}

export async function getCoverLetters() {
     const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const coverLetter=await db.coverLetter.findMany({
    where:{
        userId:user.id
    },
    orderBy:{
        createdAt:'desc',
    }
  })


  return coverLetter;
  } catch (error) {
     console.log("Error in fetching cover letter", error.message);
    throw error; 
  }
}

export async function getCoverLetterById(id) {
    const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
   
  try {
     const coverLetter=await db.coverLetter.findFirst({
      where:{
        id,
        userId:user.id
      }
    })

   if (!coverLetter) {
  throw new Error("Cover letter not found");
}

    return coverLetter;
  } catch (error) {
     console.log("Error in fetching cover letter", error.message);
    throw error; 
  }
  
}

export async function deleteCoverLetter(id) {
  
   const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");
try{
   const coverLetter = await db.coverLetter.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!coverLetter) {
    throw new Error("Cover letter not found");
  }

   return await db.coverLetter.delete({
    where:{
      id
    }
   })
  } catch (error) {
    console.log("Error in deleting cover letter", error.message);
    throw error; 
  }
}