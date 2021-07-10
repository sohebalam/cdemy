import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import StudentRoute from "../../../components/routes/StudentRoute"
const SingleCourse = () => {
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState({ lessons: [] })
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    if (slug) loadCourse()
  }, [slug])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/api/user/course/${slug}`)
      setLoading(false)
      setCourse(data)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <StudentRoute>
      <h1>
        <pre>{JSON.stringify(course, null, 4)}</pre>
      </h1>
    </StudentRoute>
  )
}

export default SingleCourse
