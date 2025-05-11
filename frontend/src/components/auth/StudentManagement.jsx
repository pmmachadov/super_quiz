import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Auth.css";

const StudentManagement = () => {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [isEditing, setIsEditing] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setError(error.message || "An error occurred while fetching students");
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
    });
    setIsEditing(false);
    setEditingStudentId(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (isEditing) {
        // Update existing student
        const response = await fetch(
          `http://localhost:3000/api/students/${editingStudentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              ...(formData.password ? { password: formData.password } : {}),
            }),
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to update student");
        }

        setSuccess("Student updated successfully");
      } else {
        // Create new student
        if (!formData.name || !formData.email || !formData.password) {
          return setError("Please fill all required fields");
        }

        const response = await fetch("http://localhost:3000/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to create student");
        }

        setSuccess("Student created successfully");
      }

      // Refresh student list and reset form
      fetchStudents();
      resetForm();
    } catch (error) {
      setError(error.message);
      console.error("Error saving student:", error);
    }
  };

  const handleEdit = student => {
    setFormData({
      name: student.name,
      email: student.email,
      password: "", // Don't set password for editing
    });
    setIsEditing(true);
    setEditingStudentId(student.id);
  };

  const handleDelete = async studentId => {
    if (!confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/students/${studentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete student");
      }

      setSuccess("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      setError(error.message);
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div className="management-container">
      <h1>Student Management</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="management-grid">
        {/* Student Form */}
        <div className="form-section">
          <h2>{isEditing ? "Edit Student" : "Create New Student"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                {isEditing
                  ? "Password (leave blank to keep unchanged)"
                  : "Password"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                {...(isEditing ? {} : { required: true })}
              />
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="btn-primary"
              >
                {isEditing ? "Update Student" : "Create Student"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Students List */}
        <div className="list-section">
          <h2>Students List</h2>

          {loading ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <div className="students-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(student)}
                          className="btn-small btn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="btn-small btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
