import React, { useState } from "react";

import model from "../services/geminiService";

const AIChatBot = () => {
    const [message, setMessage] =
        useState("");

    const [reply, setReply] =
        useState("");

    const sendMessage = async () => {
        const result =
            await model.generateContent(message);

        const response =
            result.response.text();

        setReply(response);
    };

    return (
        <div>
            <textarea
                value={message}
                onChange={(e) =>
                    setMessage(e.target.value)
                }
            />

            <button onClick={sendMessage}>
                Send
            </button>

            <p>{reply}</p>
        </div>
    );
};

export default AIChatBot;