import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pipelineService } from '../services/pipelineService';
import { useAuth } from '../contexts/AuthContext';

// Define the types locally since they're not in the frontend types
interface CreatePipelineData {
  name: string;
  description?: string;
  userId: string;
  steps: Array<{
    type: string;
    config: any;
    order: number;
  }>;
}

interface UpdatePipelineData {
  name?: string;
  description?: string;
  steps?: Array<{
    type: string;
    config: any;
    order: number;
  }>;
}

export function usePipelines() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Query key for user pipelines
  const pipelinesQueryKey = ['pipelines', user?.id];

  // Get all pipelines for the current user
  const {
    data: pipelines = [],
    isLoading: isLoadingPipelines,
    error: pipelinesError,
  } = useQuery({
    queryKey: pipelinesQueryKey,
    queryFn: () => {
      if (!user?.id) throw new Error('User not authenticated');
      return pipelineService.getPipelinesByUserId(user.id);
    },
    enabled: !!user?.id,
  });

  // Get a specific pipeline by ID
  const usePipeline = (pipelineId: string) => {
    return useQuery({
      queryKey: ['pipeline', pipelineId],
      queryFn: () => {
        if (!user?.id) throw new Error('User not authenticated');
        return pipelineService.getPipelineById(pipelineId, user.id);
      },
      enabled: !!user?.id && !!pipelineId,
    });
  };

  // Create pipeline mutation
  const createPipelineMutation = useMutation({
    mutationFn: (data: Omit<CreatePipelineData, 'userId'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      return pipelineService.createPipeline({ ...data, userId: user.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelinesQueryKey });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Update pipeline mutation
  const updatePipelineMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePipelineData }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return pipelineService.updatePipeline(id, user.id, data);
    },
    onSuccess: (updatedPipeline) => {
      if (updatedPipeline) {
        queryClient.setQueryData(['pipeline', updatedPipeline.id], updatedPipeline);
        queryClient.invalidateQueries({ queryKey: pipelinesQueryKey });
      }
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Delete pipeline mutation
  const deletePipelineMutation = useMutation({
    mutationFn: (pipelineId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      return pipelineService.deletePipeline(pipelineId, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelinesQueryKey });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Search pipelines
  const searchPipelines = useCallback(async (searchTerm: string) => {
    if (!user?.id) throw new Error('User not authenticated');
    return pipelineService.searchPipelines(user.id, searchTerm);
  }, [user?.id]);

  // Get user statistics
  const useUserStats = () => {
    return useQuery({
      queryKey: ['userStats', user?.id],
      queryFn: () => {
        if (!user?.id) throw new Error('User not authenticated');
        return pipelineService.getUserStats(user.id);
      },
      enabled: !!user?.id,
    });
  };

  // Get pipeline executions
  const usePipelineExecutions = () => {
    return useQuery({
      queryKey: ['pipelineExecutions', user?.id],
      queryFn: () => {
        if (!user?.id) throw new Error('User not authenticated');
        return pipelineService.getPipelineExecutionsByUserId(user.id);
      },
      enabled: !!user?.id,
    });
  };

  // Create pipeline execution
  const createExecutionMutation = useMutation({
    mutationFn: ({ pipelineId, input }: { pipelineId: string; input: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      return pipelineService.createPipelineExecution({
        pipelineId,
        userId: user.id,
        input,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelineExecutions', user?.id] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Update pipeline execution
  const updateExecutionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: 'pending' | 'running' | 'completed' | 'failed'; totalProcessingTime?: number } }) => {
      return pipelineService.updatePipelineExecution(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelineExecutions', user?.id] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Add pipeline execution output
  const addExecutionOutputMutation = useMutation({
    mutationFn: ({ executionId, stepId, output, processingTime }: {
      executionId: string;
      stepId: string;
      output: string;
      processingTime: number;
    }) => {
      return pipelineService.addPipelineExecutionOutput({
        executionId,
        stepId,
        output,
        processingTime,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pipelineExecutions', user?.id] });
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    pipelines,
    isLoadingPipelines,
    pipelinesError,
    
    // Mutations
    createPipeline: createPipelineMutation.mutate,
    updatePipeline: updatePipelineMutation.mutate,
    deletePipeline: deletePipelineMutation.mutate,
    createExecution: createExecutionMutation.mutate,
    updateExecution: updateExecutionMutation.mutate,
    addExecutionOutput: addExecutionOutputMutation.mutate,
    
    // Loading states
    isCreatingPipeline: createPipelineMutation.isPending,
    isUpdatingPipeline: updatePipelineMutation.isPending,
    isDeletingPipeline: deletePipelineMutation.isPending,
    isCreatingExecution: createExecutionMutation.isPending,
    isUpdatingExecution: updateExecutionMutation.isPending,
    isAddingExecutionOutput: addExecutionOutputMutation.isPending,
    
    // Error handling
    error,
    clearError,
    
    // Hooks
    usePipeline,
    useUserStats,
    usePipelineExecutions,
    
    // Utilities
    searchPipelines,
  };
} 