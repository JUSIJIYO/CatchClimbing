import { useState, useEffect } from 'react'
import { getDocs } from 'firebase/firestore'

function useAdminData(baseQuery) {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!baseQuery) {
      setData([])
      return
    }
    setLoading(true)
    setError(null)
    getDocs(baseQuery)
      .then((snap) => {
        setData(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      })
      .catch((err) => {
        console.error('[useAdminData] Firestore 조회 실패:', err.message)
        setError(err.message)
        setData([])
      })
      .finally(() => setLoading(false))
  }, [baseQuery])

  return { data, loading, error }
}

export default useAdminData
