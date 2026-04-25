import { useState, useEffect } from "react";
import Layout from "../components/Dashboard/Layout";
import { ToastContainer, useToast } from "../components/Jobs/Toast";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import "./SavedJobs.css";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  const fetchSavedJobs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select(
          `
          id,
          job_id,
          created_at,
          jobs (
            id,
            title,
            salary,
            location,
            type,
            created_at
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (err) {
      addToast("Failed to load saved jobs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  const handleRemoveSaved = async (savedJobId) => {
    if (!confirm("Remove this job from saved?")) return;

    try {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("id", savedJobId);

      if (error) throw error;

      addToast("Job removed from saved", "success");
      fetchSavedJobs();
    } catch (err) {
      addToast(err.message || "Failed to remove job", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="saved-jobs-page">
        <div className="page-header">
          <div>
            <h1>Saved Jobs</h1>
            <p>Your bookmarked job listings</p>
          </div>
          <span className="job-count">{savedJobs.length} jobs</span>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading saved jobs...</p>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">⭐</span>
            <h2>No saved jobs yet</h2>
            <p>Save jobs from the dashboard to view them here</p>
          </div>
        ) : (
          <div className="saved-jobs-grid">
            {savedJobs.map(({ id, jobs: job }) => (
              <div key={id} className="saved-job-card">
                <div className="card-header">
                  <h3>{job?.title}</h3>
                  <button
                    onClick={() => handleRemoveSaved(id)}
                    className="remove-btn"
                    title="Remove from saved"
                  >
                    ×
                  </button>
                </div>

                <div className="card-details">
                  <div className="detail">
                    <span className="label">💰 Salary</span>
                    <span className="value">{job?.salary}</span>
                  </div>
                  <div className="detail">
                    <span className="label">📍 Location</span>
                    <span className="value">{job?.location}</span>
                  </div>
                  <div className="detail">
                    <span className="label">💼 Type</span>
                    <span
                      className={`value type-badge type-${job?.type?.toLowerCase().replace(" ", "-")}`}
                    >
                      {job?.type}
                    </span>
                  </div>
                  <div className="detail">
                    <span className="label">📅 Saved</span>
                    <span className="value">{formatDate(id)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </Layout>
  );
};

export default SavedJobs;
