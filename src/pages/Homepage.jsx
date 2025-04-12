import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

function Homepage() {
  const [jobs, setJobs] = useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newJob, setNewJob] = useState({
    company: "",
    role: "",
    status: "",
    date: "",
    link: "",
  });
  const [editStatus, setEditStatus] = useState("");
  const [editJobId, setEditJobId] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [dateSort, setDateSort] = useState("");

  const fetchJobs = async (status = "", sortByDate = "") => {
    try {
      let url = "https://cuvette-backend-2kib.onrender.com/api/jobs?";
      if (status) url += `status=${status}&`;
      if (sortByDate) url += `sortByDate=${sortByDate}`;
      const res = await axios.get(url);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  const handleAddJob = async () => {
    try {
      await axios.post(
        "https://cuvette-backend-2kib.onrender.com/api/jobs",
        newJob
      );
      setShowAddPopup(false);
      setNewJob({ company: "", role: "", status: "", date: "", link: "" });
      fetchJobs(statusFilter, dateSort);
    } catch (error) {
      console.error("Failed to add job", error);
    }
  };

  const handleEditClick = async (id) => {
    try {
      const res = await axios.get(
        `https://cuvette-backend-2kib.onrender.com/api/jobs/job/${id}`
      );
      setEditStatus(res.data.status);
      setEditJobId(id);
      setShowEditPopup(true);
    } catch (error) {
      console.error("Error fetching job data:", error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(
        `https://cuvette-backend-2kib.onrender.com/api/jobs/${editJobId}`,
        { status: editStatus }
      );
      setShowEditPopup(false);
      fetchJobs(statusFilter, dateSort);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(
        `https://cuvette-backend-2kib.onrender.com/api/jobs/${id}`
      );
      fetchJobs(statusFilter, dateSort);
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-amber-100 text-white px-4 py-6 relative">
      <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        Cuvette Jobs
      </h1>

      <button
        onClick={() => setShowAddPopup(true)}
        className="bg-white text-black px-4 py-2 rounded shadow-md absolute left-4 top-20"
      >
        + Add New Job
      </button>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mt-20 mb-8">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            fetchJobs(e.target.value, dateSort);
          }}
          className="text-black px-4 py-2 rounded"
        >
          <option value="">Filter by Status</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Date Sort */}
        <select
          value={dateSort}
          onChange={(e) => {
            setDateSort(e.target.value);
            fetchJobs(statusFilter, e.target.value);
          }}
          className="text-black px-4 py-2 rounded"
        >
          <option value="">Sort by Date</option>
          <option value="asc">Oldest First</option>
          <option value="desc">Newest First</option>
        </select>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="relative border border-purple-500 rounded-xl p-4 bg-zinc-900 shadow-lg min-h-[220px] flex flex-col justify-between"
          >
            <p>company: {job.company}</p>
            <p>role: {job.role}</p>
            <p>status: {job.status}</p>
            <p>date: {job.date.slice(0, 10)}</p>
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 underline break-all"
            >
              link: {job.link}
            </a>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEditClick(job._id)}
                className="bg-white text-black px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteJob(job._id)}
                className="bg-white text-black px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Job Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Job</h2>
            {["company", "role", "status", "date", "link"].map((field) => (
              <div key={field} className="mb-2">
                <label className="block capitalize mb-1">{field}</label>
                <input
                  type="text"
                  value={newJob[field]}
                  onChange={(e) =>
                    setNewJob({ ...newJob, [field]: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
            <button
              onClick={handleAddJob}
              className="mt-4 w-full bg-black text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Edit Job Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="bg-white text-black p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Status</h2>
            <label className="block mb-1">Status</label>
            <input
              type="text"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleUpdateStatus}
              className="w-full bg-black text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>
      )}
<p className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white text-sm text-center bg-black bg-opacity-80 px-4 py-2 rounded z-50">
            Sometimes it takes time to get all data. The backend is deployed on Render,
            <br></br>
            so please have patience.
          </p>
    </div>
  );
}

export default Homepage;
