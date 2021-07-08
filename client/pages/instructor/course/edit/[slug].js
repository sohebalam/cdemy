import { useState, useEffect } from "react"
import axios from "axios"
import InstructorRoute from "../../../../components/routes/InstructorRoute"
import CourseCreateForm from "../../../../components/forms/CourseCreateForm"
import Resizer from "react-image-file-resizer"
import { toast } from "react-toastify"
import { useRouter } from "next/router"
import Item from "antd/lib/list/Item"
import { Avatar, List } from "antd"
import { DeleteOutlined } from "@ant-design/icons"

const CourseEdit = () => {
  const router = useRouter()
  // state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    category: "",
    loading: false,
    lessons: [],
  })
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState("")
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image")

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    let file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
    setUploadButtonText(file.name)
    setValues({ ...values, loading: true })
    // resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: uri,
        })
        console.log("IMAGE UPLOADED", data)
        // set image in the state
        setImage(data)
        setValues({ ...values, loading: false })
      } catch (err) {
        console.log(err)
        setValues({ ...values, loading: false })
        toast("Image upload failed. Try later.")
      }
    })
  }

  const handleImageRemove = async () => {
    try {
      // console.log(values);
      setValues({ ...values, loading: true })
      const res = await axios.post("/api/course/remove-image", { image })
      setImage({})
      setPreview("")
      setUploadButtonText("Upload Image")
      setValues({ ...values, loading: false })
    } catch (err) {
      console.log(err)
      setValues({ ...values, loading: false })
      toast("Image upload failed. Try later.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // console.log(values);
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      })
      toast("Course Updated")
      //   router.push("/instructor")
    } catch (err) {
      toast(err.response.data)
    }
  }

  const { slug } = router.query

  useEffect(() => {
    loadCourse()
  }, [])

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`)
    if (data) {
      setValues(data)
    }

    if (data && data.image) setImage(data.image)
  }

  const handelDrag = (e, index) => {
    // console.log("ON DRAG", index)
    e.dataTransfer.setData("itemIndex", index)
  }
  const handelDrop = async (e, index) => {
    // console.log("ON DROP", index)
    const movingItemIndex = e.dataTransfer.getData("itemIndex")
    const targetItemIndex = index
    let allLessons = values.lessons
    let movingItem = allLessons[movingItemIndex]
    allLessons.splice(movingItemIndex, 1)
    allLessons.splice(targetItemIndex, 0, movingItem)

    setValues({ ...values, lessons: [...allLessons] })
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    })
    // console.log("Lessons arrange", data)
    toast("Lessons rearranged")
  }

  const handelDelete = async (index) => {
    const answer = window.confirm("Are you sure you want to delete?")
    if (!answer) return
    let allLessons = values.lessons
    const removed = allLessons.splice(index, 1)
    setValues({ ...values, lessons: allLessons })
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`)
    console.log("lessondeleted", data)
  }
  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Update Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
          editPage={true}
        />
      </div>
      {/* <pre>{JSON.stringify(values, null, 4)}</pre>
      <hr />
      <pre>{JSON.stringify(image, null, 4)}</pre> */}
      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handelDrag(e, index)}
                onDrop={(e) => handelDrop(e, index)}
              >
                <Item.Meta
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>
                <DeleteOutlined
                  onClick={(e) => handelDelete(index)}
                  className="text-danger float-right"
                />
              </Item>
            )}
          ></List>
        </div>
      </div>
    </InstructorRoute>
  )
}

export default CourseEdit
