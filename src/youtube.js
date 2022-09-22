import axios from "axios";
const KEY = "AIzaSyBtUrE0bhn8loJ0p-TBr1PNLBCqyNMMGy8";

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: ["id"],
    maxResults: 5,
    key: KEY,
  },
  headers: {},
});
