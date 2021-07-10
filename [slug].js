import { useState, useEffect, createElement } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import StudentRoute from "./client/components/routes/StudentRoute"
import { Button, Menu, Avatar } from "antd"
import ReactPlayer from "react-player"
import ReactMarkdown from "react-markdown"
import {
  PlayCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
} from "@ant-design/icons"

const { Item } = Menu
const SingleCourse = () => {
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState({ lessons: [] })
  const [clicked, setClicked] = useState(-1)
  const [collapsed, setCollapsed] = useState(false)
  const [completedLessons, setCompletedLessons] = useState([])
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

  const markCompleted = async () => {
    try {
      const { data } = await axios.post(`/api/mark-completed`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      })
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (course) loadCompletedLessons()
  }, [course])

  const loadCompletedLessons = async () => {
    try {
      const { data } = await axios.post(`/api/list-completed`, {
        courseId: course._id,
      })
      console.log("completed lessons", data)
      setCompletedLessons(data)
    } catch (error) {}
  }

  return (
    <StudentRoute>
      <div className="row">
        <div style={{ maxWidth: 320 }}>
          <Button
            className="text-primary mt-1 btn-block mb-2"
            onClick={() => setCollapsed(!collapsed)}
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            {!collapsed && "Lessons"}
          </Button>
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            // style={{ height: "80vh", overflow: "scroll" }}
          >
            {/* {course.lessons &&
              course.lessons.map((lesson, index) => (
                <Item
                  onClick={() => setClicked(index)}
                  key={index}
                  icon={<Avatar>{index + 1}</Avatar>}
                >
                  {lesson.title.substring(0, 30)}
                  {completedLessons && completedLessons.includes(lesson._id) ? (
                    <CheckCircleFilled
                      className="float-right text-primary ml-2"
                      style={{ marginTop: "13px" }}
                    />
                  ) : (
                    <MinusCircleFilled
                      className="float-right text-danger ml-2"
                      style={{ marginTop: "13px" }}
                    />
                  )}
                </Item>
              ))} */}
          </Menu>
        </div>
        <div className="col">
          {clicked !== -1 ? (
            <>
              <div className="col alert alert-primary square">
                <b>{course.lessons[clicked].title.substring(0, 30)}</b>
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span
                    className="float-right pointer"
                    onClick={markIncompleted}
                  >
                    Mark as incompleted
                  </span>
                ) : (
                  <span className="float-right pointer" onClick={markCompleted}>
                    Mark as completed
                  </span>
                )}
              </div>
              {course.lessons[clicked].video &&
                course.lessons[clicked].video.Location && (
                  <>
                    <div className="wrapper">
                      <ReactPlayer
                        className="player"
                        url={course.lessons[clicked].video.Location}
                        width="100%"
                        height="100%"
                        controls
                      />
                    </div>
                  </>
                )}
              <ReactMarkdown>{course.lessons[clicked].content}</ReactMarkdown>
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <p className="lead">Click on the lessons to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  )
}

export default SingleCourse
