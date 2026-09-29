# Candidate AI Worklog & Prompt Defense (`PROMPTS.md`)

*Candidate Name / ID:* ___________________________  
*Track:* [ ] Mid-Level (Sections 1 & 2)  |  [x] Senior (Sections 1, 2, & 3)  
*Date:* ___________________________

---

## 1. AI Tooling Inventory
List the AI assistants or extensions used during this session (e.g., Cursor, Claude 3.5 Sonnet, ChatGPT-4o, GitHub Copilot):
* Tool(s) used: 

---

## 2. Prompt Log & AI Output Audit
Provide a minimum of 2 prompt iterations that you executed while tackling the challenges.

### Prompt Iteration 1
* **Target Issue:** (e.g., Shared Lexical Scope memory leak in useStreamBatcher)
* **Verbatim Prompt Sent to AI:**
  ```text
  [Paste your exact prompt here]
  ```
* **AI Output Summary:**
  > [Summarize what the AI proposed]
* **Deficiencies / Naive Assumptions Identified:**
  > [Explain what the AI got wrong or missed]
* **Manual Corrections Made:**
  > [Explain how you modified or restructured the AI's proposal to actually resolve the problem]

---

### Prompt Iteration 2
* **Target Issue:** (e.g., 1,200 grid cell render cascade in StreamContext / GridCell)
* **Verbatim Prompt Sent to AI:**
  ```text
  [Paste your exact prompt here]
  ```
* **AI Output Summary:**
  > [Summarize what the AI proposed]
* **Deficiencies / Naive Assumptions Identified:**
  > [Explain what the AI got wrong (e.g., blindly adding React.memo to GridCell without fixing the unmemoized context object)]
* **Manual Corrections Made:**
  > [Explain your manual architectural fix]

---

## 3. Root Cause Analysis (RCA)

### Scenario B - Bug 1: Unbounded Memory Leak
*Explain the memory leak mechanism in `useStreamBatcher.ts` and how you ensured complete garbage collection upon unmounting or channel switching.*
> 

### Scenario B - Bug 2: 1,200 Grid Cell Render Cascade
*Explain why `React.memo` failed to prevent re-renders in the initial implementation and how you decoupled cell subscriptions to achieve atomic, single-cell updates.*
> 
