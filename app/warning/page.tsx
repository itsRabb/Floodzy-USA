'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  Info,
  Clock,
  MapPin,
  Loader2,
  ChevronRight,
  TrendingUp,
  Droplets,
  Eye,
  Users,
  Shield,
  ChevronLeft,
  Newspaper,
  MessageSquare,
} from 'lucide-react';

import { useLanguage } from '@/src/context/LanguageContext';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import real NOAA alerts
import { fetchNOAAAlerts } from '@/lib/noaa-alerts';

// Types
interface Alert {
  id: string;
  level: 'low' | 'medium' | 'high';
  location: string;
  timestamp: string;
  reason: string;
  details?: string;
  affectedAreas?: string[];
  estimatedPopulation?: number;
  severity?: number;
}

interface NewsReport {
  id: string;
  title: string;
  content: string;
  source: string;
  url?: string;
  timestamp: string;
}

const fetchNewsAndReports = async (): Promise<NewsReport[]> => {
  try {
    // Fetch real weather/disaster news from NewsAPI
    // Using 'weather', 'flood', 'disaster' keywords for relevant articles
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=(weather OR flood OR disaster OR storm OR hurricane) AND (United States OR US)&language=en&sortBy=publishedAt&pageSize=6`,
      {
        headers: {
          'X-Api-Key': process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      console.warn('[Warning Page] NewsAPI failed, using fallback');
      throw new Error('NewsAPI request failed');
    }

    const data = await response.json();
    
    if (data.status === 'ok' && data.articles) {
      return data.articles
        .filter((article: any) => article.title && article.url) // Filter out null/removed articles
        .slice(0, 4) // Limit to 4 articles
        .map((article: any, index: number) => ({
          id: `news-${index}`,
          title: article.title,
          content: article.description || article.content || 'No description available.',
          source: article.source?.name || 'News Source',
          url: article.url,
          timestamp: article.publishedAt || new Date().toISOString(),
        }));
    }
    
    throw new Error('No articles found');
  } catch (error) {
    console.error('[Warning Page] Error fetching news:', error);
    // Fallback to NOAA weather stories as backup
    return [
      { 
        id: 'news-fallback-1', 
        title: 'National Weather Service Issues Weather Advisories Across US', 
        content: 'Real-time weather alerts and forecasts available from the National Weather Service.', 
        source: 'NOAA/NWS', 
        url: 'https://www.weather.gov/', 
        timestamp: new Date().toISOString() 
      },
      { 
        id: 'news-fallback-2', 
        title: 'USGS Monitors Water Levels Nationwide', 
        content: 'Access real-time stream flow and water level data from monitoring stations.', 
        source: 'USGS', 
        url: 'https://waterdata.usgs.gov/nwis/rt', 
        timestamp: new Date().toISOString() 
      },
    ];
  }
};

export default function AlertsPage() {
  const router = useRouter();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [newsReports, setNewsReports] = useState<NewsReport[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [geminiExplanation, setGeminiExplanation] = useState<string | null>(null);
  const [geminiNewsSummary, setGeminiNewsSummary] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNewsLoading, setIsNewsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newsError, setNewsError] = useState<string | null>(null);
  const { t, lang } = useLanguage();

  // Fetch real NOAA alerts on component mount and every 5 minutes
  useEffect(() => {
    const fetchRealAlerts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('[Warning Page] Fetching real NOAA alerts...');

        const realAlerts = await fetchNOAAAlerts();

        // Transform NOAA alerts to our Alert format
        const transformedAlerts: Alert[] = realAlerts.map(alert => ({
          id: alert.id,
          level: alert.level === 'critical' ? 'high' : 
                 alert.level === 'danger' ? 'high' : 
                 alert.level === 'warning' ? 'medium' : 'low',
          location: alert.affectedAreas[0] || alert.regionId || 'Unknown Location',
          timestamp: new Date(alert.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          reason: alert.title || alert.message,
          details: alert.messageEn || alert.message,
          affectedAreas: alert.affectedAreas,
          estimatedPopulation: undefined,
          severity: alert.level === 'critical' ? 10 : 
                    alert.level === 'danger' ? 8 : 
                    alert.level === 'warning' ? 5 : 3
        }));
          estimatedPopulation: alert.estimatedPopulation,
          severity: alert.severity
        }));

        setAlerts(transformedAlerts);
        console.log(`[Warning Page] Loaded ${transformedAlerts.length} real alerts`);

        // If no alerts, that's actually good - no active flood warnings
        if (transformedAlerts.length === 0) {
          console.log('[Warning Page] No active flood alerts - this is good!');
        }

      } catch (err: any) {
        console.error('[Warning Page] Error fetching real alerts:', err);
        setError('Failed to load real-time alerts. Please check your connection.');
        setAlerts([]); // No fallback mock data
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchRealAlerts();

    // Refresh every 5 minutes
    const interval = setInterval(fetchRealAlerts, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchAndSummarizeNews = useCallback(async () => {
    setIsNewsLoading(true);
    setNewsError(null);
    setGeminiNewsSummary({});
    try {
      const reports = await fetchNewsAndReports();
      setNewsReports(reports);
      // Mock summary
      const summaries = reports.reduce((acc, report) => {
        acc[report.id] = t('warnings.summaryTemplate').replace('{title}', report.title);
        return acc;
      }, {} as { [key: string]: string });
      setGeminiNewsSummary(summaries);
    } catch (err: any) {
      setNewsError(err.message || t('warnings.errorNews'));
    } finally {
      setIsNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSummarizeNews();
    const newsIntervalId = setInterval(fetchAndSummarizeNews, 60000 * 5);
    return () => clearInterval(newsIntervalId);
  }, [fetchAndSummarizeNews]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      case 'medium': return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/10 border-yellow-200 dark:border-yellow-500/20';
      case 'low': return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
      default: return 'text-slate-700 dark:text-gray-400 bg-slate-100 dark:bg-gray-500/10 border-slate-200 dark:border-gray-500/20';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertTriangle className="h-5 w-5" />;
      case 'medium': return <Info className="h-5 w-5" />;
      case 'low': return <Bell className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const fetchGeminiExplanation = async (alert: Alert) => {
    setIsLoading(true);
    setError(null);
    setGeminiExplanation(null);
    setSelectedAlert(alert);
    
    try {
      // Call the real Gemini API to get AI analysis
      const response = await fetch('/api/gemini-alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertData: {
            level: alert.level,
            location: alert.location,
            timestamp: alert.timestamp,
            reason: alert.reason,
            affectedAreas: alert.affectedAreas,
            estimatedPopulation: alert.estimatedPopulation,
            severity: alert.severity,
            requestType: 'alert_analysis'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI analysis');
      }

      const data = await response.json();
      setGeminiExplanation(data.analysis || data.answer || t('warnings.analysisResult')
        .replace('{location}', alert.location)
        .replace('{reason}', alert.reason)
        .replace('{areas}', alert.affectedAreas?.join(', ') || ''));
    } catch (err: any) {
      console.error('[Warning Page] Error fetching Gemini analysis:', err);
      // Fallback to template if API fails
      setGeminiExplanation(t('warnings.analysisResult')
        .replace('{location}', alert.location)
        .replace('{reason}', alert.reason)
        .replace('{areas}', alert.affectedAreas?.join(', ') || ''));
    } finally {
      setIsLoading(false);
    }
  };

  const totalAlerts = alerts.length;
  const highAlerts = React.useMemo(() => alerts.filter((a) => a.level === 'high').length, [alerts]);
  const mediumAlerts = React.useMemo(() => alerts.filter((a) => a.level === 'medium').length, [alerts]);
  const lowAlerts = React.useMemo(() => alerts.filter((a) => a.level === 'low').length, [alerts]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2 h-10 w-10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">{t('warnings.title')}</h2>
            <p className="text-slate-500 dark:text-gray-400">{t('warnings.subtitle')}</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-gray-400 text-sm">{t('warnings.totalAlerts')}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalAlerts}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-500/10 p-3 rounded-lg"><Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" /></div>
            </div>
            <div className="mt-4 flex items-center text-sm"><TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" /><span className="text-green-600 dark:text-green-400">{t('warnings.active')}</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-gray-400 text-sm">{t('warnings.highLevel')}</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{highAlerts}</p>
              </div>
              <div className="bg-red-100 dark:bg-red-500/10 p-3 rounded-lg"><AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" /></div>
            </div>
            <div className="mt-4 flex items-center text-sm"><span className="text-red-600 dark:text-red-400">{t('warnings.immediateAction')}</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-gray-400 text-sm">{t('warnings.mediumLevel')}</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{mediumAlerts}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-500/10 p-3 rounded-lg"><Info className="h-6 w-6 text-yellow-600 dark:text-yellow-400" /></div>
            </div>
            <div className="mt-4 flex items-center text-sm"><span className="text-yellow-600 dark:text-yellow-400">{t('warnings.monitorConstantly')}</span></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 dark:text-gray-400 text-sm">{t('warnings.lowLevel')}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{lowAlerts}</p>
              </div>
              <div className="bg-green-100 dark:bg-green-500/10 p-3 rounded-lg"><Bell className="h-6 w-6 text-green-600 dark:text-green-400" /></div>
            </div>
            <div className="mt-4 flex items-center text-sm"><span className="text-green-600 dark:text-green-400">{t('warnings.stableCondition')}</span></div>
          </motion.div>
        </div>

        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 p-1">
            <TabsTrigger value="alerts" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-500 dark:data-[state=inactive]:text-gray-400"><Bell className="w-4 h-4 mr-2" /> {t('warnings.alertsTab')}</TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-slate-500 dark:data-[state=inactive]:text-gray-400"><Newspaper className="w-4 h-4 mr-2" /> {t('warnings.newsTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <AnimatePresence>
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className={`bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-6 cursor-pointer transition-all duration-200 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 ${selectedAlert?.id === alert.id ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'shadow-sm'
                      }`}
                    onClick={() => fetchGeminiExplanation(alert)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getLevelColor(alert.level)}`}>
                        {getLevelIcon(alert.level)}
                        <span className="text-sm font-medium">{t(`common.levels.${alert.level}`)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-slate-500 dark:text-gray-400 text-sm"><Clock className="h-4 w-4" /><span>{alert.timestamp}</span></div>
                    </div>
                    <div className="flex items-center space-x-2 mb-3"><MapPin className="h-5 w-5 text-cyan-600 dark:text-cyan-400" /><h3 className="text-lg font-semibold text-slate-900 dark:text-white">{alert.location}</h3></div>
                    <p className="text-slate-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{alert.reason}</p>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-100 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1"><Users className="h-4 w-4 text-blue-600 dark:text-blue-400" /><span className="text-xs text-slate-500 dark:text-gray-400">{t('warnings.affected')}</span></div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{alert.estimatedPopulation?.toLocaleString('en-US')}</span>
                      </div>
                      <div className="bg-slate-100 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1"><Droplets className="h-4 w-4 text-cyan-600 dark:text-cyan-400" /><span className="text-xs text-slate-500 dark:text-gray-400">{t('warnings.severity')}</span></div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{alert.severity}/10</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">{t('warnings.affectedRegions')}</p>
                      <div className="flex flex-wrap gap-1">
                        {alert.affectedAreas?.slice(0, 3).map((area, areaIndex) => (<span key={areaIndex} className="bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 text-xs px-2 py-1 rounded">{area}</span>))}
                        {alert.affectedAreas && alert.affectedAreas.length > 3 && (<span className="text-xs text-slate-500 dark:text-gray-400">+{alert.affectedAreas.length - 3} {t('warnings.others')}</span>)}
                      </div>
                    </div>
                    <button
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                      onClick={(e) => { e.stopPropagation(); fetchGeminiExplanation(alert); }}
                      disabled={isLoading && selectedAlert?.id === alert.id}
                    >
                      {isLoading && selectedAlert?.id === alert.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
                      <span>{t('warnings.viewDetail')}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {selectedAlert && (
              <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{t('warnings.detailTitle')}: {selectedAlert.location}</h3>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getLevelColor(selectedAlert.level)}`}>
                    {getLevelIcon(selectedAlert.level)}
                    <span className="font-medium">{t(`common.levels.${selectedAlert.level}`)}</span>
                  </div>
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                      <p className="text-lg text-slate-600 dark:text-gray-300">{t('warnings.loadingAnalysis')}</p>
                      <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">{t('warnings.analyzingData')}</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2"><AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" /><span className="text-red-600 dark:text-red-400 font-medium">{t('warnings.error')}</span></div>
                    <p className="text-red-800 dark:text-red-300">{error}</p>
                  </div>
                ) : geminiExplanation ? (
                  <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <div className="prose prose-invert max-w-none"><div className="whitespace-pre-line text-slate-700 dark:text-gray-200 leading-relaxed">{geminiExplanation}</div></div>
                  </div>
                ) : (
                  <div className="text-center py-8"><Info className="h-12 w-12 text-slate-400 dark:text-gray-400 mx-auto mb-4" /><p className="text-slate-500 dark:text-gray-400">{t('warnings.selectAlert')}</p></div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="news">
            <h3 className="text-2xl font-bold mb-4 flex items-center space-x-2 text-slate-900 dark:text-white"><Newspaper className="h-6 w-6 text-orange-600 dark:text-orange-400" /><span>{t('warnings.regionalNews')}</span></h3>
            <p className="text-slate-500 dark:text-gray-400 mb-6">{t('warnings.newsSubtitle')}</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {isNewsLoading ? (
                <div className="col-span-full text-center text-slate-500 dark:text-gray-400 py-8"><Loader2 className="h-10 w-10 animate-spin text-orange-600 dark:text-orange-400 mx-auto mb-4" /><p>{t('warnings.loadingNews')}</p></div>
              ) : newsError ? (
                <div className="col-span-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2"><AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" /><span className="text-red-600 dark:text-red-400 font-medium">{t('warnings.errorNews')}</span></div>
                  <p className="text-red-800 dark:text-red-300">{newsError}</p>
                </div>
              ) : newsReports.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 dark:text-gray-400 py-8"><Info className="h-12 w-12 text-slate-400 dark:text-gray-400 mx-auto mb-4" /><p>{t('warnings.noNews')}</p></div>
              ) : (
                newsReports.map((report) => (
                  <motion.div key={report.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-3"><h4 className="text-lg font-semibold text-slate-900 dark:text-white">{report.title}</h4><Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-gray-300">{report.source}</Badge></div>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mb-3"><Clock className="inline-block h-3 w-3 mr-1" /> {new Date(report.timestamp).toLocaleString('en-US')}</p>
                    <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 mb-3"><MessageSquare className="h-5 w-5" /><span className="text-base font-medium">{t('warnings.geminiSummary')}</span></div>
                    <div className="bg-slate-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                      {geminiNewsSummary[report.id] ? (
                        <p className="text-sm text-slate-700 dark:text-gray-300 whitespace-pre-line">{geminiNewsSummary[report.id]}</p>
                      ) : (
                        <div className="flex items-center text-slate-500 dark:text-gray-400 text-sm"><Loader2 className="h-4 w-4 animate-spin mr-2" /><span>{t('warnings.summarizing')}</span></div>
                      )}
                    </div>
                    {report.url && (<a href={report.url} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center text-sm">{t('warnings.readMore')} <ChevronRight className="h-4 w-4 ml-1" /></a>)}
                  </motion.div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
