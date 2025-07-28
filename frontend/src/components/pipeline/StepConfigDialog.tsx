/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type PipelineStep, type StepConfig, STEP_CONFIGS } from '@/types/pipeline';

interface StepConfigDialogProps {
  step: PipelineStep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (stepId: string, config: StepConfig) => void;
}

export const StepConfigDialog: React.FC<StepConfigDialogProps> = ({
  step,
  open,
  onOpenChange,
  onSave,
}) => {
  const [config, setConfig] = useState<StepConfig>({});

  useEffect(() => {
    if (step) {
      setConfig(step.config);
    }
  }, [step]);

  const handleSave = () => {
    if (step) {
      onSave(step.id, config);
      onOpenChange(false);
    }
  };

  if (!step) return null;

  const stepConfig = STEP_CONFIGS[step.type];

  const updateConfig = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* @ts-ignore */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* @ts-ignore */}
        <DialogContent>
          {/* @ts-ignore */}
          <DialogHeader>
            {/* @ts-ignore */}
            <DialogTitle className="flex items-center space-x-2">
              <span className="text-2xl">{stepConfig.icon}</span>
              <span>Configure {stepConfig.title}</span>
            </DialogTitle>
            {/* @ts-ignore */}
            <DialogDescription>
              Customize the settings for this pipeline step
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-4 py-4">
          {step.type === 'summarize' && (
            <>
              <div className="space-y-2">
                <Label>Summary Length</Label>
                {/* @ts-ignore */}
                <Select
                  value={config.length || 'medium'}
                  onValueChange={(value) => updateConfig('length', value)}
                >
                  {/* @ts-ignore */}
                  <SelectTrigger>
                    {/* @ts-ignore */}
                    <SelectValue />
                  </SelectTrigger>
                  {/* @ts-ignore */}
                  <SelectContent>
                    {/* @ts-ignore */}
                    <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                    {/* @ts-ignore */}
                    <SelectItem value="medium">Medium (3-5 sentences)</SelectItem>
                    {/* @ts-ignore */}
                    <SelectItem value="long">Long (6+ sentences)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                {/* @ts-ignore */}
                <Select
                  value={config.format || 'paragraph'}
                  onValueChange={(value) => updateConfig('format', value)}
                >
                  {/* @ts-ignore */}
                  <SelectTrigger>
                    {/* @ts-ignore */}
                    <SelectValue />
                  </SelectTrigger>
                  {/* @ts-ignore */}
                  <SelectContent>
                    {/* @ts-ignore */}
                    <SelectItem value="paragraph">Paragraph</SelectItem>
                    {/* @ts-ignore */}
                    <SelectItem value="bullets">Bullet Points</SelectItem>
                    {/* @ts-ignore */}
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step.type === 'translate' && (
            <div className="space-y-2">
              <Label>Target Language</Label>
              {/* @ts-ignore */}
              <Select
                value={config.targetLanguage || 'English'}
                onValueChange={(value) => updateConfig('targetLanguage', value)}
              >
                {/* @ts-ignore */}
                <SelectTrigger>
                  {/* @ts-ignore */}
                  <SelectValue />
                </SelectTrigger>
                {/* @ts-ignore */}
                <SelectContent>
                  {(stepConfig.options as any).targetLanguage?.map((lang: string) => (
                    /* @ts-ignore */
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {step.type === 'rewrite' && (
            <>
              <div className="space-y-2">
                <Label>Tone</Label>
                {/* @ts-ignore */}
                <Select
                  value={config.tone || 'professional'}
                  onValueChange={(value) => updateConfig('tone', value)}
                >
                  {/* @ts-ignore */}
                  <SelectTrigger>
                    {/* @ts-ignore */}
                    <SelectValue />
                  </SelectTrigger>
                  {/* @ts-ignore */}
                  <SelectContent>
                    {(stepConfig.options as any).tone?.map((tone: string) => (
                      /* @ts-ignore */
                      <SelectItem key={tone} value={tone}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Style</Label>
                {/* @ts-ignore */}
                <Select
                  value={config.style || 'informative'}
                  onValueChange={(value) => updateConfig('style', value)}
                >
                  {/* @ts-ignore */}
                  <SelectTrigger>
                    {/* @ts-ignore */}
                    <SelectValue />
                  </SelectTrigger>
                  {/* @ts-ignore */}
                  <SelectContent>
                    {(stepConfig.options as any).style?.map((style: string) => (
                      /* @ts-ignore */
                      <SelectItem key={style} value={style}>
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step.type === 'extract' && (
            <div className="space-y-2">
              <Label>Extract Type</Label>
              {/* @ts-ignore */}
              <Select
                value={config.extractType || 'keywords'}
                onValueChange={(value) => updateConfig('extractType', value)}
              >
                {/* @ts-ignore */}
                <SelectTrigger>
                  {/* @ts-ignore */}
                  <SelectValue />
                </SelectTrigger>
                {/* @ts-ignore */}
                <SelectContent>
                  {(stepConfig.options as any).extractType?.map((type: string) => (
                    /* @ts-ignore */
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* @ts-ignore */}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="ai" onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
};