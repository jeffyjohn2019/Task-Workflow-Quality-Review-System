import model from "./geminiService";

export const analyzeSubmission = async (
    submission
) => {
    try {
        const prompt = `
You are an AI quality reviewer.

Analyze the following submission.

Return ONLY JSON.

Format:
{
  "score": number,
  "summary": "",
  "issues": [],
  "suggestions": []
}

Submission:
${submission}
`;

        const result =
            await model.generateContent(prompt);

        const response =
            result.response.text();

        const cleaned = response
            .replace(/```json/g, "")
            .replace(/```/g, "");

        return JSON.parse(cleaned);
    } catch (error) {
        console.log(error);
    }
};