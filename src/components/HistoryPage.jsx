// src/pages/HistoryPage.jsx (New Component)

import React, { useState, useEffect } from 'react';
import { useGeneration } from '@/hooks/useGeneration';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles, AlertCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Hairstyle } from '@/lib/api'; // Ensure correct import for Hairstyle type

interface HistoryPageProps {
  // Assuming user object is passed down for context
  user: any; 
  refreshUser: () => void;
}

const GenerationCard = ({ generation }) => {
    // Determine the image to show
    const imageUrl = generation.generatedImage?.url || (generation.originalImage?.url);
    const statusColor = generation.status === 'completed' ? 'border-green-500' : 
                        generation.status === 'failed' ? 'border-red-500' : 'border-amber-500';

    return (
        <Card className={`overflow-hidden transition-shadow duration-300 hover:shadow-md ${statusColor}`}>
            <CardContent className="p-3 flex items-center space-x-3">
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Result" className="w-full h-full object-cover" />
                    ) : (
                        <History className="w-8 h-8 text-slate-400 m-4" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-slate-800">
                        {generation.hairstyle?.name || 'Unknown Hairstyle'}
                    </p>
                    <p className={`text-xs font-medium ${generation.status === 'completed' ? 'text-green-600' : 
                                                          generation.status === 'failed' ? 'text-red-600' : 'text-amber-600'}`}>
                        Status: {generation.status.charAt(0).toUpperCase() + generation.status.slice(1)}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(generation.createdAt).toLocaleDateString()}
                    </p>
                </div>
                {generation.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {generation.status === 'completed' && <Sparkles className="w-5 h-5 text-amber-500" />}
            </CardContent>
        </Card>
    );
};

export default function HistoryPage({ user, refreshUser }: HistoryPageProps) {
    // Assuming you have a hook/service to fetch history
    const [history, setHistory] = useState<any[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth(); // Check if user is logged in

    useEffect(() => {
        if (isAuthenticated) {
            fetchHistory();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const fetchHistory = async () => {
        setIsLoading(true);
        // This relies on a new API service method: apiService.getGenerationHistory(page, limit)
        // I will assume for simplicity that your existing apiService.getGenerationHistory fetches everything for now.
        const result = await apiService.getGenerationHistory(); 
        if (result.success) {
            setHistory(result.data);
        }
        setIsLoading(false);
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center p-8 mt-12">
                <History className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h2 className="text-xl font-bold mb-2">History Unavailable</h2>
                <p className="text-slate-600 mb-6">Please sign in to view your past hairstyle generations.</p>
                {/* Assuming GoogleSignInButton is imported */}
                <Button className="bg-amber-600 hover:bg-amber-700">Sign In Now</Button>
            </div>
        );
    }


    return (
        <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <History className="w-6 h-6 mr-3 text-amber-600" /> Generation History
            </h1>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                </div>
            ) : history.length === 0 ? (
                <div className="text-center p-12 mt-12 border border-slate-200 rounded-lg bg-white">
                    <Sparkles className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-lg font-semibold text-slate-700">No Generations Yet</p>
                    <p className="text-sm text-slate-500 mt-2">Start in the Studio tab to create your first hairstyle!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map(gen => (
                        <GenerationCard key={gen.id} generation={gen} />
                    ))}
                    {/* Add pagination controls here if using pages/total */}
                </div>
            )}
        </div>
    );
}

// NOTE: You must update the Hairstyle.js model and Generation.js model 
// to ensure the populate paths are correct for the Hairstyle and User models.