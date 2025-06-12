import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DraftData {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  published: boolean
  selectedTagIds: string[]
}

interface DraftStore {
  // 当前草稿数据
  draft: DraftData
  // 是否有未保存的更改
  hasUnsavedChanges: boolean
  // 最后保存时间
  lastSavedAt: Date | null
  
  // 更新草稿字段
  updateDraft: (field: keyof DraftData, value: any) => void
  // 批量更新草稿
  setDraft: (data: Partial<DraftData>) => void
  // 清空草稿
  clearDraft: () => void
  // 标记为已保存
  markAsSaved: () => void
  // 从现有文章加载数据到草稿
  loadFromPost: (postData: Partial<DraftData>) => void
}

const initialDraft: DraftData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  published: true,
  selectedTagIds: []
}

export const useDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      hasUnsavedChanges: false,
      lastSavedAt: null,

      updateDraft: (field, value) => {
        set((state) => ({
          draft: {
            ...state.draft,
            [field]: value
          },
          hasUnsavedChanges: true
        }))
      },

      setDraft: (data) => {
        set((state) => ({
          draft: {
            ...state.draft,
            ...data
          },
          hasUnsavedChanges: true
        }))
      },

      clearDraft: () => {
        set({
          draft: initialDraft,
          hasUnsavedChanges: false,
          lastSavedAt: null
        })
      },

      markAsSaved: () => {
        set({
          hasUnsavedChanges: false,
          lastSavedAt: new Date()
        })
      },

      loadFromPost: (postData) => {
        set({
          draft: {
            ...initialDraft,
            ...postData
          },
          hasUnsavedChanges: false,
          lastSavedAt: new Date()
        })
      }
    }),
    {
      name: 'post-draft-storage',
      // 只持久化草稿数据和最后保存时间
      partialize: (state) => ({
        draft: state.draft,
        lastSavedAt: state.lastSavedAt
      })
    }
  )
) 