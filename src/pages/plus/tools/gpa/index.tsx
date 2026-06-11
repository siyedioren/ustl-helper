import "./index.scss";

import { View, Text } from '@tarojs/components'
import { useState, useMemo, useEffect } from 'react'
import { Input, Button } from '@tarojs/components'

import useStore from '@/store'
import type { GpaCourse } from '@/store'

let nextId = 1

function scoreToGpa(score: number): number {
  if (score >= 90) return 4.0
  if (score >= 85) return 3.7
  if (score >= 82) return 3.3
  if (score >= 78) return 3.0
  if (score >= 75) return 2.7
  if (score >= 72) return 2.3
  if (score >= 68) return 2.0
  if (score >= 64) return 1.5
  if (score >= 60) return 1.0
  return 0.0
}

function scoreToGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 85) return 'A-'
  if (score >= 82) return 'B+'
  if (score >= 78) return 'B'
  if (score >= 75) return 'B-'
  if (score >= 72) return 'C+'
  if (score >= 68) return 'C'
  if (score >= 64) return 'C-'
  if (score >= 60) return 'D'
  return 'F'
}

export default function GpaPage() {
  const storeCourses = useStore((state) => state.gpaCourses)
  const setStoreCourses = useStore((state) => state.setGpaCourses)
  const [courses, setCourses] = useState<GpaCourse[]>(storeCourses)
  const [name, setName] = useState('')
  const [credit, setCredit] = useState('')
  const [score, setScore] = useState('')

  const stats = useMemo(() => {
    if (courses.length === 0) {
      return { totalCredits: 0, weightedScore: 0, gpa: 0 }
    }
    const totalCredits = courses.reduce((sum, c) => sum + c.credit, 0)
    const weightedScore =
      courses.reduce((sum, c) => sum + c.score * c.credit, 0) / totalCredits
    const gpa =
      courses.reduce((sum, c) => sum + scoreToGpa(c.score) * c.credit, 0) /
      totalCredits
    return {
      totalCredits,
      weightedScore: Number(weightedScore.toFixed(2)),
      gpa: Number(gpa.toFixed(2)),
    }
  }, [courses])

  const handleAdd = () => {
    const creditNum = parseFloat(credit)
    const scoreNum = parseFloat(score)
    if (!name.trim() || isNaN(creditNum) || isNaN(scoreNum)) {
      return
    }
    if (creditNum <= 0 || scoreNum < 0 || scoreNum > 100) {
      return
    }
    setCourses((prev) => [
      ...prev,
      { id: nextId++, name: name.trim(), credit: creditNum, score: scoreNum },
    ])
    setName('')
    setCredit('')
    setScore('')
  }

  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
  }

  useEffect(() => {
    setStoreCourses(courses)
    if (courses.length > 0) {
      nextId = Math.max(...courses.map((c) => c.id), 0) + 1
    }
  }, [courses])

  const handleClear = () => {
    setCourses([])
    setName('')
    setCredit('')
    setScore('')
  }

  return (
    <View className="gpa-page">
      <View className="gpa-form">
        <View className="form-row">
          <Text className="form-label">课程名</Text>
          <Input
            className="form-input"
            type="text"
            placeholder="请输入课程名"
            value={name}
            onInput={(e) => setName(e.detail.value)}
          />
        </View>
        <View className="form-row">
          <Text className="form-label">学分</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="请输入学分"
            value={credit}
            onInput={(e) => setCredit(e.detail.value)}
          />
        </View>
        <View className="form-row">
          <Text className="form-label">成绩</Text>
          <Input
            className="form-input"
            type="digit"
            placeholder="请输入成绩 (0-100)"
            value={score}
            onInput={(e) => setScore(e.detail.value)}
          />
        </View>
        <View className="form-actions">
          <Button className="btn-add" type="primary" onClick={handleAdd}>
            添加课程
          </Button>
          <Button className="btn-clear" onClick={handleClear}>
            清空
          </Button>
        </View>
      </View>

      {courses.length > 0 && (
        <View className="gpa-stats">
          <View className="stat-card">
            <Text className="stat-value">{String(stats.totalCredits)}</Text>
            <Text className="stat-label">总学分</Text>
          </View>
          <View className="stat-card">
            <Text className="stat-value">{String(stats.weightedScore)}</Text>
            <Text className="stat-label">加权平均分</Text>
          </View>
          <View className="stat-card">
            <Text className="stat-value">{String(stats.gpa)}</Text>
            <Text className="stat-label">GPA (4.0)</Text>
          </View>
        </View>
      )}

      <View className="course-list">
        {courses.length === 0 ? (
          <View className="empty-tip">
            <Text className="empty-text">暂无课程，请添加</Text>
          </View>
        ) : (
          courses.map((course) => (
            <View key={course.id} className="course-item">
              <View className="course-info">
                <Text className="course-name">{course.name}</Text>
                <Text className="course-detail">
                  {course.credit} 学分 · {course.score} 分 · {scoreToGrade(course.score)} ({scoreToGpa(course.score)})
                </Text>
              </View>
              <Button
                className="btn-delete"
                size="mini"
                onClick={() => handleDelete(course.id)}
              >
                删除
              </Button>
            </View>
          ))
        )}
      </View>
    </View>
  )
}
