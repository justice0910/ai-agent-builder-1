import type { PipelineStep, PipelineExecution, StepConfig } from '../types/pipeline';

// Mock AI service that simulates pipeline execution
export class MockAiService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async executePipeline(steps: PipelineStep[], input: string): Promise<PipelineExecution> {
    const execution: PipelineExecution = {
      id: `exec-${Date.now()}`,
      pipelineId: 'mock-pipeline',
      input,
      outputs: [],
      totalProcessingTime: 0,
      status: 'running',
      createdAt: new Date().toISOString(),
    };

    let currentInput = input;
    const startTime = Date.now();

    for (const step of steps.sort((a, b) => a.order - b.order)) {
      const stepStartTime = Date.now();
      
      // Simulate processing time
      await this.delay(Math.random() * 1000 + 500);
      
      const output = await this.executeStep(step, currentInput);
      const processingTime = Date.now() - stepStartTime;

      execution.outputs.push({
        stepId: step.id,
        output,
        processingTime,
      });

      currentInput = output; // Pass output to next step
    }

    execution.totalProcessingTime = Date.now() - startTime;
    execution.status = 'completed';

    return execution;
  }

  private async executeStep(step: PipelineStep, input: string): Promise<string> {
    switch (step.type) {
      case 'summarize':
        return this.mockSummarize(input, step.config);
      case 'translate':
        return this.mockTranslate(input, step.config);
      case 'rewrite':
        return this.mockRewrite(input, step.config);
      case 'extract':
        return this.mockExtract(input, step.config);
      default:
        return input;
    }
  }

  private mockSummarize(input: string, config: StepConfig): string {
    const sentences = input.split(/[.!?]+/).filter(s => s.trim());
    const { length = 'medium', format = 'paragraph' } = config;

    let summaryLength;
    switch (length) {
      case 'short':
        summaryLength = Math.min(2, sentences.length);
        break;
      case 'long':
        summaryLength = Math.min(6, sentences.length);
        break;
      default:
        summaryLength = Math.min(4, sentences.length);
    }

    const selectedSentences = sentences.slice(0, summaryLength);
    
    if (format === 'bullets') {
      return selectedSentences.map(s => `• ${s.trim()}`).join('\n');
    } else if (format === 'outline') {
      return selectedSentences.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n');
    }
    
    return selectedSentences.join('. ') + '.';
  }

  private mockTranslate(input: string, config: StepConfig): string {
    const { targetLanguage = 'English' } = config;
    
    // Mock translations (in a real app, this would call a translation API)
    const mockTranslations: Record<string, string> = {
      Spanish: input.replace(/AI|artificial intelligence/gi, 'Inteligencia Artificial')
        .replace(/technology/gi, 'tecnología')
        .replace(/machine learning/gi, 'aprendizaje automático'),
      French: input.replace(/AI|artificial intelligence/gi, 'Intelligence Artificielle')
        .replace(/technology/gi, 'technologie')
        .replace(/machine learning/gi, 'apprentissage automatique'),
      German: input.replace(/AI|artificial intelligence/gi, 'Künstliche Intelligenz')
        .replace(/technology/gi, 'Technologie')
        .replace(/machine learning/gi, 'maschinelles Lernen'),
    };

    return mockTranslations[targetLanguage] || `[Translated to ${targetLanguage}] ${input}`;
  }

  private mockRewrite(input: string, config: StepConfig): string {
    const { tone = 'professional', style = 'informative' } = config;

    let rewritten = input;

    // Mock tone adjustments
    switch (tone) {
      case 'casual':
        rewritten = input.replace(/sophisticated|advanced/gi, 'cool')
          .replace(/Furthermore|Moreover/gi, 'Also')
          .replace(/significant/gi, 'big');
        break;
      case 'formal':
        rewritten = input.replace(/cool|awesome/gi, 'sophisticated')
          .replace(/big/gi, 'significant')
          .replace(/Also/gi, 'Furthermore');
        break;
      case 'friendly':
        rewritten = `Hey there! ${input.replace(/\./g, '!')}`;
        break;
      case 'academic':
        rewritten = input.replace(/AI/g, 'Artificial Intelligence systems')
          .replace(/will/g, 'are anticipated to');
        break;
    }

    // Mock style adjustments
    switch (style) {
      case 'concise':
        return rewritten.split('.').slice(0, 2).join('.') + '.';
      case 'detailed':
        return rewritten + ' This represents a paradigm shift in computational capabilities and human-machine interaction.';
      case 'persuasive':
        return `Consider this: ${rewritten} The implications are undeniable.`;
    }

    return rewritten;
  }

  private mockExtract(input: string, config: StepConfig): string {
    const { extractType = 'keywords' } = config;

    switch (extractType) {
      case 'keywords':
        { const keywords = ['AI', 'machine learning', 'technology', 'algorithms', 'artificial intelligence', 'automation'];
        const foundKeywords = keywords.filter(keyword => 
          input.toLowerCase().includes(keyword.toLowerCase())
        );
        return `Keywords: ${foundKeywords.join(', ')}`; }

      case 'entities':
        return 'Named Entities: Artificial Intelligence, machine learning, deep learning, natural language processing, computer vision';

      case 'topics':
        return 'Main Topics: Technology Innovation, AI Applications, Machine Learning, Industry Transformation';

      case 'sentiment':
        return 'Sentiment Analysis: Positive (0.85) - Optimistic tone regarding AI advancements and future potential';

      default:
        return input;
    }
  }
}