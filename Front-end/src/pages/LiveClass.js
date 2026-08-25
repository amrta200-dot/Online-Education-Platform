import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LiveKitRoom,
  VideoConference,
  useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import "../styles/live-class.css";

const API_URL = import.meta.env.VITE_API_URL;
function IconMic({ muted = false }) {
  return muted ? (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4L20 20"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M9 9V5.5C9 3.57 10.34 2 12 2C13.66 2 15 3.57 15 5.5V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 11V12C7 14.76 9.24 17 12 17C13.04 17 14.01 16.68 14.82 16.13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M17 11V12C17 12.55 16.91 13.08 16.74 13.57"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 17V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 21H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none">
      <rect
        x="8"
        y="2"
        width="8"
        height="13"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M5 11V12C5 15.87 8.13 19 12 19C15.87 19 19 15.87 19 12V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 19V22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 22H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconCamera({ off = false }) {
  return off ? (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4L20 20"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M9 6H6C4.9 6 4 6.9 4 8V16C4 17.1 4.9 18 6 18H15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 8L19 6V18L15 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="6"
        width="13"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16 10L21 7V17L16 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconScreen() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 21H16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 17V21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconComment() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M20 11.5C20 16.194 16.194 20 11.5 20C9.973 20 8.55 19.605 7.3 18.9L3 20.5L4.6 16.2C3.9 14.95 3.5 13.527 3.5 12C3.5 7.306 7.306 3.5 12 3.5C16.694 3.5 20 7.306 20 11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconFullscreen() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M8 3H5C3.9 3 3 3.9 3 5V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 3H19C20.1 3 21 3.9 21 5V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 21H5C3.9 21 3 20.1 3 19V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 21H19C20.1 21 21 20.1 21 19V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconExitFullscreen() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M9 3V7C9 8.1 8.1 9 7 9H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 3V7C15 8.1 15.9 9 17 9H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 21V17C9 15.9 8.1 15 7 15H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 21V17C15 15.9 15.9 15 17 15H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconSend() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M21.5 3L10 14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.5 3L15 21L10 14.5L3 10L21.5 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconLeave() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M10 17L15 12L10 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 12H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M21 19V5C21 3.9 20.1 3 19 3H14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconWifi() {
  return (
    <svg viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.55a11 11 0 0 1 14 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8.5 16a6 6 0 0 1 7 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 19H12.01"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function LiveClassRoom() {
  const room = useRoomContext();
  const videoAreaRef = useRef(null);
  const [micEnabled, setMicEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [screenEnabled, setScreenEnabled] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  // عدد التعليقات الجديدة التي لم يفتحها المستخدم
  const [unreadComments, setUnreadComments] = useState(0);
  const [userName, setUserName] = useState("مستخدم");
  const [isFullscreen, setIsFullscreen] = useState(false);
useEffect(() => {
  if (!room) return;
  const updateUserName = () => {
    const participant = room.localParticipant;
    const name =
      participant?.name?.trim() ||
      participant?.identity ||
      "مستخدم";
    setUserName(name);
  };
  // أول مرة
  updateUserName();

  // لو الاسم اتغير
  room.on(
    "participantNameChanged",
    updateUserName
  );

  return () => {
    room.off(
      "participantNameChanged",
      updateUserName
    );
  };
}, [room]);

/* =========================================================
   COMMENTS
========================================================= */

useEffect(() => {
  if (!room) return;

  const handleDataReceived = (
    payload,
    participant
  ) => {
    try {
      const decoder = new TextDecoder();

      const message = JSON.parse(
        decoder.decode(payload)
      );

      // نتعامل فقط مع رسائل التعليقات
      if (message.type !== "comment") {
        return;
      }

      /*
        الاسم الحقيقي لصاحب التعليق:

        1. participant.name
           وهو الاسم الذي أرسله LiveKit من الـ token

        2. message.sender
           احتياطي

        3. participant.identity
           احتياطي أخير

        4. مستخدم
      */

      const senderName =
        participant?.name?.trim() ||
        message.sender?.trim() ||
        participant?.identity ||
        "مستخدم";

      const newComment = {
        ...message,
        sender: senderName,
      };

      // إضافة التعليق للقائمة
      setComments((prev) => [
        ...prev,
        newComment,
      ]);

      /*
        لو المستخدم فاتح التعليقات:
        لا نزيد عداد unread.

        لو التعليقات مقفولة:
        نزود العداد.
      */

      if (!commentsOpen) {
        setUnreadComments((prev) => prev + 1);
      }

    } catch (error) {
      console.error(
        "Comment receive error:",
        error
      );
    }
  };

  room.on(
    "dataReceived",
    handleDataReceived
  );

  return () => {
    room.off(
      "dataReceived",
      handleDataReceived
    );
  };
}, [room, commentsOpen]);

  /* =========================================================
     TRACK STATES
  ========================================================= */

  useEffect(() => {
    if (!room) return;

    const updateTrackStates = () => {
      setMicEnabled(
        room.localParticipant
          .isMicrophoneEnabled
      );

      setCameraEnabled(
        room.localParticipant
          .isCameraEnabled
      );

      setScreenEnabled(
        room.localParticipant
          .isScreenShareEnabled
      );
    };

    updateTrackStates();

    room.on(
      "localTrackPublished",
      updateTrackStates
    );

    room.on(
      "localTrackUnpublished",
      updateTrackStates
    );

    return () => {
      room.off(
        "localTrackPublished",
        updateTrackStates
      );

      room.off(
        "localTrackUnpublished",
        updateTrackStates
      );
    };
  }, [room]);

  /* =========================================================
     MICROPHONE
  ========================================================= */

const toggleMicrophone = async () => {
  try {
    const newState =
      !room.localParticipant.isMicrophoneEnabled;

    await room.localParticipant.setMicrophoneEnabled(
      newState
    );

    setMicEnabled(
      room.localParticipant.isMicrophoneEnabled
    );
  } catch (error) {
    console.error(
      "Microphone error:",
      error
    );

    setMicEnabled(false);
  }
};

  /* =========================================================
     CAMERA
  ========================================================= */
const toggleCamera = async () => {
  try {
    const newState =
      !room.localParticipant.isCameraEnabled;

    await room.localParticipant.setCameraEnabled(
      newState
    );

    setCameraEnabled(
      room.localParticipant.isCameraEnabled
    );
  } catch (error) {
    console.error(
      "Camera error:",
      error
    );

    setCameraEnabled(false);
  }
};

  /* =========================================================
     SCREEN SHARE
  ========================================================= */
const toggleScreenShare = async () => {
  try {
    const newState =
      !room.localParticipant.isScreenShareEnabled;

    await room.localParticipant.setScreenShareEnabled(
      newState
    );

    setScreenEnabled(
      room.localParticipant.isScreenShareEnabled
    );
  } catch (error) {
    console.error(
      "Screen share error:",
      error
    );

    setScreenEnabled(false);
  }
};
  /* =========================================================
     FULLSCREEN
  ========================================================= */

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await videoAreaRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(
        "Fullscreen error:",
        error
      );
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        Boolean(document.fullscreenElement)
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  /* =========================================================
     SEND COMMENT
  ========================================================= */

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const text = comment.trim();

    if (!text || !room) {
      return;
    }

    try {
        const currentUserName =
          room.localParticipant?.name?.trim() ||
          userName ||
          room.localParticipant?.identity ||
          "مستخدم";

        const message = {
          type: "comment",
          text,
          sender: currentUserName,
          timestamp: Date.now(),
        };

      const encoder = new TextEncoder();

      const data = encoder.encode(
        JSON.stringify(message)
      );

      await room.localParticipant.publishData(
        data,
        {
          reliable: true,
        }
      );

      setComments((prev) => [
        ...prev,
        message,
      ]);
      
      setComment("");

      setComment("");
    } catch (error) {
      console.error(
        "Comment send error:",
        error
      );
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="live-class-room">

      {/* =====================================================
          VIDEO AREA
      ===================================================== */}

      <div
        ref={videoAreaRef}
        className={`live-video-area ${
          isFullscreen
            ? "is-fullscreen"
            : ""
        }`}
      >

        <div className="live-video" data-lk-theme="default">
          <VideoConference />
        </div>

        {/* ===================================================
            CUSTOM CONTROLS
        =================================================== */}

        <div className="custom-controls">

          {/* MIC */}

          <button
            type="button"
            className={`control-btn ${
              !micEnabled
                ? "control-btn--off"
                : ""
            }`}
            onClick={toggleMicrophone}
            title={
              micEnabled
                ? "إيقاف الميكروفون"
                : "تشغيل الميكروفون"
            }
          >
            <IconMic
              muted={!micEnabled}
            />
          </button>

          {/* CAMERA */}

          <button
            type="button"
            className={`control-btn ${
              !cameraEnabled
                ? "control-btn--off"
                : ""
            }`}
            onClick={toggleCamera}
            title={
              cameraEnabled
                ? "إيقاف الكاميرا"
                : "تشغيل الكاميرا"
            }
          >
            <IconCamera
              off={!cameraEnabled}
            />
          </button>

          {/* SCREEN */}

          <button
            type="button"
            className={`control-btn ${
              screenEnabled
                ? "control-btn--active"
                : ""
            }`}
            onClick={toggleScreenShare}
            title="مشاركة الشاشة"
          >
            <IconScreen />
          </button>

          {/* COMMENTS */}

          <button
            type="button"
            className={`control-btn ${
              commentsOpen
                ? "control-btn--active"
                : ""
            }`}
            onClick={() => {
            setCommentsOpen((prev) => {
              const nextState = !prev;
            
              // لو هنفتح التعليقات
              if (nextState) {
                setUnreadComments(0);
              }
            
              return nextState;
            });
          }}
            title={
              commentsOpen
                ? "إخفاء التعليقات"
                : "إظهار التعليقات"
            }
          >
            <IconComment />

            {unreadComments > 0 && (
              <span className="comments-count">
                {unreadComments > 99
                  ? "99+"
                  : unreadComments}
              </span>
            )}
          </button>

          {/* FULLSCREEN */}

          <button
            type="button"
            className="control-btn"
            onClick={toggleFullscreen}
            title={
              isFullscreen
                ? "الخروج من ملء الشاشة"
                : "ملء الشاشة"
            }
          >
            {isFullscreen ? (
              <IconExitFullscreen />
            ) : (
              <IconFullscreen />
            )}
          </button>

          {/* LEAVE */}

          <Link
            to="/"
            className="control-btn control-btn--leave"
            title="مغادرة الحصة"
          >
            <IconLeave />
          </Link>

        </div>
      </div>

      {/* =====================================================
          COMMENTS SIDEBAR
      ===================================================== */}

      {commentsOpen && (
        <aside className="comments-sidebar">

          <div className="comments-header">

            <div>
              <h3>التعليقات</h3>

              <span>
                شارك رأيك مع المدرس والطلاب
              </span>
            </div>

            <button
              type="button"
              className="comments-close"
              onClick={() =>
                setCommentsOpen(false)
              }
              aria-label="إغلاق التعليقات"
            >
              ×
            </button>

          </div>

          <div className="comments-list">

            {comments.length === 0 ? (

              <div className="empty-comments">

                <div className="empty-comments-icon">
                  <IconComment />
                </div>

                <strong>
                  لا توجد تعليقات حتى الآن
                </strong>

                <span>
                  كن أول من يشارك تعليقًا
                </span>

              </div>

            ) : (

              comments.map(
                (item, index) => (

                  <div
                    className="comment-item"
                    key={`${item.timestamp}-${index}`}
                  >

                    <div className="comment-avatar">
                      {(
                        item.sender ||
                        "م"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="comment-body">

                      <strong>
                        {item.sender}
                      </strong>

                      <p>
                        {item.text}
                      </p>

                    </div>

                  </div>

                )
              )

            )}

          </div>

          <form
            className="comment-form"
            onSubmit={
              handleCommentSubmit
            }
          >

            <input
              type="text"
              value={comment}
              onChange={(e) =>
                setComment(
                  e.target.value
                )
              }
              placeholder="أضف تعليقًا..."
              maxLength={300}
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={
                !comment.trim()
              }
              aria-label="إرسال التعليق"
            >
              <IconSend />
            </button>

          </form>

        </aside>
      )}

    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

function LiveClass() {
  const { id } = useParams();

  const { isLoggedIn } = useAuth();

  const [isLoading, setIsLoading] =
    useState(true);

  const [token, setToken] =
    useState("");

  const [serverUrl, setServerUrl] =
    useState("");

  const [error, setError] =
    useState("");

  /* =======================================================
     GET LIVEKIT TOKEN
  ======================================================= */

  useEffect(() => {
    const getLiveKitToken =
      async () => {
        try {
          setIsLoading(true);
          setError("");

          if (!isLoggedIn) {
            setError(
              "يجب تسجيل الدخول أولاً"
            );

            return;
          }

          if (!id) {
            setError(
              "رقم الحصة غير موجود"
            );

            return;
          }

          const room =
            `lesson-${id}`;

          const response =
            await fetch(
              `${API_URL}/api/livekit/token?room=${encodeURIComponent(
                room
              )}`,
              {
                method: "GET",
                credentials: "include",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "فشل الحصول على LiveKit Token"
            );
          }

          if (!data.token) {
            throw new Error(
              "لم يتم استلام LiveKit Token من الخادم"
            );
          }

          if (!data.serverUrl) {
            throw new Error(
              "لم يتم استلام LiveKit Server URL"
            );
          }

          setToken(data.token);

          setServerUrl(
            data.serverUrl
          );

        } catch (error) {
          console.error(
            "LiveKit token error:",
            error
          );

          setError(
            error.message ||
              "حدث خطأ أثناء الدخول للحصة"
          );

        } finally {
          setIsLoading(false);
        }
      };

    getLiveKitToken();
  }, [id, isLoggedIn]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div
        className="live-class-page loading-page"
        dir="rtl"
      >

        <div className="loading-card">

          <div className="loading-spinner"></div>

          <h2>
            جاري تجهيز الحصة
          </h2>

          <p>
            لحظات ونوصلك إلى الفصل المباشر...
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div
        className="live-class-page error-page"
        dir="rtl"
      >

        <div className="error-card">

          <div className="error-icon">
            !
          </div>

          <h2>
            تعذر الدخول إلى الحصة
          </h2>

          <p>
            {error}
          </p>

          <Link
            to="/"
            className="back-home-btn"
          >
            العودة للرئيسية
          </Link>

        </div>

      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div
      className="live-class-page"
      dir="rtl"
    >

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="live-header">

        <div className="live-header-right">

          <Link
            to="/"
            className="live-logo"
          >

            <span className="logo-icon">
              A
            </span>

            <div>

              <strong>
                ANS Academy
              </strong>

              <small>
                Live Classroom
              </small>

            </div>

          </Link>

          <div className="header-divider"></div>

          <div className="lesson-info">

            <span className="live-badge">

              <span className="live-dot"></span>

              مباشر

            </span>

          </div>

        </div>

        <div className="live-header-left">

          <div className="connection-status">

            <div className="connection-icon-header">
              <IconWifi />
            </div>

            <div>

              <span>
                حالة الاتصال
              </span>

              <strong>

                <span className="status-dot"></span>

                متصل الآن

              </strong>

            </div>

          </div>

        </div>

      </header>

      {/* ===================================================
          LIVEKIT
      =================================================== */}

        <LiveKitRoom
  video={false}
  audio={false}
  token={token}
  serverUrl={serverUrl}
  connect={true}

  onMediaDeviceFailure={(error, kind) => {
    console.error(
      "LiveKit media device failure:",
      {
        error,
        kind,
      }
    );
  }}

  onError={(error) => {
    console.error(
      "LiveKit room error:",
      error
    );
  }}

  onDisconnected={() => {
    console.log(
      "Disconnected from LiveKit"
    );
  }}
>
  <LiveClassRoom />
</LiveKitRoom>


    </div>
  );
}

export default LiveClass;