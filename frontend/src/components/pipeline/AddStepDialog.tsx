import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { type StepType, STEP_CONFIGS } from '../../types/pipeline';

interface AddStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectStep: (stepType: StepType) => void;
}

export const AddStepDialog: React.FC<AddStepDialogProps> = ({
  open,
  onOpenChange,
  onSelectStep,
}) => {
  const handleSelectStep = (stepType: StepType) => {
    onSelectStep(stepType);
    onOpenChange(false);
  };

  return (
    <>
      {/* @ts-ignore */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* @ts-ignore */}
        <DialogContent className="max-w-2xl">
          {/* @ts-ignore */}
          <DialogHeader>
            {/* @ts-ignore */}
            <DialogTitle>Add Pipeline Step</DialogTitle>
            {/* @ts-ignore */}
            <DialogDescription>
              Choose the type of AI operation to add to your pipeline
            </DialogDescription>
          </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {Object.entries(STEP_CONFIGS).map(([type, config]) => (
            <Card
              key={type}
              className="cursor-pointer transition-all duration-200 hover:shadow-card hover:scale-105 border-border/50 bg-card/50 backdrop-blur-sm"
              onClick={() => handleSelectStep(type as StepType)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center shadow-ai`}>
                    <span className="text-2xl">{config.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{config.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {config.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {Object.keys(config.options).map((option) => (
                    <span
                      key={option}
                      className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};