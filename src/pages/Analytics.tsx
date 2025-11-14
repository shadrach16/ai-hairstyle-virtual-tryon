import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, CreditCard, Palette, Calendar, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/lib/api';
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
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalyticsData();
    fetchGenerationHistory();
    fetchPaymentHistory();
  }, [period]);

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
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
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
              <p className="text-gray-600">Track your hairstyle transformations and activity</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Cards */}
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

        {/* Detailed Analytics */}
        <Tabs defaultValue="generations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generations">Generation History</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="generations" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}