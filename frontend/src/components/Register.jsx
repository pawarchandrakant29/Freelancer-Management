import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { TextField, Button, IconButton, InputAdornment, Box, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/register", { username, email, password });
            window.alert("Registration successful!");
            navigate('/login');
        } catch (error) {
            console.error("Error registering");
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "linear-gradient(to bottom right, #00796b, #004d40)",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "white",
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                    width: "100%",
                    maxWidth: 400,
                    textAlign: "center",
                }}
            >
                <Typography variant="h4" color="textPrimary" gutterBottom>
                    Create an Account
                </Typography>

                {error && <Typography color="error" variant="body2" gutterBottom>{error}</Typography>}

                <form onSubmit={handleRegister} noValidate>
                    <TextField
                        fullWidth
                        label="Name"
                        variant="outlined"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Register
                    </Button>
                </form>

                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                        Already have an account?{" "}
                        <a href="/login" style={{ color: "#00796b", textDecoration: "none" }}>
                            Log in
                        </a>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Register;
