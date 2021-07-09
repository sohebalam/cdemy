import { useState } from "react"
import axios from "axios"
import PreviewModal from "../../components/modal/PreviewModal"
import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron"
import SingleCourseLesson from "../../components/cards/SingleCourseLesson"
const Course = ({ course }) => {
  const [showModal, setShowModal] = useState(false)
  const [preview, setPreview] = useState("")

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
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
