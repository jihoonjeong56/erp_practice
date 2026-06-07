import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.post("/api/auth/signup", form);
      alert("회원가입이 완료됐습니다.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다. ");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>회원가입</h2>
        <form onSubmit={handleSubmit}>
          {["username", "password", "name", "email"].map((field) => (
            <input
              key={field}
              style={styles.input}
              name={field}
              type={field === "password" ? "password" : "text"}
              placeholder={
                {
                  username: "아이디",
                  password: "비밀번호",
                  name: "이름",
                  email: "이메일",
                }[field]
              }
              onChange={handleChange}
            />
          ))}
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit">
            가입하기
          </button>
        </form>
        <p style={styles.link}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
    width: "360px",
  },
  title: { textAlign: "center", marginBottom: "24px", color: "#1a1a2e" },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxSizing: "border-box",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },
  error: { color: "red", fontSize: "13px", marginBottom: "8px" },
  link: { textAlign: "center", marginTop: "16px", fontSize: "13px" },
};
