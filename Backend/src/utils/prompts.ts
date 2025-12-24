export function generateFeedback(conversation: any, questions: any) {
  return `
You are an expert technical interviewer and evaluator.

You will be given:
- A list of interview questions asked by the AI interviewer
- A conversation between an AI interviewer (role: "assistant") and a candidate (role: "user")

Your task is to evaluate the interview AND create a complete question-to-answer mapping.

IMPORTANT RULES (STRICT):
- Return ONLY a valid JSON object
- Do NOT wrap the output in backticks
- Do NOT return a JSON string
- Do NOT add explanations or extra text
- The response must be directly parsable by JSON.parse()

### Evaluation & Mapping Instructions:
1. Use the provided questions list as the SINGLE source of truth.
2. For EACH question in the questions list:
   - Find the candidate's corresponding answer from the conversation.
   - If the candidate did NOT answer that question, set "answer" to an empty string "".
3. Maintain the original question order.
4. Do NOT invent or infer answers.
5. Scores must be based ONLY on actual answers present in the conversation.
6. Scores must be decimals between 0.0 and 10.0.
7. overallScore must be the average of all scores, rounded to one decimal.
8. Incomplete or vague answers must reduce the relevant score.

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
    "confidenceScore": number
  },
  "summary": string
}

### Questions (JSON):
${JSON.stringify(questions, null, 2)}

### Conversation (JSON):
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
