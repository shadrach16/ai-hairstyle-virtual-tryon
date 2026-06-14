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
            // A4: Show quality feedback if score was low
            if (result.data.qualityPassed === false && result.data.qualityDefect) {
              toast.warning(`Result quality note: ${result.data.qualityDefect}`, { duration: 6000 });
            }
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

  const generateHairstyle = async (hairstyleId: string, mimeType: string, imageFile: File, generationMode: string = 'hd') => {
    try {
      setIsGenerating(true);
      setProgress(5);

      // A3: Input gate — validate selfie before spending credits
      const validation = await apiService.validateInput(imageFile);
      if (!validation.success) {
        setIsGenerating(false);
        const msg = validation.suggestion || validation.issues?.[0]?.message || 'Photo does not meet quality requirements.';
        toast.error(msg, { duration: 5000 });
        return { success: false, message: msg, code: 'INPUT_GATE_FAILED' };
      }
      setProgress(15);
      
      const result = await apiService.generateHairstyle(hairstyleId, mimeType, imageFile, generationMode);
      
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
      setProgress(5);

    // A3: Input gate — validate user's selfie photo before spending credits
    try {
      const validation = await apiService.validateInput(selectedPhoto);
      if (!validation.success) {
        setIsGenerating(false);
        const msg = validation.suggestion || validation.issues?.[0]?.message || 'Your selfie does not meet quality requirements.';
        toast.error(msg, { duration: 5000 });
        return { success: false, message: msg, code: 'INPUT_GATE_FAILED' };
      }
    } catch {
      // Fail-open: proceed if validation service is down
    }
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
    generationId,
    generationStatus,
    progress,
    generateHairstyle,
    resetGeneration,
    handleCustomGenerator
  };
}