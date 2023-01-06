import { useRef, useState, useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import { io } from "socket.io-client";
import usersApi from "../api/usersApi";
import Loader from "./Loader";
import { BE } from "../constants/userConstants";

const ADMIN_ID = "6372572b9c3d66fe0b28a2dc";

export default function Chat({ user }) {
  const socket = useMemo(() => io(BE, { auth: { id: user._id } }), [user._id]);

  const now = new Date();
  const f = new Intl.DateTimeFormat("vi-vn", {
    minute: "2-digit",
    hour: "2-digit",
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    const getChat = async () => {
      setLoading(true);
      const res = await usersApi.getChat(user.token);
      if (res?.chat) setList(res.chat);
      setLoading(false);
    };
    getChat();
  }, []);

  const openChat = () => {
    setOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };
  const scrollRef = useRef();
  const inputRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const { value } = inputRef.current;
    const payload = {
      user: ADMIN_ID,
      text: value,
    };
    socket.emit("sendMessage", { from: user._id, ...payload });
    usersApi.createChat({ chat: payload }, user.token);
    inputRef.current.value = "";
    inputRef.current.focus();
  };

  const appendMessage = (payload) => {
    setList((prev) => [...prev, { ...payload, time: f.format(now) }]);
  };

  useEffect(() => {
    socket.on("getMessage", (data) => {
      appendMessage(data);
    });
    socket.on("connect_error", (data) => {
      console.log(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.emit("addUserOnline", user._id);
  }, [user._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list.length]);
  return (
    <>
      <Button
        className={"chat-box rounded " + (open ? "d-none" : "")}
        variant="info"
        onClick={openChat}
      >
        Chat with Admin
      </Button>
      <section className={"msger " + (open ? "" : "hidden-chat")}>
        <header className="msger-header">
          <div className="msger-header-title">
            <i className="fas fa-comment-alt"></i> Chat với người bán
          </div>
          <div className="msger-header-options" onClick={() => setOpen(false)}>
            <i className="fas fa-times"></i>
          </div>
        </header>

        <main className={"msger-chat" + (loading ? " d-flex" : "")}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {list.map((chat, index) => (
                <div
                  key={index}
                  className={`msg ${chat.isAdmin ? "left" : "right"}-msg`}
                >
                  <div className="msg-img"></div>

                  <div className="msg-bubble">
                    <div className="msg-info">
                      <div className="msg-info-name">
                        {chat.isAdmin ? "Admin" : user.name}
                      </div>
                      <div className="msg-info-time">{chat.time}</div>
                    </div>

                    <div
                      style={{ float: "left", clear: "both" }}
                      className="msg-text"
                    >
                      {chat.text}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef}></div>
            </>
          )}
        </main>

        <form className="msger-inputarea" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            className="msger-input"
            placeholder="Nhập nội dung..."
            required
          />
          <button type="submit" className="msger-send-btn">
            Gửi
          </button>
        </form>
      </section>
    </>
  );
}
