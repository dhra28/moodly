import { useState, useEffect, useCallback } from 'react'
import { getEntries, getLast7, getLast30, getMoodStats, getWeeklyInsights } from '../utils/api'

export const useMoodData = () => {
  const [entries, setEntries] = useState([])
  const [last30, setLast30] = useState([])
  const [stats, setStats] = useState(null)
  const [insights, setInsights] = useState([])
  const [insightMessage, setInsightMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [entriesRes, last30Res, statsRes] = await Promise.all([
        getEntries(),
        getLast30(),
        getMoodStats()
      ])
      setEntries(entriesRes.data)
      setLast30(last30Res.data)
      setStats(statsRes.data)
    } catch (err) {
      if (err.response?.status !== 401) {
        setError('Failed to load data. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchInsights = useCallback(async () => {
    try {
      setInsightsLoading(true)
      const res = await getWeeklyInsights()
      setInsights(res.data.insights || [])
      setInsightMessage(res.data.message || '')
    } catch (err) {
      if (err.response?.status !== 401) {
        setInsights([])
        setInsightMessage('Could not load insights. Try again.')
      }
    } finally {
      setInsightsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    fetchInsights()
  }, [fetchData, fetchInsights])

  return {
    entries,
    last30,
    stats,
    insights,
    insightMessage,
    loading,
    insightsLoading,
    error,
    refetch: fetchData,
    refetchInsights: fetchInsights
  }
}