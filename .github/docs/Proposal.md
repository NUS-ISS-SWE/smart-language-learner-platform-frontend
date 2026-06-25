Project Title: Smart Language Learner Platform

Project Team Requirements: Team of 6 persons

Sponsoring Company: NUS-ISS

Sponsor: Darryl, NUS-ISS

The goal of this project is to have a deployable learning + AI writing + grading platform.

The backlog will be structured into core system domains:

✅ User Management
✅ Composition Writing Generator
✅ Evaluation & Grading Engine
✅ Framework / Rubric Engine
✅ Knowledge Teaching Module (idioms + show-not-tell phrases)
✅ Document Processing Pipeline
✅ Refinement Writing Engine
✅ Analytics & Feedback System
✅ Admin & Content Management
✅ Security & Performance

⭐ Assumptions for V1 Production System

Target users:
Students
Parents/Teachers
Self-learning writers
Supported languages:
English composition
Chinese composition
Input formats:
Online editor writing
Upload files: PDF, DOCX, PPTX, TXT
Core intelligence:
Rule-based + AI-assisted grading engine (recommended hybrid architecture)
⭐ USER STORIES BACKLOG — VERSION 1 PRODUCTION READY

This version is structured for production-ready product development and is optimized for:

✅ Individual student subscription model
✅ Personal learning AI assistant style platform
✅ Usage-based or tiered SaaS pricing
✅ Self-service onboarding
✅ Commercial launch readiness

⭐ Product Vision — Individual User SaaS Composition Learning Platform
The platform enables individual learners to:

✅ Generate compositions
✅ Receive AI grading and feedback
✅ Learn writing techniques
✅ Upload personal documents
✅ Improve writing quality using refinement engine
✅ Subscribe to learning plans

MODULE 1 — User Authentication & Personal Account Management
US-1.1 User Registration, Login and Security
Tasks (24 hours)
Design user schema
Implement registrstion and authentication API
Password hashing encryption + security validation
Token session management
Email verification workflow
Acceptance Criteria
✅ User can register account and login/logout
✅ Password is securely stored
✅ Session authentication works
✅ Email verification is required

US-1.2 User Profile Management

Tasks (8 hours)

Create profile database schema
Implement profile update API
Allow language preference selection
Acceptance Criteria

User can edit profile
User can select:
English / Chinese learning mode
US-2 User Profile Learning Preference Settings
Allow users to configure:

Preferred language (English / Chinese)
Writing difficulty level
Learning mode
Tasks (12 hours)
Profile database design
Preference UI
Preference persistence API
Acceptance Criteria
✅ User can update learning preferences

MODULE 2 — Personal SaaS Subscription System ⭐⭐⭐
US-3 Subscription Billing Engine
Recommended Payment Provider:

Stripe (company)
Supported Plans
Free Trial
Basic Writing Assistant
Premium AI Grading + Refinement
Tasks (60 hours)
Pricing plan database
Payment API integration
Webhook event processing
Subscription state management
Auto renewal system
Acceptance Criteria
✅ User can subscribe
✅ Payment updates account status
✅ Expired subscription blocks premium features

US-4 Usage Quota Control Engine ⭐⭐⭐⭐
This is critical for SaaS profitability.

Tasks (50 hours)
Build Usage tracking middleware
Track user usage:
Composition evaluation count
AI generation count
Upload processing count
Add Redis rate limiter
Implement Quota validation pipeline and/or quota enforcement API
Acceptance Criteria
✅ User cannot exceed plan quota
✅ System shows quota usage

MODULE 3 — AI Composition Writing Engine ⭐⭐⭐⭐
US-5 Generate Composition Based on Title + Framework
Tasks (48 hours)
Build Prompt orchestration layer
Language detection
Integrate AI text generation model
Support framework selection:
Five Paragraph Essay
起承转合 structure
PEEL paragraph structure
Length control module
Output quality filtering
Acceptance Criteria
✅ System generates composition when user inputs:

Title
Language
Framework
✅ Composition generated is logical, coherent and structured

US-6 Technique-Based Writing Mode
Tasks (30 hours)
Build technique tagging system
Add generation constraint rules
Supported Techniques:
Show-Don’t-Tell writing
Narrative storytelling
Argumentative writing
Writing rule engine
Phrase recommendation integration
Acceptance Criteria
✅ Composition Output follows selected technique

MODULE 4 — AI Composition Evaluation Engine ⭐⭐⭐⭐⭐ (Core Product Value)
US-7 Automatic Composition Scoring
Evaluate dimensions:

English Composition

Structure quality
Vocabulary
Grammar correctness
Idea development
Coherence
Creativity level
Chinese Composition

