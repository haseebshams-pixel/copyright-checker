import axios from "axios";
import * as mime from "mime";
import React, { useState } from "react";
import "./App.css";
import youtube from "./youtube";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";

function CopyRight() {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState(null);
  const onAudioChange = async (e) => {
    setData(null);
    setLoader(true);
    let file = e.target.files[0];
    let fileName = e.target.files[0].name;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/users/download",
        formData
      );
      let response = await fetch(
        "http://localhost:8000/public/files/target.mp3"
      );
      let data1 = await response.blob();
      let metadata = {
        type: mime.getType("http://localhost:8000/public/files/target.mp3"),
      };
      let fileObj = new File([data1], "test.mp3", metadata);

      const data = new FormData();
      data.append("file", fileObj);

      const options = {
        method: "POST",
        url: "https://shazam-core.p.rapidapi.com/v1/tracks/recognize",
        headers: {
          "X-RapidAPI-Key":
            "YOUR_API",
          "X-RapidAPI-Host": "shazam-core.p.rapidapi.com",
        },
        data: data,
      };
      axios
        .request(options)
        .then(async function (response) {
          if (response?.data?.matches?.length > 0) {
            try {
              const res = await youtube.get("/search", {
                params: {
                  q:
                    response?.data?.track?.title +
                    " " +
                    response?.data?.track?.subtitle,
                },
              });
              const res2 = await axios.get(
                `https://www.googleapis.com/youtube/v3/videos?id=${res?.data?.items[0]?.id?.videoId}&key={YOUR_KEY}&part=snippet,contentDetails,status`
              );
              setData(res2?.data?.items[0]);
              setLoader(false);
            } catch (err) {
              console.error(err);
              setLoader(false);
            }
          }
          setLoader(false);
        })
        .catch(function (error) {
          console.error(error);
          setLoader(false);
        });
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <div className="container row justify-content-center">
        <div className="col-3">
          <label className="form-label">
            <b>Choose your audio file</b>
          </label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            accept=".mp3"
            onChange={(e) => onAudioChange(e)}
          />
          {loader ? (
            <Spinner animation="border" className="mt-3" />
          ) : data ? (
            <div className="card mt-3">
              <img
                src={data?.snippet?.thumbnails["default"].url}
                className="card-img-top"
                alt="..."
              />
              <div className="card-body">
                <h5 className="card-title">{data?.snippet?.title}</h5>
                <p className="card-text">
                  License By: <b> {data?.status?.license}</b>
                </p>
                <p className="card-text">
                  Copyright Status:{" "}
                  {data?.contentDetails?.licensedContent ? (
                    <b>True</b>
                  ) : (
                    <b>False</b>
                  )}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${data?.id}`}
                  className="btn btn-primary"
                  target="_blank"
                >
                  Go
                </a>
              </div>
            </div>
          ) : (
            !loader && <p className="mt-3">No Match found!!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CopyRight;
