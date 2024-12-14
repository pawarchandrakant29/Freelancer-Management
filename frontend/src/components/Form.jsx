import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, MenuItem, Button, Container, Typography, Box } from "@mui/material";
import api from "../api";

function Form() {
  const [formData, setFormData] = useState({
    name: "",
    duedate: "",
    status: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchProjects = async () => {
        try {
          const response = await api.get(`/api/projects/${id}`);
          setFormData(response.data);
          setIsEditMode(true);
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      };
      fetchProjects();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/api/projects/${id}`, formData);
        window.alert("Project updated successfully!");
      } else {
        await api.post("/api/projects", formData);
        window.alert("Project added successfully!");
      }
      navigate("/projects");
    } catch (error) {
      console.error("Error submitting form:", error);
      window.alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box sx={{ p: 3, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 600 }}>
          {isEditMode ? "Edit Project" : "Add Project"}
        </Typography>
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <TextField
            label="Project Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{
              backgroundColor: "#f5f5f5",
              '& .MuiInputBase-root': {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            label="Due Date"
            variant="outlined"
            type="date"
            fullWidth
            margin="normal"
            name="duedate"
            value={formData.duedate}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              backgroundColor: "#f5f5f5",
              '& .MuiInputBase-root': {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            label="Status"
            variant="outlined"
            fullWidth
            margin="normal"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            select
            sx={{
              backgroundColor: "#f5f5f5",
              '& .MuiInputBase-root': {
                borderRadius: '8px',
              },
            }}
          >
            <MenuItem value="">Select Status</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              backgroundColor: '#3f51b5',
              '&:hover': {
                backgroundColor: '#303f9f',
              },
            }}
          >
            {isEditMode ? "Update Project" : "Add Project"}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Form;
