import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaRegCheckCircle } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

// Function to format date as dd-mm-yyyy
const formatDate = (dateString) => {
  if (!dateString) return ''; // Handle invalid or empty date
  const date = new Date(dateString);
  const day = ("0" + date.getDate()).slice(-2); // Get day with leading zero if needed
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Get month with leading zero
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setdate] = useState("");
  const [status, setStatus] = useState("unpaid");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects.");
      }
    };

    fetchProjects();
  }, []);

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/projects/${id}`);
      window.alert("Project deleted");

      setProjects(projects.filter((project) => project.id !== id));

      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  const handleStatusClick = (project) => {
    setSelectedProject(project);
    setAmount("");
    setdate("");
    setStatus("unpaid");
    setShowStatusModal(true);
  };

  const handleStatusSave = async () => {
    try {
      await api.post(`/api/payments/add`, {
        projectId: selectedProject._id,
        amount,
        date,
        status,
      });
      setShowStatusModal(false);
      window.alert("Project status updated successfully.");
      navigate("/payments");
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" align="center" gutterBottom>
        Our Ongoing Projects
      </Typography>

      {error && (
        <Typography color="error" variant="body1" align="center" paragraph>
          {error}
        </Typography>
      )}

      <div className="flex flex-wrap justify-center gap-10">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id} sx={{ maxWidth: 345, marginBottom: 4 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  {project.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" >
                  Due Date <br/>{formatDate(project.duedate)} {/* Display formatted due date */}
                </Typography>
                <Typography variant="h6" color="primary">
                  Status:&nbsp;{project.status}
                </Typography>
              </CardContent>

              <CardActions
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(project._id)}
                  startIcon={<FaEdit />}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(project._id)}
                  startIcon={<FaTrash />}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleStatusClick(project)}
                  startIcon={<FaRegCheckCircle />}
                >
                  Update Status
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No projects available at the moment.
          </Typography>
        )}
      </div>

      <Modal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            padding: 4,
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" id="modal-title" gutterBottom>
            Update Project Payment Status
          </Typography>

          <TextField
            value={selectedProject?._id}
            readOnly
            fullWidth
            margin="normal"
            variant="outlined"
            label="Project ID"
            sx={{ display: "none" }}
          />

          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="normal"
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter the amount"
          />
          <TextField
            label="date"
            type="date"
            fullWidth
            margin="normal"
            variant="outlined"
            value={date}
            onChange={(e) => setdate(e.target.value)}
            placeholder="Enter the date"
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 3,
              marginTop: 3,
              padding: 1,
              borderRadius: 1,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              boxShadow: 2,
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Button
              onClick={() => setShowStatusModal(false)}
              variant="outlined"
              color="secondary"
              sx={{
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "8px",
                borderColor: "#ff4081",
                color: "#ff4081",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "#ff4081",
                  color: "#fff",
                  borderColor: "#ff4081",
                  transform: "scale(1.05)",
                },
              }}
              startIcon={<FaRegCheckCircle />}
            >
              Cancel
            </Button>

            <Button
              onClick={handleStatusSave}
              variant="contained"
              sx={{
                fontWeight: "bold",
                padding: "10px 20px",
                borderRadius: "8px",
                background: "linear-gradient(45deg, #6a11cb, #2575fc)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                color: "#fff",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  background: "linear-gradient(45deg, #2575fc, #6a11cb)",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                  transform: "scale(1.05)",
                },
              }}
              startIcon={<FaRegCheckCircle />}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default Projects;
