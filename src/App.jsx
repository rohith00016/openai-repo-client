import { useState } from "react";
import "./App.css";

function App() {
  const [category, setCategory] = useState("html");
  const [title, setTitle] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoUrl2, setRepoUrl2] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);
    setResponse(null);

    try {
      const repo = category === "capstone" ? [repoUrl, repoUrl2] : [repoUrl];

      const res = await fetch(`${import.meta.env.VITE_API_URL}/evaluate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: category,
          repo,
          title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
        setSubmitted(true);
      } else {
        setError("Failed to submit. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Task Submission</h1>
      <form onSubmit={handleSubmit} className="form">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setRepoUrl("");
            setRepoUrl2("");
            setTitle("");
          }}
          className="input"
        >
          <option value="html">html</option>
          <option value="react">react</option>
          <option value="capstone">capstone</option>
        </select>

        <select
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          required
        >
          <option value="">Select title</option>
          {category === "html" && (
            <option value="memory game">memory game</option>
          )}
          {category === "react" && (
            <option value="shopping cart">shopping cart</option>
          )}
          {category === "capstone" && (
            <>
              <option value="ecommerce">e-commerce</option>
            </>
          )}
        </select>

        {category === "capstone" ? (
          <>
            <input
              type="url"
              placeholder="enter first GitHub repository URL"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              required
              className="input"
            />
            <input
              type="url"
              placeholder="enter second GitHub repository URL"
              value={repoUrl2}
              onChange={(e) => setRepoUrl2(e.target.value)}
              required
              className="input"
            />
          </>
        ) : (
          <input
            type="url"
            placeholder="enter GitHub repository URL"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            required
            className="input"
          />
        )}

        <button type="submit" className="button">
          Submit
        </button>
      </form>

      {submitted && response && (
        <div className="response">
          <p className="message">Thank you! Your URL has been submitted.</p>
          <h2>Analysis:</h2>
          <p>{response.feedback.analysis}</p>
          <h3>Scores:</h3>
          <p>{response.feedback.marks}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
