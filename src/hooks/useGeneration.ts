import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { toast } from 'sonner';

export function useGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  // Poll generation status
  useEffect(() => {
    if (!generationId) return;

    const pollStatus = async () => {
      try {
        const result = await apiService.getGenerationStatus(generationId);
        if (result.data) {
          setGenerationStatus(result.data);
          
          if (result.data.status === 'completed') {
            setIsGenerating(false);
            setProgress(100);
             clearInterval(interval)
          } else if (result.data.status === 'failed') {
            setIsGenerating(false);
            toast.error(result.data.errorMessage || 'Generation failed');
             clearInterval(interval)
          } else if (result.data.status === 'processing') {
            setProgress(prev => Math.min(90, prev + Math.random() * 10));
          }  
        }
      } catch (error) {
        console.error('Error polling generation status:', error);
      }
    };

    // Poll every 3 seconds
    const interval = setInterval(pollStatus, 5000);
    
    // Initial poll
    pollStatus();

    return () => clearInterval(interval);
  }, [generationId]);

  const generateHairstyle = async (hairstyleId: string,mimeType: string, imageFile: File) => {
    try {
      setIsGenerating(true);
      setProgress(10);
      
      const result = await apiService.generateHairstyle(hairstyleId,mimeType, imageFile);
      
      if (result.success) {
        setGenerationId(result.data.generationId);
        setProgress(20);    
        return { success: true, generationId: result.data.generationId };
      } else {
        setIsGenerating(false);
        toast.error(result.message || 'Failed to start generation');
        return { success: false, message: result.message };
      }
    } catch (error) {
      setIsGenerating(false);
      toast.error('Generation failed. Please try again.');
      return { success: false, message: 'Generation failed' };
    }
  };


   // --- NEW HANDLER: Upload Hairstyle for Analysis ---
  const handleCustomGenerator = async (imageFile: File,imageMimeType:any,selectedPhoto:any) => {
    
     setIsGenerating(true);
      setProgress(10);
    try {
      // 2. Set state to processing while AI analyzes
      const result = await apiService.analyzeHairstyleImage(imageFile,imageMimeType,selectedPhoto);
      console.log(result)

      if (result.success) {
 setGenerationId(result.data.generationId);
        setProgress(20);
        return { success: true, generationId: result.data.generationId };

      } else {
       setIsGenerating(false);
        toast.error(result.message || 'AI analysis failed');
        return { success: false, message: result.message };
      }

    } catch (e) {
     setIsGenerating(false);
      toast.error('Generation failed. Please try again.');
      return { success: false, message: 'Generation failed' };
    }
  } ;



  const resetGeneration = () => {
    setIsGenerating(false);
    setGenerationId(null);
    setGenerationStatus(null);
    setProgress(0);
  };

  return {
    isGenerating,
    generationStatus,
    progress,
    generateHairstyle,
    resetGeneration,
    handleCustomGenerator
  };
}