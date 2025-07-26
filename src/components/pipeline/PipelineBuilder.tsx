import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { PipelineStep as PipelineStepComponent } from './PipelineStep';
import { AddStepDialog } from './AddStepDialog';
import { StepConfigDialog } from './StepConfigDialog';
import type { PipelineStep, StepType, StepConfig } from '../../types/pipeline';
import { Plus, Play, Save } from 'lucide-react';

interface PipelineBuilderProps {
  steps: PipelineStep[];
  onStepsChange: (steps: PipelineStep[]) => void;
  onRunPipeline: () => void;
  onSavePipeline: () => void;
  isRunning?: boolean;
}

export const PipelineBuilder: React.FC<PipelineBuilderProps> = ({
  steps,
  onStepsChange,
  onRunPipeline,
  onSavePipeline,
  isRunning = false,
}) => {
  const [addStepOpen, setAddStepOpen] = useState(false);
  const [configStep, setConfigStep] = useState<PipelineStep | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over?.id);

      const newSteps = arrayMove(steps, oldIndex, newIndex).map((step, index) => ({
        ...step,
        order: index,
      }));

      onStepsChange(newSteps);
    }
  };

  const addStep = (stepType: StepType) => {
    const newStep: PipelineStep = {
      id: `step-${Date.now()}`,
      type: stepType,
      config: getDefaultConfig(stepType),
      order: steps.length,
    };

    onStepsChange([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    const newSteps = steps
      .filter((step) => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index }));
    onStepsChange(newSteps);
  };

  const configureStep = (stepId: string) => {
    const step = steps.find((s) => s.id === stepId);
    if (step) {
      setConfigStep(step);
      setConfigOpen(true);
    }
  };

  const saveStepConfig = (stepId: string, config: StepConfig) => {
    const newSteps = steps.map((step) =>
      step.id === stepId ? { ...step, config } : step
    );
    onStepsChange(newSteps);
  };

  const getDefaultConfig = (stepType: StepType): StepConfig => {
    switch (stepType) {
      case 'summarize':
        return { length: 'medium', format: 'paragraph' };
      case 'translate':
        return { targetLanguage: 'English' };
      case 'rewrite':
        return { tone: 'professional', style: 'informative' };
      case 'extract':
        return { extractType: 'keywords' };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 text-ai-secondary">
              <span>Pipeline Steps</span>
              {steps.length > 0 && (
                <span className="text-sm font-normal text-ai-secondary">
                  ({steps.length} step{steps.length !== 1 ? 's' : ''})
                </span>
              )}
            </CardTitle>
            <div className="flex space-x-2">
              <div
                className='flex justify-between items-center text-ai-secondary gap-1'
                onClick={() => setAddStepOpen(true)}
              >
                <Plus className="w-4 h-4 mt-1" />
                <p>
                  Add Step
                </p>
              </div>
              {steps.length > 0 && (
                <>
                  <Button
                    variant="ai"
                    size="sm"
                    onClick={onRunPipeline}
                    disabled={isRunning}
                  >
                    <Play className="w-4 h-4" />
                    {isRunning ? 'Running...' : 'Run Pipeline'}
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={onSavePipeline}
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {steps.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-secondary rounded-xl flex items-center justify-center">
                <Plus className="w-8 h-8 text-ai-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-ai-secondary">No steps added yet</h3>
              <p className="text-ai-secondary mb-4">
                Start building your AI pipeline by adding your first step
              </p>
              <div
                className='text-ai-secondary flex justify-center items-center gap-1'
                onClick={() => setAddStepOpen(true)}
              >
                <Plus className="w-4 h-4 mt-1" />
                <div>
                  Add First Step
                </div>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={steps.map((step) => step.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {steps.map((step, index) => (
                    <PipelineStepComponent
                      key={step.id}
                      step={step}
                      isLast={index === steps.length - 1}
                      onRemove={removeStep}
                      onConfigure={configureStep}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <AddStepDialog
        open={addStepOpen}
        onOpenChange={setAddStepOpen}
        onSelectStep={addStep}
      />

      <StepConfigDialog
        step={configStep}
        open={configOpen}
        onOpenChange={setConfigOpen}
        onSave={saveStepConfig}
      />
    </div>
  );
};