import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBP07Dvey60XS4I7VgWq93_cZi-xE9Qbkc";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel(
    { model: "gemini-flash-latest" },
    { apiVersion: "v1beta" }
);

export default model;