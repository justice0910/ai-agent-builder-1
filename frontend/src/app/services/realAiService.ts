import { groq } from '@ai-sdk/groq';
import type { PipelineStep, PipelineExecution, StepConfig } from '../../types/pipeline';

// Real AI service using Groq for pipeline execution
export class RealAiService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private client: any;

  constructor() {
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_AI_API_KEY environment variable is required');
    }
    
    this.client = groq(apiKey);
    console.log('🤖 Real AI Service initialized with Groq');
  }

  async executePipeline(steps: PipelineStep[], input: string): Promise<PipelineExecution> {
    const execution: PipelineExecution = {
      id: `exec-${Date.now()}`,
      pipelineId: 'real-pipeline',
      input,
      outputs: [],
      totalProcessingTime: 0,
      status: 'running',
      createdAt: new Date().toISOString(),
    };

    let currentInput = input;
    const startTime = Date.now();

    try {
      for (const step of steps.sort((a, b) => a.order - b.order)) {
        const stepStartTime = Date.now();
        
        console.log(`🔄 Executing step: ${step.type}`);
        const output = await this.executeStep(step, currentInput);
        const processingTime = Date.now() - stepStartTime;

        execution.outputs.push({
          stepId: step.id,
          output,
          processingTime,
        });

        currentInput = output; // Pass output to next step
        console.log(`✅ Step completed: ${step.type} (${processingTime}ms)`);
      }

      execution.totalProcessingTime = Date.now() - startTime;
      execution.status = 'completed';
      console.log(`🎉 Pipeline completed in ${execution.totalProcessingTime}ms`);

    } catch (error) {
      console.error('❌ Pipeline execution failed:', error);
      execution.status = 'failed';
      execution.totalProcessingTime = Date.now() - startTime;
      throw error; // Re-throw to prevent showing fake results
    }

    return execution;
  }

  private async executeStep(step: PipelineStep, input: string): Promise<string> {
    switch (step.type) {
      case 'summarize':
        return this.summarize(input, step.config);
      case 'translate':
        return this.translate(input, step.config);
      case 'rewrite':
        return this.rewrite(input, step.config);
      case 'extract':
        return this.extract(input, step.config);
      default:
        return input;
    }
  }

  private async summarize(input: string, config: StepConfig): Promise<string> {
    const { length = 'medium', format = 'paragraph' } = config;
    
    const prompt = `Please summarize the following text. 
    
Requirements:
- Length: ${length} (short: 1-2 sentences, medium: 3-4 sentences, long: 5-6 sentences)
- Format: ${format} (paragraph: continuous text, bullets: bullet points, outline: numbered list)

Text to summarize:
"${input}"

Please provide only the summary without any additional explanations.`;

    try {
      // Use the correct Groq API - it's 'complete' not 'generateText'
      const result = await this.client.complete({
        prompt,
        model: 'llama3-8b-8192',
        temperature: 0.3,
        maxTokens: 500,
      });

      if (!result.text) {
        throw new Error('No response text received from Groq');
      }

      return result.text;
    } catch (error) {
      console.error('❌ Summarize step failed:', error);
      throw new Error(`Summarize failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async translate(input: string, config: StepConfig): Promise<string> {
    const { targetLanguage = 'Spanish' } = config;
    
    const prompt = `Please translate the following text to ${targetLanguage}. 
    
Text to translate:
"${input}"

Please provide only the translation without any additional explanations or notes.`;

    try {
      const result = await this.client.complete({
        prompt,
        model: 'llama3-8b-8192',
        temperature: 0.2,
        maxTokens: 1000,
      });

      if (!result.text) {
        throw new Error('No response text received from Groq');
      }

      return result.text;
    } catch (error) {
      console.error('❌ Translate step failed:', error);
      throw new Error(`Translate failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async rewrite(input: string, config: StepConfig): Promise<string> {
    const { tone = 'professional', style = 'informative' } = config;
    
    const prompt = `Please rewrite the following text with the specified tone and style.

Original text:
"${input}"

Requirements:
- Tone: ${tone} (casual: relaxed and informal, formal: proper and respectful, professional: business-like, friendly: warm and approachable, academic: scholarly and detailed)
- Style: ${style} (concise: brief and to the point, detailed: comprehensive and thorough, persuasive: convincing and compelling, informative: educational and explanatory)

Please provide only the rewritten text without any additional explanations.`;

    try {
      const result = await this.client.complete({
        prompt,
        model: 'llama3-8b-8192',
        temperature: 0.4,
        maxTokens: 1000,
      });

      if (!result.text) {
        throw new Error('No response text received from Groq');
      }

      return result.text;
    } catch (error) {
      console.error('❌ Rewrite step failed:', error);
      throw new Error(`Rewrite failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async extract(input: string, config: StepConfig): Promise<string> {
    const { extractType = 'keywords' } = config;
    
    let prompt = '';
    
    switch (extractType) {
      case 'keywords':
        prompt = `Please extract the most important keywords from the following text. Return them as a comma-separated list.

Text: "${input}"`;
        break;
      case 'entities':
        prompt = `Please identify and extract named entities (people, organizations, locations, dates, etc.) from the following text. Return them as a structured list.

Text: "${input}"`;
        break;
      case 'topics':
        prompt = `Please identify the main topics and themes from the following text. Return them as a structured list.

Text: "${input}"`;
        break;
      case 'sentiment':
        prompt = `Please analyze the sentiment of the following text and provide a brief analysis including the overall sentiment (positive/negative/neutral) and confidence level.

Text: "${input}"`;
        break;
      default:
        return input;
    }

    try {
      const result = await this.client.complete({
        prompt,
        model: 'llama3-8b-8192',
        temperature: 0.3,
        maxTokens: 500,
      });

      if (!result.text) {
        throw new Error('No response text received from Groq');
      }

      return result.text;
    } catch (error) {
      console.error('❌ Extract step failed:', error);
      throw new Error(`Extract failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const realAiService = new RealAiService(); 