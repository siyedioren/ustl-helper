import { View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'

import './index.scss'

interface Exam {
  name: string
  date: string
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

const EXAMS: Exam[] = [
  { name: '英语四六级', date: getExamDate(6, 14) },
  { name: '期末考试', date: getExamDate(7, 1) },
  { name: '考研初试', date: getExamDate(12, 21) },
]

function getDaysRemaining(targetDate: string): number {
  const now = new Date()
  const target = new Date(targetDate + 'T00:00:00')
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function CountdownPage() {
  const [nowStr, setNowStr] = useState('')

  useLoad(() => {
    setNowStr(new Date().toISOString())
  })

  return (
    <View className="countdown-page">
      <View className="exam-list">
        {EXAMS.map((exam) => {
          const days = getDaysRemaining(exam.date)
          const isExpired = days <= 0

          return (
            <View key={exam.name} className="exam-card">
              <Text className="exam-name">{exam.name}</Text>
              <Text className="exam-date">{exam.date}</Text>
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
