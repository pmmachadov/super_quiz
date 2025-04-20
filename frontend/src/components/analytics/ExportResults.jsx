import { useState } from "react";
import "./Analytics.css";

const ExportResults = ({ data }) => {
  const [format, setFormat] = useState("csv");

  const handleExport = () => {
    let content = "";
    let filename = `quiz-results-${new Date().toISOString().slice(0, 10)}`;
    let mimeType = "";

    if (format === "csv") {
      content = generateCSV(data);
      filename += ".csv";
      mimeType = "text/csv";
    } else if (format === "json") {
      content = JSON.stringify(data, null, 2);
      filename += ".json";
      mimeType = "application/json";
    } else if (format === "pdf") {
      alert("PDF export would be implemented with a library like jsPDF.");
      return;
    } else if (format === "excel") {
      alert(
        "Excel export would be implemented with a library like ExcelJS or xlsx."
      );
      return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCSV = (data) => {
    const headers = ["Question", "Correct Percentage", "Average Response Time"];
    const questionsRows = data.questionsData.map(
      (q) =>
        `"${q.title.replace(/"/g, '""')}",${q.correctPercentage},${
          q.avgResponseTime
        }`
    );

    const gameHeaders = [
      "Date",
      "Title",
      "Score",
      "Total Questions",
      "Correct Answers",
    ];
    const gamesRows = data.gamesHistory.map(
      (g) =>
        `"${g.date}","${g.title.replace(/"/g, '""')}",${g.score},${
          g.totalQuestions
        },${g.correctAnswers}`
    );

    return [
      "STATISTICS SUMMARY",
      `Total Games,${data.totalGames}`,
      `Average Score,${data.averageScore}%`,
      "",
      "QUESTIONS PERFORMANCE",
      headers.join(","),
      ...questionsRows,
      "",
      "GAMES HISTORY",
      gameHeaders.join(","),
      ...gamesRows,
    ].join("\n");
  };

  return (
    <div className="export-results">
      <h2>Export Results</h2>

      <div className="export-options">
        <div className="format-selection">
          <h3>Select Format</h3>
          <div className="format-buttons">
            <button
              className={format === "csv" ? "format-btn active" : "format-btn"}
              onClick={() => setFormat("csv")}
            >
              CSV
            </button>
            <button
              className={format === "json" ? "format-btn active" : "format-btn"}
              onClick={() => setFormat("json")}
            >
              JSON
            </button>
            <button
              className={format === "pdf" ? "format-btn active" : "format-btn"}
              onClick={() => setFormat("pdf")}
            >
              PDF
            </button>
            <button
              className={
                format === "excel" ? "format-btn active" : "format-btn"
              }
              onClick={() => setFormat("excel")}
            >
              Excel
            </button>
          </div>
        </div>

        <div className="export-preview">
          <h3>Preview</h3>
          <div className="preview-container">
            {format === "csv" && (
              <pre className="preview-content csv-preview">
                Question,Correct Percentage,Average Response Time "
                {data.questionsData[0].title}",
                {data.questionsData[0].correctPercentage},
                {data.questionsData[0].avgResponseTime}
                ...
              </pre>
            )}
            {format === "json" && (
              <pre className="preview-content json-preview">
                {JSON.stringify(data, null, 2).slice(0, 200) + "..."}
              </pre>
            )}
            {format === "pdf" && (
              <div className="preview-content pdf-preview">
                <div className="pdf-icon">PDF</div>
                <p>
                  PDF preview would show here with proper contrast in both
                  themes.
                </p>
              </div>
            )}
            {format === "excel" && (
              <div className="preview-content excel-preview">
                <div className="excel-icon">XLS</div>
                <p>
                  Excel preview would show here with proper contrast in both
                  themes.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="export-actions">
        <button className="export-button" onClick={handleExport}>
          Export as {format.toUpperCase()}
        </button>
      </div>

      <div className="export-notes">
        <h3>Notes</h3>
        <ul>
          <li>
            CSV format is best for importing into spreadsheet applications.
          </li>
          <li>
            JSON format preserves all data structure and is ideal for technical
            users.
          </li>
          <li>PDF format provides a professional, printable report.</li>
          <li>Excel format allows for advanced data analysis.</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportResults;
