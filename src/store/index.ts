import Taro from '@tarojs/taro'
import create from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  openid: string | null
  avatar: string
  nickname: string
  isLogin: boolean
}

interface AppState {
  term: string
  termStart: string
  swiper: any[]
  post: string
  theme: 'auto' | 'light' | 'dark'
}

interface CacheState {
  weather: any
  sentence: string
}

interface FavoritesState {
  websites: string[]
  life: string[]
}

export interface GpaCourse {
  id: number
  name: string
  credit: number
  score: number
}

export interface HistoryItem {
  type: 'website' | 'life' | 'library'
  id: string
  title: string
  time: number
}

interface StoreState {
  user: UserState
  app: AppState
  cache: CacheState
  favorites: FavoritesState
  history: HistoryItem[]
  gpaCourses: GpaCourse[]

  setUser: (user: Partial<UserState>) => void
  setApp: (app: Partial<AppState>) => void
  setCache: (cache: Partial<CacheState>) => void
  setTerm: (term: string) => void
  setSwiper: (swiper: any[]) => void
  setPost: (post: string) => void
  setTheme: (theme: 'auto' | 'light' | 'dark') => void
  setTermStart: (termStart: string) => void
  setWeather: (weather: any) => void
  setSentence: (sentence: string) => void
  setOpenid: (openid: string | null) => void
  setAvatar: (avatar: string) => void
  setNickname: (nickname: string) => void
  setIsLogin: (isLogin: boolean) => void
  toggleFavoriteWebsite: (name: string) => void
  toggleFavoriteLife: (name: string) => void
  addHistory: (item: HistoryItem) => void
  clearHistory: () => void
  clearFavorites: () => void

  setGpaCourses: (courses: GpaCourse[]) => void
}

const taroStorage = {
  getItem: (name: string): string | null => {
    try {
      return Taro.getStorageSync(name) || null
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string) => {
    try {
      Taro.setStorageSync(name, value)
    } catch {}
  },
  removeItem: (name: string) => {
    try {
      Taro.removeStorageSync(name)
    } catch {}
  },
}

const useStore = create<StoreState>(
  persist(
    (set) => ({
      user: {
        openid: null,
        avatar: '',
        nickname: '',
        isLogin: false,
      },
      app: {
        term: '',
        termStart: '',
        swiper: [],
        post: '',
        theme: 'light',
      },
      cache: {
        weather: null,
        sentence: '',
      },
      favorites: {
        websites: [],
        life: [],
      },
      history: [],
      gpaCourses: [],

      setUser: (user) =>
        set((state) => ({
          user: { ...state.user, ...user },
        })),

      setApp: (app) =>
        set((state) => ({
          app: { ...state.app, ...app },
        })),

      setCache: (cache) =>
        set((state) => ({
          cache: { ...state.cache, ...cache },
        })),

      setTerm: (term) =>
        set((state) => ({
          app: { ...state.app, term },
        })),

      setSwiper: (swiper) =>
        set((state) => ({
          app: { ...state.app, swiper },
        })),

      setPost: (post) =>
        set((state) => ({
          app: { ...state.app, post },
        })),

      setTheme: (theme) =>
        set((state) => ({
          app: { ...state.app, theme },
        })),

      setTermStart: (termStart) =>
        set((state) => ({
          app: { ...state.app, termStart },
        })),

      setWeather: (weather) =>
        set((state) => ({
          cache: { ...state.cache, weather },
        })),

      setSentence: (sentence) =>
        set((state) => ({
          cache: { ...state.cache, sentence },
        })),

      setOpenid: (openid) =>
        set((state) => ({
          user: { ...state.user, openid },
        })),

      setAvatar: (avatar) =>
        set((state) => ({
          user: { ...state.user, avatar },
        })),

      setNickname: (nickname) =>
        set((state) => ({
          user: { ...state.user, nickname },
        })),

      setIsLogin: (isLogin) =>
        set((state) => ({
          user: { ...state.user, isLogin },
        })),

      toggleFavoriteWebsite: (name) =>
        set((state) => {
          const list = state.favorites.websites
          const next = list.includes(name)
            ? list.filter((n) => n !== name)
            : [...list, name]
          return { favorites: { ...state.favorites, websites: next } }
        }),

      toggleFavoriteLife: (name) =>
        set((state) => {
          const list = state.favorites.life
          const next = list.includes(name)
            ? list.filter((n) => n !== name)
            : [...list, name]
          return { favorites: { ...state.favorites, life: next } }
        }),

      addHistory: (item) =>
        set((state) => {
          const list = state.history.filter(
            (h) => !(h.type === item.type && h.id === item.id)
          )
          return { history: [item, ...list].slice(0, 200) }
        }),

      clearHistory: () => set({ history: [] }),

      clearFavorites: () =>
        set({ favorites: { websites: [], life: [] } }),

      setGpaCourses: (gpaCourses) => set({ gpaCourses }),
    }),
    {
      name: 'ustl-helper-store',
      getStorage: () => taroStorage,
    }
  )
)

export default useStore
