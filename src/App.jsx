import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    category: "html",
    title: "",
    repoUrl: "",
    repoUrl2: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { category, title, repoUrl, repoUrl2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      repoUrl: "",
      repoUrl2: "",
      title: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError(null);
    setResponse(null);
    setLoading(true);

    try {
      const repo = category === "capstone" ? [repoUrl, repoUrl2] : [repoUrl];
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const apiUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

      const res = await fetch(`${apiUrl}/evaluate`, {
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

      if (!res.ok) {
        throw new Error("Failed to submit. Please try again.");
      }

      const data = await res.json();
      setResponse(data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sampleRepos = {
    html: "https://github.com/rohith-guvi/memory-game.git",
    react: "https://github.com/rohith00016/Add2Cart.git",
    capstone: [
      "https://github.com/sriram-R-krishnan/shoestop-backend",
      "https://github.com/sriram-R-krishnan/shoestop-frontend",
    ],
  };

  const projectTitles = {
    html: "memory game",
    react: "shopping cart",
    capstone: "e-commerce",
  };

  return (
    <div className="container" role="main">
      <h1 className="heading">Task Submission</h1>
      <form
        onSubmit={handleSubmit}
        className="form"
        aria-label="Task Submission Form"
      >
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={category}
          onChange={(e) => {
            handleInputChange(e);
            resetForm();
          }}
          className="input"
        >
          <option value="html">HTML</option>
          <option value="react">React</option>
          <option value="capstone">Capstone</option>
        </select>

        <label htmlFor="title">Project Title</label>
        <select
          id="title"
          name="title"
          value={title}
          onChange={handleInputChange}
          className="input"
          required
        >
          <option value="">Select title</option>
          {projectTitles[category] && (
            <option value={projectTitles[category]}>
              {projectTitles[category]}
            </option>
          )}
        </select>

        {category === "capstone" ? (
          <>
            <label htmlFor="repoUrl">Frontend GitHub Repository URL</label>
            <input
              type="url"
              id="repoUrl"
              name="repoUrl"
              placeholder="Enter frontend GitHub repository URL"
              value={repoUrl}
              onChange={handleInputChange}
              required
              className="input"
              autoComplete="off"
            />
            <label htmlFor="repoUrl2">Backend GitHub Repository URL</label>
            <input
              type="url"
              id="repoUrl2"
              name="repoUrl2"
              placeholder="Enter backend GitHub repository URL"
              value={repoUrl2}
              onChange={handleInputChange}
              required
              className="input"
              autoComplete="off"
            />
          </>
        ) : (
          <>
            <label htmlFor="repoUrl">GitHub Repository URL</label>
            <input
              type="url"
              id="repoUrl"
              name="repoUrl"
              placeholder="Enter GitHub repository URL"
              value={repoUrl}
              onChange={handleInputChange}
              required
              className="input"
              autoComplete="off"
            />
          </>
        )}

        <button
          type="submit"
          className="button"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      <div className="sample-repos">
        <h4>Sample Repositories:</h4>
        {category === "capstone" ? (
          <>
            <p>
              Frontend:{" "}
              <a
                href={sampleRepos.capstone[0]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sampleRepos.capstone[0]}
              </a>
            </p>
            <p>
              Backend:{" "}
              <a
                href={sampleRepos.capstone[1]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sampleRepos.capstone[1]}
              </a>
            </p>
          </>
        ) : (
          <p>
            <a
              href={sampleRepos[category]}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sampleRepos[category]}
            </a>
          </p>
        )}
      </div>

      {submitted && response && (
        <div className="response" aria-live="polite">
          <p className="message">Thank you! Your URL has been submitted.</p>
          <h3>Code extracted</h3>
          <pre className="code-block">
            <code>{response.feedback}</code>
          </pre>
        </div>
      )}
      {error && (
        <p className="error" aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
}

export default App;
