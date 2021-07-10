import { useContext, useEffect, useState } from "react"
import axios from "axios"
import PreviewModal from "../../components/modal/PreviewModal"
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron"
import SingleCourseLesson from "../../components/cards/SingleCourseLesson"
import { useRouter } from "next/router"
import { Context } from "../../context"
import { toast } from "react-toastify"
const Course = ({ course }) => {
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState({})
  const router = useRouter()
  const { slug } = router.query

  const {
    state: { user },
  } = useContext(Context)

  const handelPaidEnroll = () => {
    console.log("handel paid")
  }
  const handelFreeEnroll = async (e) => {
    e.preventDefault()

    try {
      if (!user) {
        router.push("/login")
      }
      if (enrolled.status) {
        return router.push(`/user/course/${enrolled.course.slug}`)
      }

      setLoading(true)
      const { data } = await axios.post(`/api/free-enrollment/${course._id}`)
      toast(data.message)
      setLoading(false)
      return router.push(`/user/course/${data.course.slug}`)
    } catch (error) {
      toast("Enrollment failed, try again4")
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && course) checkEnrollment()
  }, [user, course, enrolled.status])

  const checkEnrollment = async () => {
    const { data } = await axios.get(`/api/check-enrollment/${course._id}`)
    console.log("enroll", data)
    setEnrolled(data)
  }

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handelPaidEnroll={handelPaidEnroll}
        handelFreeEnroll={handelFreeEnroll}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />

      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />
      {course.lessons && (
        <SingleCourseLesson
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  )
}

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`${process.env.API}/course/${query.slug}`)

  return {
    props: { course: data },
  }
}

export default Course
