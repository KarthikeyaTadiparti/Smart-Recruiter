export function generateFeedback(conversation: any, questions: any) {
  return `
You are an expert technical interviewer and evaluator for frontend engineering roles.

You will be given:
- A list of interview questions asked by the AI interviewer
- A conversation between an AI interviewer (role: "assistant") and a candidate (role: "user")

Your task is to:
1. Map each question to the candidate's exact answer from the conversation
2. Evaluate the interview fairly and realistically
3. Generate scores and a concise feedback summary

IMPORTANT OUTPUT RULES (STRICT):
- Return ONLY a valid JSON object
- Do NOT wrap the output in backticks
- Do NOT return a JSON string
- Do NOT add explanations, comments, or extra text
- The response must be directly parsable by JSON.parse()

────────────────────────
EVALUATION RULES (MANDATORY)
────────────────────────

1. Use the provided questions list as the SINGLE source of truth.
2. For EACH question in the questions list:
   - Extract the candidate's corresponding answer from the conversation.
   - If the candidate did NOT answer that question, set "answer" to an empty string "".
3. Maintain the original question order.
4. Do NOT invent, infer, or improve answers.
5. Evaluate ONLY what the candidate actually said.
6. Treat answers as SPOKEN INTERVIEW RESPONSES, not written essays.

CRITICAL PENALTY RULE:
- Any unanswered question MUST be treated as a score between 0.0 - 3.0 for technical evaluation.
- If more than 50% of questions are unanswered, the technicalScore MUST NOT exceed 5.0.

────────────────────────
SCORING RUBRIC (STRICT)
────────────────────────

Apply scoring PER QUESTION first, then average.

- 9.0-10.0 → Clear, correct, confident, and complete
- 8.0-8.9 → Correct with minor gaps
- 7.0-7.9 → Correct but shallow
- 6.0-6.9 → Partially correct
- 3.0-5.9 → Weak or incomplete understanding
- 0.0-2.9 → No answer or incorrect

IMPORTANT:
- Unanswered = 0-2.5 ONLY (never higher)
- DO NOT ignore unanswered questions in averaging
- DO NOT inflate scores due to one good answer

────────────────────────
SCORE CALCULATION (MANDATORY)
────────────────────────

technicalScore:
- Compute score for EACH question
- Average across ALL questions (including unanswered)

communicationScore:
- Reduce if many answers are missing
- If candidate answers <50% questions → cap at 6.5

confidenceScore:
- Based on willingness to attempt answers
- If multiple skips → reduce score significantly
- If >50% unanswered → cap at 6.0

overallScore:
- Average of technicalScore, communicationScore, and confidenceScore
- Rounded to ONE decimal place

────────────────────────
OUTPUT JSON SCHEMA (MANDATORY)
────────────────────────

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
    "overallScore": number
  },
  "summary": string
}

────────────────────────
QUESTIONS (JSON):
${JSON.stringify(questions, null, 2)}

────────────────────────
CONVERSATION (JSON):
${JSON.stringify(conversation, null, 2)}
`.trim();
}

export function generateQuestion(
  job_role: string,
  description: string,
  tech_stack: string,
  experience: number,
  interview_type: string,
  no_of_questions: number
) {
  return `
    You are an expert interviewer with extensive real-world hiring experience.
    Generate interview questions that are commonly and frequently asked in real interviews for the given role.

    Job Role: ${job_role}
    Description: ${description}
    Required Tech Stack: ${tech_stack}
    Experience Required (Years): ${experience}
    Interview Type: ${interview_type}
    Number of Questions Needed: ${no_of_questions}

    ### Question Generation Rules:
    - Generate ONLY **frequently asked, industry-standard interview questions**.
    - Questions must closely match what candidates are typically asked in:
      * Product-based companies
      * Service-based companies
      * Startup technical interviews
    - Avoid rare, trick, or overly theoretical questions.
    - Avoid creative or hypothetical questions unless explicitly required by interview type.
    - Prefer questions that assess:
      * Core fundamentals
      * Real-world usage
      * Practical problem-solving
      * Common interview evaluation areas

    ### Interview Type Rules:
    - If Interview Type = "technical":
        * 80% core technical questions frequently asked from the given tech_stack.
        * 20% common real-world or scenario-based questions.
    - If Interview Type = "behavioral":
        * 80% commonly asked behavioral questions (teamwork, conflict, leadership, challenges).
        * 20% real-life workplace scenario questions.
    - If Interview Type = "hr":
        * Focus on standard HR questions asked in most interviews.
        * Include strengths, weaknesses, motivation, culture fit.
        * No technical questions.
    - If Interview Type = "mixed":
        * 40% frequently asked technical questions.
        * 30% commonly asked behavioral questions.
        * 30% standard scenario-based questions.

    ### Difficulty & Relevance:
    1. Match difficulty strictly to ${experience} years of experience.
    2. Questions should be realistic for actual interviews at this experience level.
    3. Avoid advanced topics unless commonly asked at this level.
    4. Each question must be directly relevant to the job role and description.

    ### Output Requirements:
    - Output exactly ${no_of_questions} questions.
    - Output strictly in JSON format only:

    {
      "questions": [
        { "type": "", "question": "" }
      ]
    }

    - Do NOT include explanations, headings, or extra text.
    - Do NOT include answers or hints.
    `.trim();
}
