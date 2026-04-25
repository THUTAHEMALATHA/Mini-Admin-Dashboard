import { useState, useEffect } from "react";
import Layout from "../components/Dashboard/Layout";
import JobTable from "../components/Jobs/JobTable";
import JobForm from "../components/Jobs/JobForm";
import { ToastContainer, useToast } from "../components/Jobs/Toast";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobIds, setSavedJobIds] = useState([]);
  const { user } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      addToast("Failed to load jobs", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved jobs
  const fetchSavedJobs = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setSavedJobIds(data?.map((s) => s.job_id) || []);
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [user]);

  // Filter jobs by search
  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Create job
  const handleCreateJob = async (formData) => {
    try {
      const { error } = await supabase.from("jobs").insert([formData]);

      if (error) throw error;

      addToast("Job created successfully!", "success");
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      addToast(err.message || "Failed to create job", "error");
    }
  };

  // Update job
  const handleUpdateJob = async (formData) => {
    try {
      const { error } = await supabase
        .from("jobs")
        .update(formData)
        .eq("id", editingJob.id);

      if (error) throw error;

      addToast("Job updated successfully!", "success");
      setEditingJob(null);
      fetchJobs();
    } catch (err) {
      addToast(err.message || "Failed to update job", "error");
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const { error } = await supabase.from("jobs").delete().eq("id", jobId);

      if (error) throw error;

      addToast("Job deleted successfully!", "success");
      fetchJobs();
    } catch (err) {
      addToast(err.message || "Failed to delete job", "error");
    }
  };

  // Save/unsave job
  const handleSaveJob = async (jobId) => {
    if (!user) return;

    const isSaved = savedJobIds.includes(jobId);

    try {
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from("saved_jobs")
          .delete()
          .eq("user_id", user.id)
          .eq("job_id", jobId);

        if (error) throw error;
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        addToast("Job removed from saved", "info");
      } else {
        // Add to saved
        const { error } = await supabase
          .from("saved_jobs")
          .insert([{ user_id: user.id, job_id: jobId }]);

        if (error) throw error;
        setSavedJobIds((prev) => [...prev, jobId]);
        addToast("Job saved successfully!", "success");
      }
    } catch (err) {
      addToast(err.message || "Failed to save job", "error");
    }
  };

  return (
    <Layout>
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Job Listings</h1>
            <p>Manage your job postings</p>
          </div>
          <button onClick={() => setShowForm(true)} className="create-btn">
            + Create Job
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs by title, location, or type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <JobTable
            jobs={filteredJobs}
            onEdit={setEditingJob}
            onDelete={handleDeleteJob}
            onSave={handleSaveJob}
            savedJobIds={savedJobIds}
          />
        )}

        {showForm && (
          <JobForm
            onSubmit={handleCreateJob}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingJob && (
          <JobForm
            job={editingJob}
            onSubmit={handleUpdateJob}
            onCancel={() => setEditingJob(null)}
          />
        )}

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </Layout>
  );
};

export default Dashboard;
