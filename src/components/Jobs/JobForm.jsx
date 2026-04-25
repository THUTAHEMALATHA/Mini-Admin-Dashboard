import { useState, useEffect } from "react";
import "./JobForm.css";

const JobForm = ({ job, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    location: "",
    type: "Full-time",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        salary: job.salary || "",
        location: job.location || "",
        type: job.type || "Full-time",
      });
    }
  }, [job]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.salary.trim()) {
      newErrors.salary = "Salary is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="job-form-overlay">
      <div className="job-form-container">
        <h2>{job ? "Edit Job" : "Create New Job"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Senior React Developer"
              className={errors.title ? "error" : ""}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary *</label>
            <input
              type="text"
              id="salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., $80,000 - $120,000"
              className={errors.salary ? "error" : ""}
            />
            {errors.salary && (
              <span className="error-text">{errors.salary}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., New York, NY (Remote)"
              className={errors.location ? "error" : ""}
            />
            {errors.location && (
              <span className="error-text">{errors.location}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="type">Job Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="submit-btn">
              {submitting ? "Saving..." : job ? "Update Job" : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