起承转合 completeness
Character expression
情感深度
描写质量
Tasks (90 hours)
Design Rubric scoring engine
NLP feature extraction pipeline
Integrate NLP analysis
Embedding similarity scoring
Model inference service
Train scoring model (if ML is used)
Implement scoring explanation generator
Acceptance Criteria
✅ Score output range 0–100
✅ Score breakdown is shown

Strengths
Weaknesses
Improvement suggestions
US-8 Explainable AI Feedback Generator ⭐⭐⭐
Tasks (60 hours)
Feedback generator model
Text segment mapping
Visualization API
Acceptance Criteria
✅ User understands why score is given.

✅ Output must include:

Strengths
Weaknesses
Evidence text segments
Improvement suggestions
US-9 Show-Don’t-Tell Detection Engine
Detect writing style quality.

Tasks (70 hours)
Create emotion expression classifier
Emotion classifier model
Build phrase pattern detection
Pattern recognition engine
Create Action-based description detector
Acceptance Criteria
✅ Direct emotion telling is detected

✅ Alternative descriptive suggestions are provided

✅ Descriptive showing phrases

Example Feedback:

"Try replacing 'I was sad' with sensory description."
MODULE 5 Framework & Rubric Management Module

US-5 Admin Can Configure Grading Rubrics

Tasks (30 hours)

Build rubric database schema
Create rubric editor UI
Support:
Weight adjustment
Criteria addition
Acceptance Criteria

Admin can modify scoring rules without code change.
MODULE 6 — Personal Knowledge Learning Assistant ⭐
US-10 High-Scoring Vocabulary & Idiom Library
Supports:

Advanced English vocabulary
Chinese 成语
Model sentence examples
Tasks (30 hours)
Phrase database design
Semantic search indexing
Build phrase knowledge database
Categorize phrases:
Emotion
Scene
Action
Contrast
Acceptance Criteria
✅ User can search phrases

✅ System shows usage examples

US-11 Contextual (Show-Not-Tell ) Phrase Recommendation Engine
Tasks (50 hours)
Build Phrase Embedding similarity search
Recommend phrases based on composition topic
Context-aware suggestion logic
Acceptance Criteria
✅ Writing improvement phrases are suggested

MODULE 7 — Document Upload Processing
US-12 Support Personal Document / File Upload Evaluation
Supported Formats:

PDF
DOCX
PPTX
TXT
Tasks (60 hours)
Implement file parser layer
Extract text from documents
Clean formatting noise
Parsing pipeline
Text cleaning engine
Acceptance Criteria
✅ Uploaded document converted into analyzable text andcan be evaluated

MODULE 8 — Writing Refinement Engine ⭐
US-13 Generate Improved Composition Version
Output must show:

Original composition
Refined improved version
Tasks (80 hours)
Rewrite AI model integration
Grammar correction module
Style enhancement engine
Improve:
Grammar
Flow
Description quality
Acceptance Criteria
✅ Meaning is preserved
✅ Writing quality is improved

✅ System outputs:

Original version
Refined version
MODULE 9 — Personal Learning Dashboard
US-14.1 Writing/Learning Progress Tracking Dashboard
Show:

Average score trend
Weakness categories
Improvement metrics
Tasks (50 hours)
Analytics aggregation pipeline
Visualization UI
Acceptance Criteria
✅ User can track learning progress

US-14.2 Composition Quality Heatmap

Show:

Grammar weakness
Vocabulary level
Structure strength
MODULE 10. Admin Content Moderation System

US-15 Knowledge Content Management

Admin can:

Add idioms
Update examples
Remove incorrect phrases
MODULE 10 — Security Protection Layer & Performance Requirements
US-16.1 Input Protection System
Protect platform from:

Prompt injection attacks
Malicious document uploads
Tasks (40 hours)
Input sanitization engine
Sandbox processing
Acceptance Criteria
✅ Platform rejects malicious inputs

US-16.2 Data Security

Encryption at rest
Role-based access control
US-16.3 System Performance Target

Composition evaluation response time < 8 seconds
Upload processing < 15 seconds
MODULE 11 — Cost Optimization Layer
US-17 Smart Evaluation Result Caching
Tasks (30 hours)
Composition hashing
Cache storage system
Acceptance Criteria
✅ Repeated evaluation is cached

⭐ Total Estimated Development Effort
Module

Hours

Authentication

24

Billing SaaS Layer

60

AI Writing Engine

78

AI Grading Engine

160

Learning Assistant

80

Upload Processing

60

Security + Optimization

70

Dashboard + Monitoring

50

👉 Total V1 Effort ≈ 540 – 600 hours

⭐ Recommended Technical Architecture (V1 Production)

Backend

