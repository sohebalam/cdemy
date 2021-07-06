import React, { useState, useEffect } from "react"
import { useRouter } from "next/router"
import InstructorRoute from "../../../../components/routes/InstructorRoute"
import axios from "axios"
import { Avatar, Tooltip, Button, Modal, List } from "antd"
import { EditOutlined, CheckOutlined, UploadOutlined } from "@ant-design/icons"

import ReactMarkdown from "react-markdown"
import { toast } from "react-toastify"

import AddLessonForm from "../../../../components/forms/addLessonForm"

const CourseView = () => {
  const [course, setCourse] = useState({})
  const [visible, setVisible] = useState(false)
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: "",
  })

  const [uploading, setUploading] = useState(false)
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video")
  const [progress, setProgress] = useState()

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    loadCourse()
  }, [slug])
  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`)
    setCourse(data)
  }

  const handleAddLesson = (e) => {
    e.preventDefault()
    console.log(values)
  }

  const handelVideo = async (e) => {
    try {
      const file = e.target.files[0]
      setUploadButtonText(file.name)
      setUploading(true)
      const videoData = new FormData()

      videoData.append("video", file)

      const { data } = await axios.post("/api/course/video-upload", videoData, {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      })

      console.log(data)
      setValues({ ...values, video: data })
      setUploading(false)
      toast("Video Upload Success")
    } catch (error) {
      console.log(error)
      setUploading(false)
      toast("Video Upload Failed")
    }
  }
  // /${course.instructor._id}
  const handelVideoRemove = async () => {
    try {
      setUploading(true)
      const { data } = await axios.post(
        `/api/course/video-remove`,
        values.video
      )
      console.log(data)
      setValues({ ...values, video: {} })
      setUploading(false)
      setUploadButtonText("Upload another video")
    } catch (err) {
      console.log(err)
      setUploading(false)
      toast("Video remove failed")
    }
  }

  return (
    <InstructorRoute>
      <div className="contianer-fluid pt-3">
        {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="media-body pl-2">
                <div className="row">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} Lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                      {course.category}
                    </p>
                  </div>

                  <div className="d-flex pt-4">
                    <Tooltip title="Edit">
                      <EditOutlined className="h5 pointer text-warning mr-4" />
                    </Tooltip>
                    <Tooltip title="Publish">
                      <CheckOutlined className="h5 pointer text-danger" />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkdown>{course.description}</ReactMarkdown>,
              </div>
            </div>
            <div className="row">
              <Button
                className="col-md-6 offset-md-3 text-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
                onClick={() => setVisible(true)}
              >
                Add Lesson
              </Button>
            </div>
            <br />
            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handelVideo={handelVideo}
                progress={progress}
                handelVideoRemove={handelVideoRemove}
              />
            </Modal>
          </div>
        )}
      </div>
    </InstructorRoute>
  )
}

export default CourseView
