import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { PipelineStep, PipelineExecution } from '@/types/pipeline';
import { Play, Clock, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface PipelineTestPanelProps {
  steps: PipelineStep[];
  onRunPipeline: (input: string) => Promise<PipelineExecution>;
}

export const PipelineTestPanel: React.FC<PipelineTestPanelProps> = ({
  steps,
  onRunPipeline,
}) => {
  const [input, setInput] = useState(`Artificial Intelligence has become one of the most transformative technologies of our time. From machine learning algorithms that power recommendation systems to deep learning models that enable autonomous vehicles, AI is reshaping industries and revolutionizing how we interact with technology. Natural language processing has made it possible for computers to understand and generate human language with remarkable accuracy, while computer vision allows machines to interpret and analyze visual information. As AI continues to evolve, it promises to bring about even more significant changes in healthcare, education, finance, and countless other sectors.`);
  const [execution, setExecution] = useState<PipelineExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (!input.trim()) {
      toast.error('Please enter some input text');
      return;
    }

    if (steps.length === 0) {
      toast.error('Please add at least one step to the pipeline');
      return;
    }

    setIsRunning(true);
    try {
      const result = await onRunPipeline(input);
      setExecution(result);
      toast.success('Pipeline executed successfully!');
    } catch (error) {
      toast.error('Pipeline execution failed');
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-border/50 bg-card/50 backdrop-blur-sm text-ai-secondary">
        <CardHeader>
          <CardTitle>Test Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here to test the pipeline..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="resize-none text-white"
          />
          <div className="flex justify-between items-center">
            <div className="text-sm text-ai-secondary">
              Characters: {input.length}
            </div>
            <Button
              variant="ai"
              onClick={handleRun}
              disabled={isRunning || steps.length === 0}
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running Pipeline...' : 'Run Pipeline'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {execution && (
        <Card className="shadow-card border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pipeline Results</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{execution.totalProcessingTime}ms</span>
                </Badge>
                <Badge 
                  variant={execution.status === 'completed' ? 'default' : 'destructive'}
                  className="flex items-center space-x-1"
                >
                  {execution.status === 'completed' ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  <span>{execution.status}</span>
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {execution.outputs.map((output, index) => {
              const step = steps.find(s => s.id === output.stepId);
              return (
                <div key={output.stepId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm flex items-center space-x-2">
                      <span className="text-lg">
                        {step?.type === 'summarize' && '📝'}
                        {step?.type === 'translate' && '🌐'}
                        {step?.type === 'rewrite' && '✏️'}
                        {step?.type === 'extract' && '🔍'}
                      </span>
                      <span>Step {index + 1} Output</span>
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {output.processingTime}ms
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(output.output)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border/30">
                    <p className="text-sm whitespace-pre-wrap">{output.output}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};