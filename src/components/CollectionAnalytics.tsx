import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService, type CollectionAnalyticsData, type RecommendationAnalyticsData } from '@/lib/api';
import { BarChart3, Eye, MousePointerClick, ShoppingCart, TrendingUp } from 'lucide-react';

const PERIOD_OPTIONS = [
  { label: '7d', value: 7 },
  { label: '30d', value: 30 },
  { label: '90d', value: 90 },
];

export default function CollectionAnalytics() {
  const [days, setDays] = useState(30);
  const [collectionData, setCollectionData] = useState<CollectionAnalyticsData | null>(null);
  const [recData, setRecData] = useState<RecommendationAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiService.getCollectionAnalytics(days),
      apiService.getRecommendationAnalytics(days),
    ]).then(([colRes, recRes]) => {
      setCollectionData(colRes.data);
      setRecData(recRes.data);
    }).finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">Period:</span>
        {PERIOD_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => setDays(opt.value)}
            className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
              days === opt.value
                ? 'bg-[#1a1a1a] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      {collectionData?.summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="h-4 w-4" />
                <span className="text-xs">Views</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{collectionData.summary.totalViews.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <MousePointerClick className="h-4 w-4" />
                <span className="text-xs">Clicks</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{collectionData.summary.totalClicks.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <ShoppingCart className="h-4 w-4" />
                <span className="text-xs">Conversions</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{collectionData.summary.totalConversions.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Avg CTR</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{collectionData.summary.avgCtr}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Collection performance table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Collection Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {collectionData?.collections.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 pr-4">Collection</th>
                    <th className="pb-2 pr-4 text-right">Views</th>
                    <th className="pb-2 pr-4 text-right">Clicks</th>
                    <th className="pb-2 pr-4 text-right">Conv.</th>
                    <th className="pb-2 pr-4 text-right">CTR</th>
                    <th className="pb-2 text-right">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {collectionData.collections.map(col => (
                    <tr key={col.slug} className="border-b border-gray-100 last:border-0">
                      <td className="py-2.5 pr-4">
                        <span className="mr-1.5">{col.emoji}</span>
                        <span className="font-medium">{col.name}</span>
                        <Badge variant="outline" className="ml-2 text-[10px]">{col.type}</Badge>
                      </td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{col.views.toLocaleString()}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{col.clicks.toLocaleString()}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{col.conversions.toLocaleString()}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{col.ctr}%</td>
                      <td className="py-2.5 text-right tabular-nums">{col.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">No collection analytics data yet. Events will appear after users browse collections.</p>
          )}
        </CardContent>
      </Card>

      {/* Recommendation performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommendation Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recData?.bySource.length ? (
            <div className="space-y-4">
              {recData.bySource.map(src => (
                <div key={src.source} className="rounded-xl border border-gray-100 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium capitalize">{src.source.replace(/-/g, ' ')}</span>
                    <span className="text-sm text-gray-500">{src.impressions.toLocaleString()} impressions</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Items served</p>
                      <p className="font-semibold">{src.totalItemsServed.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Avg items/request</p>
                      <p className="font-semibold">{src.impressions > 0 ? (src.totalItemsServed / src.impressions).toFixed(1) : '0'}</p>
                    </div>
                  </div>
                  {src.variants.length > 1 && (
                    <div className="mt-3 flex gap-2">
                      {src.variants.map(v => (
                        <Badge key={v.variant} variant="outline" className="text-xs">
                          {v.variant}: {v.impressions} ({v.uniqueUsers} users)
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">No recommendation analytics data yet. Events will appear after users view recommendations.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
