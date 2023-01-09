import axios from "axios";

const TOKEN = "cetf51qad3i5jsal3so0cetf51qad3i5jsal3sog"
export default axios.create({
    baseURL: "https://finnhub.io/api/v1",
    params: {
        token: TOKEN
    }
})