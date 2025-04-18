import domtoimage from "dom-to-image-more";
import React, { useRef, useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [horizontal, setHorizontal] = useState("");
  const [vertical, setVertical] = useState("");
  const previewRef = useRef(null);

  const horizontalItems = horizontal.split(",").map((item) => item.trim()).filter(Boolean);

  const handleDownload = async () => {
    const node = previewRef.current;
    if (!node) return;

    const scale = 2;

    // Clone the preview with padding to avoid clipping
    const clone = node.cloneNode(true);
    const wrapper = document.createElement("div");

    wrapper.setAttribute(
      "style",
      `
      padding: 40px;
      background: #ffffff;
      display: inline-block;
      text-align: center;
      font-family: system-ui, sans-serif;
    `
    );

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const width = wrapper.offsetWidth;
    const height = wrapper.offsetHeight;

    domtoimage
      .toPng(wrapper, {
        cacheBust: true,
        width: width * scale,
        height: height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`,
          background: "#ffffff",
        },
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "t-experience-profile.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Image generation failed:", error);
      })
      .finally(() => {
        document.body.removeChild(wrapper);
      });
  };

  return (
    <div className="container">
      <h1>T-Shaped Experience Generator</h1>
      <p>Enter your name, horizontal skills, and vertical expertise.</p>

      <div className="form">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Horizontal Experiences (comma-separated)"
          rows="2"
          value={horizontal}
          onChange={(e) => setHorizontal(e.target.value)}
        />
        <input
          type="text"
          placeholder="Vertical Expertise (e.g., Java)"
          value={vertical}
          onChange={(e) => setVertical(e.target.value)}
        />
      </div>

      <div className="preview-card">
        <h2>Preview</h2>
        <div ref={previewRef} className="t-profile">
          <div className="t-name">{name}</div>
          <div className="t-horizontal-wrapper">
            <div className="t-horizontal-texts">
              {horizontalItems.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
            <div className="t-horizontal-bar" />
          </div>
          <div className="t-vertical-bar" />
          <div className="t-vertical-label">{vertical}</div>
        </div>
      </div>

      <button onClick={handleDownload}>Download as Image</button>
    </div>
  );
}

export default App;