Python AI service (recommended)
NLP Layer

Transformer-based model or API-based LLM
Database

Structured data → MySQL
Knowledge phrases → Vector database
⭐ Estimated Overall Development Effort

Module

Hours

Authentication

22

Writing Generation

40

Grading Engine

80

Knowledge Module

68

Upload Pipeline

50

Refinement Engine

70

Dashboard

40

Security

20

👉 Total V1 estimate ≈ 390 – 450 development hours

⭐ Overall Architecture — Hybrid AI Grading System
High-Level Layers
User Input
↓
Frontend Editor / Upload Gateway
↓
Document Processing Layer
↓
NLP Feature Extraction Engine
↓
Scoring Intelligence Layer
↓
Knowledge Feedback Generator
↓
Refinement Writing Engine
↓
Result Presentation API

⭐ Core AI Components (Production Design)
1. Input Processing Layer
Responsibilities
Handle:
Online composition typing
PDF / DOCX / PPTX upload
Implementation Stack
File parsing:
Python document libraries
OCR if needed
Recommended Tools:

Text extraction → preprocessing normalization
Tasks:

Remove formatting noise
Sentence segmentation
Language detection
2. Feature Extraction Engine (Very Important ⭐⭐⭐)
This is the heart of grading AI.

Extract These Features
✅ Structural Features
English Composition:

Introduction presence
Body paragraph count
Conclusion detection
Chinese Composition:

起承转合 completeness detection
✅ Semantic Features
Use embedding models.

Recommended Technology:

Transformer-based encoder models
Example Models:

BERT family models
Sentence embedding models
Purpose:

Measure idea development quality
Detect repetition
✅ Linguistic Quality Features
Evaluate:

Vocabulary richness
Grammar correctness
Sentence diversity
Tools:

Language grammar checkers
Statistical metrics
3. Scoring Intelligence Layer ⭐ (Most Commercially Critical)
Hybrid Scoring Strategy (Recommended)
Final Score =

Score =

0.25 × Structure Score
+ 0.25 × Language Quality Score
+ 0.25 × Semantic Development Score
+ 0.25 × Creativity / Technique Score

Structure Scoring Module
Detect:

Paragraph organization
Logical flow
Techniques:

Rule-based detection
Neural classification model
Semantic Development Scoring
Measure:

Idea expansion depth
Topic consistency
Method:

Cosine similarity between paragraphs and theme embedding.
Creativity Scoring (Advanced Feature)
Evaluate:

Show-don’t-tell usage
Emotional expression
Narrative progression
Use classification model trained on high-quality compositions.

4. Feedback Generation Engine ⭐⭐⭐ (Differentiator Feature)
This is what makes the product valuable.

System must output:

✅ Score explanation
✅ Strengths
✅ Weaknesses
✅ Improvement advice
✅ Sample improved sentence

Implementation Approach:

Step 1
Identify weak segments.

Step 2
Map weakness → knowledge recommendation database.

Example Mapping:

Weakness

Feedback

Direct emotion telling

Suggest sensory description

5. Refinement Writing Engine (AI Rewrite System)
Use Large Language Model reasoning.

You can build on:

OpenAI models or similar APIs.
Functions:

Grammar correction
Flow improvement
Show-not-tell enhancement
Important Control Rule:

Add constraint prompts so AI does not completely rewrite student work (preserve originality).

6. Knowledge Graph + Teaching Database ⭐
This is a major competitive advantage.

Build structured knowledge storage.

Include:

English
Advanced vocabulary list
Idiom usage database
Show-don’t-tell phrase repository
Chinese
成语库
描写句型库
起承转合 example database
Implementation Option:

Vector database search
Recommended technology:

Embedding similarity search
7. Document Intelligence Pipeline
Use streaming pipeline:

Upload → Parsing → Cleaning → Feature Extraction → Scoring → Feedback Generation

Must support batch evaluation later.

8. Model Training Strategy (If You Want World-Class Quality ⭐)
Dataset Requirements
You need:

High-score compositions
Medium-score compositions
Low-score compositions
Labeling dimensions:

Grammar
Structure
Creativity
Expression depth
Training Method:

Supervised learning classification
Ranking model (preferred)
⭐ System Deployment Architecture
Backend Microservices
Recommend splitting services:

API Gateway Service
Handles authentication + routing.

AI Inference Service
Runs model scoring and feedback generation.

Use GPU inference if possible.

Knowledge Retrieval Service
Vector search engine.

⭐ Database Design Choice
Structured Data
PostgreSQL
Vector Embedding Storage
Vector database such as:
FAISS
Weaviate
Pinecone
⭐ Latency Performance Targets (Production)
Operation

Target

Composition Scoring

