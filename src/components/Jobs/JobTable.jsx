import { useState } from "react";
import "./JobTable.css";

const JobTable = ({ jobs, onEdit, onDelete, onSave, savedJobIds }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="job-table-container">
      <table className="job-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Salary</th>
            <th>Location</th>
            <th>Type</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentJobs.length === 0 ? (
            <tr>
              <td colSpan="6" className="empty-message">
                No jobs found. Create your first job!
              </td>
            </tr>
          ) : (
            currentJobs.map((job) => (
              <tr key={job.id}>
                <td className="job-title">{job.title}</td>
                <td className="job-salary">{job.salary}</td>
                <td className="job-location">{job.location}</td>
                <td>
                  <span
                    className={`job-type type-${job.type?.toLowerCase().replace(" ", "-")}`}
                  >
                    {job.type}
                  </span>
                </td>
                <td className="job-date">{formatDate(job.created_at)}</td>
                <td className="job-actions">
                  <button
                    onClick={() => onSave(job.id)}
                    className={`action-btn save-btn ${savedJobIds.includes(job.id) ? "saved" : ""}`}
                    title={
                      savedJobIds.includes(job.id) ? "Unsave job" : "Save job"
                    }
                  >
                    {savedJobIds.includes(job.id) ? "⭐" : "☆"}
                  </button>
                  <button
                    onClick={() => onEdit(job)}
                    className="action-btn edit-btn"
                    title="Edit job"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(job.id)}
                    className="action-btn delete-btn"
                    title="Delete job"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`page-number ${currentPage === page ? "active" : ""}`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobTable;
