import { db } from "@/lib/prisma";
import { inngest } from "./client";

export const generateIndustryInsights = inngest.createFunction(
  { name: "generate industry insights" },
  { cron: "0 0 * * 0" },
  async ({ step }) => {

   const industries = await step.run("fetch-industries", async () => {
  return await db.industryInsight.findMany({
    select: { industry: true },
  });
});

if (!industries.length) return;

for (const { industry } of industries) {

  const aiResponse = await step.ai.infer(
  `generate-insights-${industry}`,
  {
    model: step.ai.models.gemini({
      model: "gemini-2.5-flash-lite",
    }),
    body: {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
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
            }
          ]
        }
      ]
    }
  }
);

      let text =
        aiResponse.candidates?.[0]?.content?.parts?.[0]?.text || "";

      text = text.replace(/```json|```/g, "").trim();

      let insights;

      try {
        insights = JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON for", industry);
        continue; // skip safely
      }

      await step.run(`update-${industry}`, async () => {
        await db.industryInsight.update({
          where: { industry },
          data: {
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      });
    }
  }
);