< 8 sec

Upload Processing

< 15 sec

Feedback Generation

< 10 sec

⭐ Biggest Technical Risks (Very Important)
1. Overfitting to Writing Style
Solution:

Diversify training dataset.
2. AI Hallucination in Feedback
Solution:

Use constrained prompt generation.
3. Evaluation Bias
Solution:

Human validation loop.
5 major risks domains:

✅ AI Model Risk
✅ Data Risk
✅ System Architecture Risk
✅ Product Accuracy Risk (Most Important for Grading System)
✅ Operational / Cost Risk

⭐ 1. AI Model Risk (Highest Severity ⭐⭐⭐⭐⭐)
⚠️ Risk: Grading Accuracy vs Human Examiner
Problem
Composition grading is subjective.

If AI scoring deviates too much from real teacher marking → platform loses credibility.

Mitigation Strategy
Use Hybrid Evaluation Architecture

Rule-based scoring + Embedding similarity + LLM reasoning + Optional human validation

Recommended Approach:

Train ranking model rather than absolute scoring model.
⚠️ Risk: Hallucinated Feedback Generation
Large language models may generate:

Incorrect grammar explanations
False writing advice
Made-up rules
Solution
Implement Grounded Feedback Generation

Steps:

Extract evidence segments from composition.
Generate feedback only based on extracted text.
⭐ 2. Data Risk (Very Critical for Commercialization)
⚠️ Risk: Lack of High-Quality Training Dataset
You need thousands of labeled compositions.

Without this:

Scoring engine will be unstable.
Required Dataset Types
Level

Quantity Target

High Score Composition

3000+

Medium Score Composition

3000+

Low Score Composition

3000+

⚠️ Risk: Copyright Issues
If training data comes from student compositions or published materials:

You must ensure legal usage.

Mitigation:

Use licensed datasets.
Or generate synthetic training compositions.
⭐ 3. System Architecture Risk
⚠️ Risk: Latency Explosion
Composition grading involves:

Parsing
Embedding computation
Model inference
Feedback generation
If not optimized:

→ User experience will be bad.

Production Fix
Use asynchronous pipeline architecture.

Upload → Queue → Process → Cache Result → Return Output

⚠️ Risk: GPU Cost Overrun
If using heavy LLM inference:

Cloud cost can explode.

Cost Optimization Methods
Cache evaluation results.
Use smaller domain-specific models.
Batch evaluation when possible.
⭐ 4. Product Accuracy Risk (MOST IMPORTANT FOR YOUR PLATFORM ⭐⭐⭐⭐⭐)
This is the biggest commercial failure risk.

Problem: Writing Quality Is Multi-Dimensional
Composition quality is not just grammar.

It includes:

Logical structure
Creativity
Emotional expression
Technique usage
Solution — Multi-Head Scoring Model
Use independent scoring modules:

Structure Score Head
Language Quality Head
Semantic Depth Head
Technique Usage Head
Then aggregate.

Risk: Show-Don’t-Tell Detection Failure
Detection of stylistic writing is hard.

Example failure case:

System may wrongly flag good writing as "not showing".

Mitigation:

Use similarity-based style recognition.
Train classifier using expert-marked compositions.
⭐ 5. Security Risk (Often Ignored but Important)
Data Privacy
You are handling student writing data.

Must comply with data protection standards.

If you are in Singapore → follow local data regulations.

Attack Risk
Potential attacks:

Prompt injection attack
Model manipulation
Upload malware document
Protection:

Input sanitization
Content scanning
Isolation sandbox processing
⭐ 6. Long-Term Commercial Risk (Startup Reality)
Market Risk
Competition from large AI writing platforms.

Your advantage must be:

👉 Education-specific grading intelligence
👉 Teacher-level feedback reasoning
👉 Local curriculum adaptation

Maintenance Risk
AI models require continuous tuning.

You need:

Monitoring dashboards
Performance drift detection
⭐ 7. Biggest Failure Point (If I Must Pick One)
If I were CTO of this project, I would worry most about this:

👉 Scoring credibility

If students or teachers do not trust the score → product fails.

Solution:

Allow:

Explainable AI grading
Human override verification
Transparent rubric mapping
⭐ Overall Technical Risk Level
Domain

Risk Level

AI Accuracy

⭐⭐⭐⭐⭐ High

Data Quality

⭐⭐⭐⭐

System Performance

⭐⭐⭐

Security

⭐⭐⭐

Cost Control

⭐⭐⭐⭐

⭐ Honest Expert Assessment (Startup Viability)
If executed properly:

✅ This platform can be commercially viable.

BUT only if you solve:

Grading trustworthiness problem
Feedback quality problem
Cost-efficient inference design