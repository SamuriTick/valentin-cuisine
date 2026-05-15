'use client'

import { createContext, useContext } from 'react'

interface EditContextValue {
  editMode: boolean
  onFieldUpdate: (key: string, value: string) => Promise<void>
  onImageUpdate: (key: string, url: string) => Promise<void>
}

const EditContext = createContext<EditContextValue | null>(null)

export function useEditContext() {
  return useContext(EditContext)
}

export function EditProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: EditContextValue
}) {
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>
}
