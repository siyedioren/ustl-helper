import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'

import { Toast } from '@/utils/toast'

import './index.scss'

interface Exam {
  name: string
  month: number
  day: number
}

function getExamDate(month: number, day: number): string {
  const now = new Date()
  let year = now.getFullYear()
  const target = new Date(year, month - 1, day)
  if (target.getTime() < now.getTime()) {
    year += 1
  }
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getDaysRemaining(targetDate: string): number {
  const now = new Date()
  const target = new Date(targetDate + 'T00:00:00')
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function CountdownPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchExams = () => {
    setLoading(true)
    setError(false)
    Taro.cloud.callFunction({ name: 'getExams' })
      .then((res: any) => {
        const result = res.result
        if (result && result.code === 0 && Array.isArray(result.data)) {
          setExams(result.data)
        } else {
          setError(true)
        }
      })
      .catch(() => {
        setError(true)
        Toast.info('考试日期加载失败')
      })
      .finally(() => setLoading(false))
  }

  useLoad(() => {
    Taro.cloud.callFunction({ name: "userStats", data: { action: "pageView", page: "tools/countdown" } }).catch(() => {});
    fetchExams()
  })

  return (
    <View className="countdown-page">
      {loading && (
        <View className="countdown-loading">
          <Text>加载中...</Text>
        </View>
      )}

      {error && !loading && (
        <View className="countdown-error">
          <Text>考试日期加载失败</Text>
          <Text className="countdown-retry" onClick={fetchExams}>点击重试</Text>
        </View>
      )}

      <View className="exam-list">
        {exams.map((exam) => {
          const date = getExamDate(exam.month, exam.day)
          const days = getDaysRemaining(date)
          const isExpired = days <= 0

          return (
            <View key={exam.name} className="exam-card">
              <Text className="exam-name">{exam.name}</Text>
              <Text className="exam-date">{date}</Text>
              {isExpired ? (
                <Text className="exam-status">已结束</Text>
              ) : (
                <Text className="exam-days">
                  剩余 <Text className="days-number">{String(days)}</Text> 天
                </Text>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}
