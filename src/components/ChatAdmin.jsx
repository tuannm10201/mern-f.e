import { useRef, useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import usersApi from "../api/usersApi";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { BE } from "../constants/userConstants";

export default function Chat({ user, open, setOpen }) {
  const { userInfo } = useSelector((state) => state.userLogin);

  const socket = useMemo(() => io(BE, { auth: { id: user._id } }), [user._id]);

  const now = new Date();
  const f = new Intl.DateTimeFormat("vi-vn", {
    minute: "2-digit",
    hour: "2-digit",
  });

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getChat = async () => {
      setLoading(true);
      const res = await usersApi.getChat(userInfo.token, user._id);
      if (res?.chat) setList(res.chat);
      setLoading(false);
    };
    getChat();
    inputRef.current?.focus();
  }, [user._id]);

  const scrollRef = useRef();
  const inputRef = useRef();
  const handleSubmit = (e) => {
    e.preventDefault();
    const { value } = inputRef.current;
    const payload = {
      user: user._id,
      text: value,
      isAdmin: true,
    };
    socket.emit("sendMessage", payload);
    usersApi.createChat({ chat: payload }, userInfo.token, user._id);
    inputRef.current.value = "";
    inputRef.current.focus();
  };

  const appendMessage = (payload) => {
    setList((prev) => [...prev, { ...payload, time: f.format(now) }]);
  };

  useEffect(() => {
    socket.on("getMessage", ({ from, ...payload }) => {
      appendMessage(payload);
    });
    socket.on("connect_error", (data) => {
      console.log(data);
    });
  }, [user._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list.length]);
  return (
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
                className={`msg ${chat.isAdmin ? "right" : "left"}-msg`}
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
  );
}
