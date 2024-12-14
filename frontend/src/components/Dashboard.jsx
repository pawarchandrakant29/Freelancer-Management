import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { teal } from "@mui/material/colors";
import * as FileSaver from "file-saver";
import Papa from "papaparse";

function AdminDashboard() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleDownloadCSV = () => {
        // Convert data to CSV format
        const csv = Papa.unparse(data);

        // Use FileSaver.js to trigger the file download
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        FileSaver.saveAs(blob, "projects.csv");
    };

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    console.log(result);
                    setData(result.data); // Set the parsed data
                },
                header: true,
            });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/projects");
                if (Array.isArray(response.data)) {
                    setData(response.data);
                } else {
                    setData([]);
                    console.error("Data is not in array format.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data.");
            }
        };

        fetchData();
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <AppBar position="static" sx={{ background: teal[500] }}>
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        Freelancer Hub
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/")}
                            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                        >
                            Dashboard
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/projects")}
                            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                        >
                            Projects
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/payments")}
                            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                        >
                            Payments
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation("/addproject")}
                            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                        >
                            Add Project
                        </Button>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            sx={{ fontWeight: "bold", textTransform: "uppercase" , background: "red" }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: teal[50], overflowY: "auto" }}>
                {error ? (
                    <Typography variant="h6" color="error" textAlign="center">
                        {error}
                    </Typography>
                ) : (
                    <>
                        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
                            {/* Import CSV Button */}
                            <Button
                                variant="contained"
                                color="primary"
                                component="label"
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Import CSV
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleImportCSV}
                                    hidden
                                />
                            </Button>

                            {/* Download CSV Button */}
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleDownloadCSV}
                                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                            >
                                Download CSV
                            </Button>
                        </Box>

                        <Outlet />
                    </>
                )}
            </Box>
        </Box>
    );
}

export default AdminDashboard;
