import { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./Analytics.css";

const ExportResults = ({ data }) => {
  const [format, setFormat] = useState("csv");
  const printFrameRef = useRef(null);

  const previewContent = useMemo(() => {
    if (format === "csv") {
      const previewCSV = `Question,Correct Percentage,Average Response Time
"${data.questionsData[0]?.title || ""}",${
        data.questionsData[0]?.correctPercentage || 0
      },${data.questionsData[0]?.avgResponseTime || 0}
...`;
      return previewCSV;
    } else if (format === "json") {
      return JSON.stringify(data, null, 2).slice(0, 200) + "...";
    }
    return "";
  }, [data, format]);

  const handleExport = () => {
    let content = "";
    let filename = `quiz-results-${new Date().toISOString().slice(0, 10)}`;
    let mimeType = "";

    setTimeout(() => {
      if (format === "csv") {
        content = generateCSV(data);
        filename += ".csv";
        mimeType = "text/csv";
        downloadFile(content, filename, mimeType);
      } else if (format === "json") {
        content = JSON.stringify(data, null, 2);
        filename += ".json";
        mimeType = "application/json";
        downloadFile(content, filename, mimeType);
      } else if (format === "pdf") {
        exportToPDF(data);
      } else if (format === "excel") {
        exportToExcel(data);
      }
    }, 0);
  };

  const downloadFile = (content, filename, mimeType) => {
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

  const exportToPDF = data => {
    const htmlContent = generatePDFContent(data);

    if (!printFrameRef.current) {
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "0";
      document.body.appendChild(iframe);
      printFrameRef.current = iframe;
    }

    const frameDoc = printFrameRef.current.contentWindow.document;
    frameDoc.open();
    frameDoc.write(htmlContent);
    frameDoc.close();

    setTimeout(() => {
      printFrameRef.current.contentWindow.focus();
      printFrameRef.current.contentWindow.print();
    }, 250);
  };

  const generatePDFContent = data => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quiz Results</title>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          h1 { color: #2563eb; text-align: center; margin-bottom: 30px; }
          h2 { color: #2563eb; margin-top: 30px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f0f9ff; font-weight: bold; }
          tr:nth-child(even) { background-color: #f9fafb; }
          .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
          .summary-item { text-align: center; padding: 15px; background-color: #f0f9ff; border-radius: 8px; width: 200px; }
          .summary-label { font-size: 14px; color: #555; }
          .summary-value { font-size: 24px; font-weight: bold; color: #2563eb; margin-top: 5px; }
          @media print {
            body { -webkit-print-color-adjust: exact; color-adjust: exact; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            thead { display: table-header-group; }
          }
        </style>
      </head>
      <body>
        <h1>Quiz Results - ${new Date().toLocaleDateString()}</h1>
        
        <div class="summary">
          <div class="summary-item">
            <div class="summary-label">Total Games</div>
            <div class="summary-value">${data.totalGames}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Average Score</div>
            <div class="summary-value">${data.averageScore}%</div>
          </div>
        </div>
        
        <h2>Questions Performance</h2>
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Correct Percentage</th>
              <th>Average Response Time</th>
            </tr>
          </thead>
          <tbody>
            ${data.questionsData
              .map(
                q => `
              <tr>
                <td>${q.title}</td>
                <td>${q.correctPercentage}%</td>
                <td>${q.avgResponseTime}s</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        
        <h2>Games History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Score</th>
              <th>Total Questions</th>
              <th>Correct Answers</th>
            </tr>
          </thead>
          <tbody>
            ${data.gamesHistory
              .map(
                g => `
              <tr>
                <td>${g.date}</td>
                <td>${g.title}</td>
                <td>${g.score}%</td>
                <td>${g.totalQuestions}</td>
                <td>${g.correctAnswers}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;
  };

  const exportToExcel = data => {
    const xlsContent = generateExcelXML(data);
    const filename = `quiz-results-${new Date()
      .toISOString()
      .slice(0, 10)}.xls`;

    const base64 = btoa(
      encodeURIComponent(xlsContent).replace(/%([0-9A-F]{2})/g, (match, p1) =>
        String.fromCharCode("0x" + p1)
      )
    );
    const dataUri = `data:application/vnd.ms-excel;base64,${base64}`;

    const a = document.createElement("a");
    a.href = dataUri;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const generateExcelXML = data => {
    let xml = '<?xml version="1.0"?>';
    xml += '<?mso-application progid="Excel.Sheet"?>';
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ';
    xml += 'xmlns:o="urn:schemas-microsoft-com:office:office" ';
    xml += 'xmlns:x="urn:schemas-microsoft-com:office:excel" ';
    xml += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ';
    xml += 'xmlns:html="http://www.w3.org/TR/REC-html40">';

    xml += "<Styles>";
    xml +=
      '<Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Bottom"/></Style>';
    xml +=
      '<Style ss:ID="Header"><Font ss:Bold="1"/><Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/></Style>';
    xml += '<Style ss:ID="Title"><Font ss:Bold="1" ss:Size="14"/></Style>';
    xml += "</Styles>";

    xml += '<Worksheet ss:Name="Summary">';
    xml += "<Table>";
    xml +=
      '<Row><Cell ss:StyleID="Title"><Data ss:Type="String">Quiz Results Summary</Data></Cell></Row>';
    xml += "<Row></Row>";
    xml += "<Row>";
    xml += '<Cell><Data ss:Type="String">Total Games</Data></Cell>';
    xml += `<Cell><Data ss:Type="Number">${data.totalGames}</Data></Cell>`;
    xml += "</Row>";
    xml += "<Row>";
    xml += '<Cell><Data ss:Type="String">Average Score</Data></Cell>';
    xml += `<Cell><Data ss:Type="Number">${data.averageScore}</Data></Cell>`;
    xml += '<Cell><Data ss:Type="String">%</Data></Cell>';
    xml += "</Row>";
    xml += "</Table>";
    xml += "</Worksheet>";

    xml += '<Worksheet ss:Name="Questions Performance">';
    xml += "<Table>";

    xml += "<Row>";
    xml +=
      '<Cell ss:StyleID="Header"><Data ss:Type="String">Question</Data></Cell>';
    xml +=
      '<Cell ss:StyleID="Header"><Data ss:Type="String">Correct Percentage</Data></Cell>';
    xml +=
      '<Cell ss:StyleID="Header"><Data ss:Type="String">Average Response Time (s)</Data></Cell>';
    xml += "</Row>";

    data.questionsData.forEach(q => {
      xml += "<Row>";
      xml += `<Cell><Data ss:Type="String">${q.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</Data></Cell>`;
      xml += `<Cell><Data ss:Type="Number">${q.correctPercentage}</Data></Cell>`;
      xml += `<Cell><Data ss:Type="Number">${q.avgResponseTime}</Data></Cell>`;
      xml += "</Row>";
    });

    xml += "</Table>";
    xml += "</Worksheet>";

    xml += '<Worksheet ss:Name="Games History">';
    xml += "<Table>";

    xml += "<Row>";
    xml +=
      '<Cell ss:StyleID="Header"><Data ss:Type="String">Date</Data></Cell>';
    xml +=
      '<Cell ss:StyleID="Header"><Data ss:Type="String">Title</Data></Cell>';
    xml +=
      '<Cell ss:StyleID="Header"><Data ss:Type="String">Score (%)</Data></Cell>';
    xml +=
      '<Cell ss:StyleID="Header"><Data ss:Type="String">Total Questions</Data></Cell>';
    xml +=
      '<Cell ss:StyleID="Header"><Data ss:Type="String">Correct Answers</Data></Cell>';
    xml += "</Row>";

    data.gamesHistory.forEach(g => {
      xml += "<Row>";
      xml += `<Cell><Data ss:Type="String">${g.date}</Data></Cell>`;
      xml += `<Cell><Data ss:Type="String">${g.title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</Data></Cell>`;
      xml += `<Cell><Data ss:Type="Number">${g.score}</Data></Cell>`;
      xml += `<Cell><Data ss:Type="Number">${g.totalQuestions}</Data></Cell>`;
      xml += `<Cell><Data ss:Type="Number">${g.correctAnswers}</Data></Cell>`;
      xml += "</Row>";
    });

    xml += "</Table>";
    xml += "</Worksheet>";

    xml += "</Workbook>";
    return xml;
  };

  const generateCSV = data => {
    if (!data.questionsData.length || !data.gamesHistory.length) {
      return "No data available";
    }

    const headers = ["Question", "Correct Percentage", "Average Response Time"];
    const questionsRows = data.questionsData.map(
      q =>
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
      g =>
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
                {previewContent}
              </pre>
            )}
            {format === "json" && (
              <pre className="preview-content json-preview">
                {previewContent}
              </pre>
            )}
            {format === "pdf" && (
              <div className="preview-content pdf-preview">
                <div className="pdf-icon">PDF</div>
                <p>
                  PDF document with formatted tables for printing or saving.
                </p>
              </div>
            )}
            {format === "excel" && (
              <div className="preview-content excel-preview">
                <div className="excel-icon">XLS</div>
                <p>
                  Excel file with multiple worksheets for each data section.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="export-actions">
        <button
          className="export-button"
          onClick={handleExport}
        >
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
          <li>
            Excel format allows for advanced data analysis in multiple
            worksheets.
          </li>
        </ul>
      </div>
    </div>
  );
};

ExportResults.propTypes = {
  data: PropTypes.shape({
    totalGames: PropTypes.number.isRequired,
    averageScore: PropTypes.number.isRequired,
    questionsData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        title: PropTypes.string.isRequired,
        correctPercentage: PropTypes.number.isRequired,
        avgResponseTime: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]).isRequired,
      })
    ).isRequired,
    gamesHistory: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        date: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
        totalQuestions: PropTypes.number.isRequired,
        correctAnswers: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ExportResults;
