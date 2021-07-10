import { useState, useEffect } from "react"
import axios from "axios"
import { currencyFormatter } from "../../utils/helpers"
import { Badge, Button } from "antd"
import ReactPlayer from "react-player"
import { LoadingOutlined, SafetyOutlined } from "@ant-design/icons"
const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  setPreview,
  preview,
  loading,
  user,
  handelPaidEnroll,
  handelFreeEnroll,
  enrolled,
  setEnrolled,
}) => {
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course
  return (
    <div>
      <div className="jumbotron bg-primary square">
        <div className="row">
          <div className="col-md-8">
            <h1 className="text-light font-weight-bold">{name}</h1>
            <p className="lead">
              {description && description.substring(0, 160)}...
            </p>
            <Badge
              count={category}
              style={{ backgroundColor: "#03a9f4" }}
              className="pb-4 mr-2"
            />
            <p>Craeted by {instructor.name} </p>
            <p>Last updated {new Date(updatedAt).toLocaleString()} </p>
            <h4 className="text-light">
              {paid
                ? currencyFormatter({ amount: price, currency: "gbp" })
                : "Free"}{" "}
            </h4>
          </div>
          <div className="col-md-4">
            {lessons[0].video && lessons[0].video.Location ? (
              <div
                onClick={() => {
                  setPreview(lessons[0].video.Location)
                  setShowModal(!showModal)
                }}
              >
                <ReactPlayer
                  className="react-player-div"
                  url={lessons[0].video.Location}
                  light={image.Location}
                  width="100%"
                  height="225px"
                />
              </div>
            ) : (
              <div>
                <img
                  src={image.Location}
                  alt={name}
                  className="img img-fluid"
                />
              </div>
            )}
            {loading ? (
              <div className="d-flex justify-contect-center">
                <LoadingOutlined className="h1 text-danger" />
              </div>
            ) : (
              <Button
                className="mb-3 mt-2"
                type="danger"
                block
                shape="round"
                icon={<SafetyOutlined />}
                size="large"
                disabled={loading}
                onClick={paid ? handelPaidEnroll : handelFreeEnroll}
              >
                {user
                  ? enrolled.status
                    ? "Go to course"
                    : "Enroll"
                  : "Login to Enroll"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleCourseJumbotron
