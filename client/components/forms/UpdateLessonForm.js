import { Button, Progress, Switch } from "antd"
import ReactPlayer from "react-player"
import { CloseCircleFilled } from "@ant-design/icons"

const UpdateLessonForm = ({
  current,
  setCurrent,
  handelVideo,
  handelUpdateLesson,
  uploadVideoButtonText,
  progress,
  uploading,
}) => {
  // console.log(current.video.Location)
  return (
    <div className="container pt-3">
      {/* {JSON.stringify(current)} */}
      <form onSubmit={handelUpdateLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          placeholder="Title"
          autoFocus
          required
        />
        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
          placeholder="Content"
        ></textarea>
        <div className="d-flex justify-content-center">
          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadVideoButtonText}
            <input onChange={handelVideo} type="file" accept="video/*" hidden />
          </label>

          {/* {!uploading && current.video && current.video.Location && (
            <div className="pt-2 d-flex justify-content-center">
              <ReactPlayer
                url={current.video.Location}
                width="410px"
                height="240px"
                controls
              />
            </div>
          )} */}
        </div>
        <div>
          {!uploading && current.video && current.video.Location && (
            <div>
              {/* {current.video.Location} */}
              <ReactPlayer
                url={current.video.Location}
                width="410px"
                height="240px"
                controls
              />
            </div>
          )}
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}
        <div className="d-flex justify-content-between">
          <span className="pt-3 badge">Preview</span>
          <Switch
            className="float-right mt-2"
            disabled={uploading}
            defaultChecked={current.free_preview}
            name="free_preview"
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>
        <Button
          onClick={handelUpdateLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  )
}

export default UpdateLessonForm
