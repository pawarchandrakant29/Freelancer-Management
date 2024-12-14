import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { TextField, Button, IconButton, InputAdornment, Box, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/api/auth/login", { email, password });
            const token = response.data.token;
            localStorage.setItem("token", token);
            window.alert("Login successful!");
            navigate('/');
        } catch (error) {
            console.error("Error logging in:", error);
            setError("Invalid email or password. Please try again.");
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
                    Sign In
                </Typography>

                {error && <Typography color="error" variant="body2" gutterBottom>{error}</Typography>}

                <form onSubmit={handleLogin} noValidate>
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
                        Log In
                    </Button>
                </form>

                <Box sx={{ marginTop: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                        Don’t have an account?{" "}
                        <a href="/register" style={{ color: "#00796b", textDecoration: "none" }}>
                            Sign up
                        </a>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

export default Login;
