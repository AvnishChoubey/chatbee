import React, { useState } from "react";
import { useSignupUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import dp from "../assets/dp.jpg";
import "./Auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  const navigate = useNavigate();

  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) return alert("Max file size is 1MB");
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", `${process.env.CLOUDINARY_UPLOAD_PRESET}`);
    setUploadingImg(true);
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_PRODUCT_ENV}/image/upload`,
        { method: "POST", body: data },
      );
      const urlData = await res.json();
      return urlData.url;
    } finally {
      setUploadingImg(false);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    if (!image) return alert("Please upload a profile picture");
    const url = await uploadImage();
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) navigate("/chat");
    });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join ChatBee today</p>
        <div className="avatar-upload">
          <img
            src={imagePreview || dp}
            className="avatar-preview"
            alt="Profile preview"
          />
          <label htmlFor="image-upload" className="avatar-label">
            <i className="fas fa-camera"></i>
          </label>
          <input
            type="file"
            id="image-upload"
            hidden
            accept="image/png,image/jpeg"
            onChange={validateImg}
          />
        </div>
        {error && <div className="auth-error">{error.data}</div>}
        <form onSubmit={handleSignup} className="auth-form">
          <label>Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="auth-btn"
            disabled={uploadingImg || isLoading}
          >
            {uploadingImg || isLoading ? "Creating account…" : "Sign Up"}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
