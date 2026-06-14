import React, { useEffect, useState } from 'react';
import { ArrowLeft, TrendingUp, CreditCard, Palette, Calendar, Download, Eye, Award, Clock3, ShieldCheck, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { apiService, type AiBenchmarkCandidateSummary, type AiBenchmarkSummary } from '@/lib/api';
import QualityDashboard from '@/components/QualityDashboard';
import CollectionAnalytics from '@/components/CollectionAnalytics';
import { toast } from 'sonner';

interface AnalyticsData {
  period: number;
  totals: {
    generations: number;
    payments: number;
    spent: number;
    credits: number;
  };
  generationStats: Array<{ _id: string; count: number }>;
  paymentStats: Array<{ _id: string; count: number; totalAmount: number }>;
  dailyActivity: Array<{ _id: string; events: number }>;
  popularHairstyles: Array<{ _id: string; name: string; count: number }>;
}

interface Generation {
  _id: string;
  status: string;
  generatedImageUrl?: string;
  originalImageUrl?: string;
  hairstyleId: {
    name: string;
    thumbnail: string;
    category: string;
  };
  creditsUsed: number;
  createdAt: string;
}

interface Payment {
  _id: string;
  type: string;
  planId: string;
  amount: number;
  currency: string;
  status: string;
  creditsAdded: number;
  createdAt: string;
}

export default function Analytics() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [benchmarkSummary, setBenchmarkSummary] = useState<AiBenchmarkSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [benchmarkLoading, setBenchmarkLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [showQualityDashboard, setShowQualityDashboard] = useState(false);

  const assetBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');
  const hasSignedInSession = Boolean(user);

  useEffect(() => {
    void fetchBenchmarkSummary();

    if (!hasSignedInSession) {
      setAnalyticsData(null);
      setGenerations([]);
      setPayments([]);
      setLoading(false);
      return;
    }

    void fetchSignedInAnalytics();
  }, [period, hasSignedInSession]);

  const fetchSignedInAnalytics = async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchAnalyticsData(),
        fetchGenerationHistory(),
        fetchPaymentHistory()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBenchmarkSummary = async () => {
    setBenchmarkLoading(true);

    try {
      const result = await apiService.getAiBenchmarkSummary();
      if (result.success) {
        setBenchmarkSummary(result.data);
      }
    } catch (error) {
      console.error('Error fetching benchmark summary:', error);
    } finally {
      setBenchmarkLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const result = await apiService.getAnalyticsDashboard(period);
      if (result.success) {
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    }
  };

  const fetchGenerationHistory = async () => {
    try {
      const result = await apiService.getGenerationHistory();
      if (result.success) {
        setGenerations(result.data);
      }
    } catch (error) {
      console.error('Error fetching generations:', error);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const result = await apiService.getPaymentHistory();
      if (result.success) {
        setPayments(result.data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatUsd = (amount: number | null | undefined) => {
    if (!Number.isFinite(amount)) {
      return 'n/a';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    }).format(amount as number);
  };

  const formatLatency = (value: number | null | undefined) => {
    if (!Number.isFinite(value)) {
      return 'n/a';
    }

    const seconds = (value as number) / 1000;
    return `${seconds.toFixed(1)}s`;
  };

  const resolvePreviewUrl = (previewPath: string | null | undefined) => {
    if (!previewPath) {
      return null;
    }

    if (/^https?:\/\//i.test(previewPath)) {
      return previewPath;
    }

    return `${assetBaseUrl}${previewPath}`;
  };

  const getCandidateById = (candidateId: string | null | undefined) => {
    if (!candidateId || !benchmarkSummary) {
      return null;
    }

    return benchmarkSummary.candidates.find((candidate) => candidate.id === candidateId) || null;
  };

  const renderRecommendationCard = (
    title: string,
    candidateId: string | null,
    improvement: number | null,
    qualityScore: number | null,
    latencyMs: number | null,
    costPerRenderUsd: number | null,
    budgetUsd: number,
    recommendationMet: boolean
  ) => {
    const candidate = getCandidateById(candidateId);

    return (
      <Card className="border-amber-200 bg-white/90">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-base">{title}</CardTitle>
            <Badge className={recommendationMet ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
              {recommendationMet ? 'Approved' : 'Review needed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{candidate?.label || 'No winning candidate yet'}</p>
            <p className="text-xs text-gray-500">{candidate?.model || 'No model selected'}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs text-gray-500">Quality delta</p>
              <p className="font-semibold text-gray-900">{improvement ?? 'n/a'}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs text-gray-500">Latency</p>
              <p className="font-semibold text-gray-900">{formatLatency(latencyMs)}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs text-gray-500">Quality score</p>
              <p className="font-semibold text-gray-900">{qualityScore ?? 'n/a'}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <p className="text-xs text-gray-500">Cost / render</p>
              <p className="font-semibold text-gray-900">{formatUsd(costPerRenderUsd)}</p>
            </div>
          </div>
          <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50/60 p-3 text-xs text-gray-700">
            Budget ceiling for this lane: {formatUsd(budgetUsd)}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCandidateRow = (candidate: AiBenchmarkCandidateSummary) => (
    <div key={candidate.id} className="rounded-2xl border border-gray-200 bg-white/90 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">{candidate.label}</p>
          <p className="text-xs text-gray-500">{candidate.model}</p>
        </div>
        <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-500">Avg quality</p>
          <p className="font-medium text-gray-900">{candidate.averageQualityScore ?? 'n/a'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Avg latency</p>
          <p className="font-medium text-gray-900">{formatLatency(candidate.averageLatencyMs)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Cost / render</p>
          <p className="font-medium text-gray-900">{formatUsd(candidate.costPerRenderUsd)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Cost band</p>
          <p className="font-medium text-gray-900">{candidate.costBandValid ? 'Valid' : 'Out of band'}</p>
        </div>
      </div>
      {candidate.blockers.length > 0 && (
        <div className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          {candidate.blockers.join(' ')}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (showQualityDashboard) {
    return <QualityDashboard onBack={() => setShowQualityDashboard(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600">Track your activity and review the latest mobile model benchmark</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {hasSignedInSession && (
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
              </select>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!hasSignedInSession && (
          <Card className="mb-8 border-amber-200 bg-white/90">
            <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">Sign in to unlock personal analytics</p>
                <p className="text-sm text-gray-600">The AI benchmark tab below is public so the team can review current model recommendations on mobile without a full admin console.</p>
              </div>
              <Badge className="w-fit bg-amber-100 text-amber-800">Benchmark visible without auth</Badge>
            </CardContent>
          </Card>
        )}

        {analyticsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Generations</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totals.generations}</div>
                <p className="text-xs text-muted-foreground">
                  All time hairstyle transformations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totals.credits}</div>
                <p className="text-xs text-muted-foreground">
                  Available for generations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analyticsData.totals.spent)}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime purchases
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.totals.payments}</div>
                <p className="text-xs text-muted-foreground">
                  Successful transactions
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue={hasSignedInSession ? 'generations' : 'benchmark'} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="generations">Generations</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="benchmark">Benchmark</TabsTrigger>
          </TabsList>

          <TabsContent value="generations" className="space-y-4">
            {!hasSignedInSession ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <Palette className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Sign in to review your personal generation history.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Generations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No generations yet. Start creating your first hairstyle transformation!</p>
                      </div>
                    ) : (
                      generations.map((generation) => (
                        <div key={generation._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            {generation.generatedImageUrl ? (
                              <img
                                src={generation.generatedImageUrl}
                                alt="Generated hairstyle"
                                className="w-16 h-16 object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                <Palette className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-gray-900 truncate">
                                {generation.hairstyleId.name}
                              </h3>
                              <Badge className={getStatusColor(generation.status)}>
                                {generation.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {generation.hairstyleId.category} • {generation.creditsUsed} credits
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatDate(generation.createdAt)}
                            </p>
                          </div>

                          {generation.status === 'completed' && generation.generatedImageUrl && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            {!hasSignedInSession ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <CreditCard className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Sign in to review your payment history.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No payments yet. Purchase credits to start generating hairstyles!</p>
                      </div>
                    ) : (
                      payments.map((payment) => (
                        <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {payment.type === 'credit_pack' ? 'Credit Pack' : 'Subscription'}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {payment.creditsAdded} credits • {payment.planId}
                              </p>
                              <p className="text-xs text-gray-400">
                                {formatDate(payment.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatCurrency(payment.amount)}
                            </div>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            {!hasSignedInSession ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <BarChart3 className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Sign in to view quality analytics.</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowQualityDashboard(true)}>
                <CardContent className="py-8 text-center">
                  <BarChart3 className="mx-auto mb-4 h-12 w-12 text-amber-600" />
                  <h3 className="text-lg font-semibold mb-2">Quality & Cost Dashboard</h3>
                  <p className="text-sm text-gray-500">View generation quality metrics, mode performance, and cost analytics</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <CollectionAnalytics />
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {!hasSignedInSession ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <TrendingUp className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Sign in to review your personal hairstyle insights.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analyticsData && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Popular Hairstyles</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analyticsData.popularHairstyles.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No data available</p>
                          ) : (
                            analyticsData.popularHairstyles.map((hairstyle, index) => (
                              <div key={hairstyle._id} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-xs font-medium text-amber-600">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm font-medium">{hairstyle.name}</span>
                                </div>
                                <Badge variant="outline">{hairstyle.count} times</Badge>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Generation Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {analyticsData.generationStats.map((stat) => (
                            <div key={stat._id} className="flex items-center justify-between">
                              <span className="text-sm capitalize">{stat._id}</span>
                              <Badge className={getStatusColor(stat._id)}>
                                {stat.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="benchmark" className="space-y-6">
            {benchmarkLoading ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
                </CardContent>
              </Card>
            ) : !benchmarkSummary ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <AlertTriangle className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>No AI benchmark summary is available yet.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border-amber-200 bg-white/90">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">A1 mobile benchmark recommendation</p>
                        <p className="text-sm text-gray-600">Run {benchmarkSummary.runId} · Dataset {benchmarkSummary.datasetVersion} · Updated {formatDate(benchmarkSummary.generatedAt)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-amber-100 text-amber-800">
                          <Award className="mr-1 h-3 w-3" />
                          Mobile-first evaluation
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          <ShieldCheck className="mr-1 h-3 w-3" />
                          Cost band checked
                        </Badge>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4 text-sm text-gray-700">
                      {benchmarkSummary.memo.executiveSummary}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {renderRecommendationCard(
                    'Standard mobile mode',
                    benchmarkSummary.recommendation.standard.selectedCandidateId,
                    benchmarkSummary.recommendation.standard.improvement,
                    benchmarkSummary.recommendation.standard.selectedQualityScore,
                    benchmarkSummary.recommendation.standard.selectedLatencyMs,
                    benchmarkSummary.recommendation.standard.selectedCostPerRenderUsd,
                    benchmarkSummary.recommendation.standard.creditBudgetUsd,
                    benchmarkSummary.recommendation.standard.recommendationMet
                  )}
                  {renderRecommendationCard(
                    'Premium mobile mode',
                    benchmarkSummary.recommendation.premium.selectedCandidateId,
                    benchmarkSummary.recommendation.premium.improvement,
                    benchmarkSummary.recommendation.premium.selectedQualityScore,
                    benchmarkSummary.recommendation.premium.selectedLatencyMs,
                    benchmarkSummary.recommendation.premium.selectedCostPerRenderUsd,
                    benchmarkSummary.recommendation.premium.creditBudgetUsd,
                    benchmarkSummary.recommendation.premium.recommendationMet
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                  <Card className="bg-white/90 lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Candidate scoreboard</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      {benchmarkSummary.candidates.map(renderCandidateRow)}
                    </CardContent>
                  </Card>

                  <Card className="bg-white/90">
                    <CardHeader>
                      <CardTitle>Commerce guardrails</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-gray-700">
                      <div className="rounded-xl bg-amber-50 p-3">
                        <p className="text-xs text-gray-500">Revenue floor per credit</p>
                        <p className="font-semibold text-gray-900">{formatUsd(benchmarkSummary.monetization.floorRevenuePerCreditUsd)}</p>
                      </div>
                      <div className="rounded-xl bg-amber-50 p-3">
                        <p className="text-xs text-gray-500">Standard render budget</p>
                        <p className="font-semibold text-gray-900">{formatUsd(benchmarkSummary.monetization.standardMaxCostUsd)}</p>
                      </div>
                      <div className="rounded-xl bg-amber-50 p-3">
                        <p className="text-xs text-gray-500">Premium render budget</p>
                        <p className="font-semibold text-gray-900">{formatUsd(benchmarkSummary.monetization.premiumMaxCostUsd)}</p>
                      </div>
                      <div className="rounded-xl bg-amber-50 p-3">
                        <p className="text-xs text-gray-500">Target gross margin</p>
                        <p className="font-semibold text-gray-900">{Math.round(benchmarkSummary.monetization.targetGrossMargin * 100)}%</p>
                      </div>
                      <div className="rounded-xl border border-dashed border-amber-200 p-3 text-xs">
                        {benchmarkSummary.memo.reviewChecklist.join(' ')}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/90">
                  <CardHeader>
                    <CardTitle>Case previews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {benchmarkSummary.cases.map((testCase) => {
                      const selectedCandidateId = testCase.tier === 'premium'
                        ? benchmarkSummary.recommendation.premium.selectedCandidateId
                        : benchmarkSummary.recommendation.standard.selectedCandidateId;
                      const selectedPreview = resolvePreviewUrl(testCase.previews[selectedCandidateId || '']);
                      const baselinePreview = resolvePreviewUrl(testCase.previews[benchmarkSummary.baselineCandidateId]);

                      return (
                        <div key={testCase.id} className="rounded-2xl border border-gray-200 p-4">
                          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{testCase.label}</p>
                              <p className="text-sm text-gray-500">{testCase.sourceStyleName} → {testCase.targetStyleName}</p>
                            </div>
                            <Badge className={testCase.tier === 'premium' ? 'bg-orange-100 text-orange-800' : 'bg-sky-100 text-sky-800'}>
                              {testCase.tier}
                            </Badge>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Clock3 className="h-4 w-4" />
                                Baseline preview
                              </div>
                              {baselinePreview ? (
                                <img src={baselinePreview} alt={`${testCase.label} baseline preview`} className="h-56 w-full rounded-2xl object-cover" />
                              ) : (
                                <div className="flex h-56 items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">No baseline preview</div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Award className="h-4 w-4" />
                                Recommended preview
                              </div>
                              {selectedPreview ? (
                                <img src={selectedPreview} alt={`${testCase.label} recommended preview`} className="h-56 w-full rounded-2xl object-cover" />
                              ) : (
                                <div className="flex h-56 items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-500">No recommended preview</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}