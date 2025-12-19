export function generateFeedback(conversation: any) {
    return `You are an expert technical interviewer and evaluator.

You will be given:
- a jobId
- a conversation between an AI interviewer (role: "assistant") and a candidate (role: "user")

Analyze the conversation and generate an interview evaluation.

IMPORTANT RULES (STRICT):
- Return ONLY a valid JSON object
- Do NOT wrap the output in backticks
- Do NOT return a JSON string
- Do NOT add explanations or extra text
- The response must be directly parsable by JSON.parse()

### Evaluation Instructions:
1. Identify each technical interview question asked by the AI interviewer.
2. Map each question to the candidate's corresponding answer.
3. Score the candidate based ONLY on the conversation.
4. Scores must be decimals between 0.0 and 10.0.
5. overallScore must be the average of all scores, rounded to one decimal.
6. If an answer is incomplete, reflect that in the score.
7. If a question has no answer, omit it.

### Output JSON Schema (MANDATORY):
{
  "questionAnswers": [
    {
      "question": string,
      "answer": string
    }
  ],
  "scores": {
    "technicalScore": number,
    "communicationScore": number,
    "confidenceScore": number,
  },
  "summary": string
}

### Conversation (JSON):
${JSON.stringify(conversation, null, 2)}`;
}

export function generateQuestion(
    job_role: string,
    description: string,
    tech_stack: string,
    experience: number,
    interview_type: string,
    no_of_questions:number
) {
    return `
        You are an expert interviewer. Generate interview questions based on the job information below.

        Job Role: ${job_role}
        Description: ${description}
        Required Tech Stack: ${tech_stack}
        Experience Required (Years): ${experience}
        Interview Type: ${interview_type}
        Number of Questions Needed: ${no_of_questions}

        ### Interview Type Rules:
        - If Interview Type = "technical":
            * 80% technical based on tech_stack.
            * 20% scenario-based.
        - If Interview Type = "behavioral":
            * 80% behavior, teamwork, past experience.
            * 20% scenario-based.
        - If Interview Type = "hr":
            * Focus on culture fit, personality, strengths, weaknesses.
            * No technical questions.
        - If Interview Type = "mixed":
            * 40% technical, 30% behavioral, 30% scenario-based.

        ### Requirements:
        1. Difficulty must match experience.
        2. Every question must be highly relevant to the role.
        3. Output exactly ${no_of_questions} questions.
        4. Output strictly in JSON:

        {
        "questions": [
            { "type": "", "question": "" }
        ]
        }

        5. Do NOT include any non-JSON text.`;
}
