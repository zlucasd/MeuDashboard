import { useState, useEffect, useRef } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

// Syncs a value to Firestore when userId is present, otherwise uses localStorage only.
// On first sign-in, migrates existing localStorage data to Firestore automatically.
export function useCloudSync(userId, key, initialValue) {
  const lsKey = `dashboard-${key}`

  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(lsKey)
      return item ? JSON.parse(item) : initialValue
    } catch { return initialValue }
  })

  const unsubRef = useRef(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    if (!userId || !db) {
      if (unsubRef.current) { unsubRef.current(); unsubRef.current = null }
      return
    }

    const docRef = doc(db, 'users', userId, 'dashboard', key)

    unsubRef.current = onSnapshot(docRef, (snap) => {
      if (!mountedRef.current) return
      if (snap.exists()) {
        const remote = snap.data().value
        setValue(remote)
        try { window.localStorage.setItem(lsKey, JSON.stringify(remote)) } catch {}
      } else {
        // First time this user has this key — migrate from localStorage
        const local = (() => { try { const i = window.localStorage.getItem(lsKey); return i ? JSON.parse(i) : null } catch { return null } })()
        setDoc(docRef, { value: local ?? initialValue })
      }
    })

    return () => {
      mountedRef.current = false
      if (unsubRef.current) { unsubRef.current(); unsubRef.current = null }
    }
  }, [userId, key])

  const update = (newValue) => {
    const v = typeof newValue === 'function' ? newValue(value) : newValue
    setValue(v)
    try { window.localStorage.setItem(lsKey, JSON.stringify(v)) } catch {}
    if (userId && db) {
      setDoc(doc(db, 'users', userId, 'dashboard', key), { value: v })
    }
  }

  return [value, update]
}
