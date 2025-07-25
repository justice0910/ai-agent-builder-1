import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { PipelineBuilder } from '../components/pipeline/PipelineBuilder';
import { PipelineTestPanel } from '../components/pipeline/PipelineTestPanel';
import type { PipelineStep, Pipeline, PipelineExecution } from '../types/pipeline';
import { MockAiService } from '../services/mockAiService';
import { toast } from 'sonner';

const mockAiService = new MockAiService();

export const Builder: React.FC = () => {
  const [currentPipeline, setCurrentPipeline] = useState<Pipeline>({
    id: 'default',
    name: 'My AI Pipeline',
    description: 'Custom AI processing workflow',
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleStepsChange = (steps: PipelineStep[]) => {
    setCurrentPipeline((prev: Pipeline) => ({
      ...prev,
      steps,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleRunPipeline = async (input: string): Promise<PipelineExecution> => {
    if (currentPipeline.steps.length === 0) {
      throw new Error('No steps in pipeline');
    }

    return mockAiService.executePipeline(currentPipeline.steps, input);
  };

  const handleSavePipeline = () => {
    // In a real app, this would save to backend
    localStorage.setItem('ai-agent-pipeline', JSON.stringify(currentPipeline));
    toast.success('Pipeline saved successfully!');
  };

  const handleRunFromBuilder = async () => {
    // This is called from the builder when user clicks "Run Pipeline"
    // For now, we'll just show a message that they should use the test panel
    toast.info('Use the Test Panel below to run your pipeline with custom input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            {currentPipeline.name}
          </h1>
          <p className="text-muted-foreground">
            {currentPipeline.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PipelineBuilder
              steps={currentPipeline.steps}
              onStepsChange={handleStepsChange}
              onRunPipeline={handleRunFromBuilder}
              onSavePipeline={handleSavePipeline}
            />
          </div>

          <div className="space-y-6">
            <PipelineTestPanel
              steps={currentPipeline.steps}
              onRunPipeline={handleRunPipeline}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Builder