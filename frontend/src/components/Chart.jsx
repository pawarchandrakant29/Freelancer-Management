import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';
import api from '../api';

function Chart() {
    const [chartData, setChartData] = useState([]);
    const [projectCount, setProjectCount] = useState(0);
    const [completedProjectCount, setCompletedProjectCount] = useState(0);
    const [paymentCount, setPaymentCount] = useState(0);
    const [earningsData, setEarningsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                // Fetch projects data
                const projectsResponse = await api.get('/api/projects');
                const projects = Array.isArray(projectsResponse.data) ? projectsResponse.data : [];

                const activeProjects = projects.filter(project => project.status === 'Active').length;
                const completedProjects = projects.filter(project => project.status === 'Completed').length;

                setProjectCount(activeProjects);
                setCompletedProjectCount(completedProjects);

                // Fetch payments data
                const paymentsResponse = await api.get('/api/payments/pay');
                const payments = Array.isArray(paymentsResponse.data.payment) ? paymentsResponse.data.payment : [];

                // Set payment count
                setPaymentCount(payments.length);

                // Calculate earnings per month
                const earnings = calculateMonthlyEarnings(payments);
                setEarningsData(earnings);

                // Bar chart data for active/completed projects
                const newChartData = [
                    { name: 'Active Projects', value: activeProjects },
                    { name: 'Completed Projects', value: completedProjects },
                ];
                setChartData(newChartData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
                setError("Unable to load dashboard data at this time.");
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    // Helper function to calculate monthly earnings
    const calculateMonthlyEarnings = (payments) => {
        const earnings = [];
        const currentDate = new Date();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Initialize months data
        for (let i = 0; i < 12; i++) {
            earnings.push({ month: months[(currentDate.getMonth() - i + 12) % 12], earnings: 0 });
        }

        payments.forEach(payment => {
            const paymentDate = new Date(payment.date);
            const monthIndex = (currentDate.getMonth() - paymentDate.getMonth() + 12) % 12;
            earnings[monthIndex].earnings += payment.amount; // Assuming 'amount' field represents the payment amount
        });

        return earnings.reverse(); // Display from the earliest month to the most recent
    };

    return (
        <Box sx={{ padding: 4, backgroundColor: '#FAFBFD', minHeight: '100vh' }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ color: '#343A40', fontWeight: 'bold' }}>
                Analytics Dashboard
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : error ? (
                <Typography variant="body1" color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <Box>
                    <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <Card elevation={5} sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                        Active Projects
                                    </Typography>
                                    <Typography variant="h3" sx={{ color: '#FF6F61', fontWeight: 'bold' }}>
                                        {projectCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Card elevation={5} sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                        Processed Payments
                                    </Typography>
                                    <Typography variant="h3" sx={{ color: '#007BFF', fontWeight: 'bold' }}>
                                        {paymentCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Card elevation={5} sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                        Completed Projects
                                    </Typography>
                                    <Typography variant="h3" sx={{ color: '#28A745', fontWeight: 'bold' }}>
                                        {completedProjectCount}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Monthly Earnings Bar Chart */}
                    <Card elevation={5} sx={{ borderRadius: '10px', backgroundColor: '#FFFFFF', marginTop: 4 }}>
                        <CardContent>
                            <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
                                Monthly Earnings
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                {earningsData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={earningsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                                            <XAxis dataKey="month" tick={{ fontSize: 14, fill: '#6C757D' }} />
                                            <YAxis tick={{ fontSize: 14, fill: '#6C757D' }} />
                                            <Tooltip wrapperStyle={{ fontSize: '0.875rem' }} contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DEE2E6' }} />
                                            <Legend wrapperStyle={{ fontSize: '0.875rem', color: '#6C757D' }} />
                                            <Bar dataKey="earnings" fill="#007BFF" barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography align="center" color="textSecondary">
                                        No earnings data available to display.
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>

                    <Card elevation={5} sx={{ borderRadius: '10px', backgroundColor: '#FFFFFF' }}>
                        <CardContent>
                            <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#495057' }}>
                                Comparative Analysis
                            </Typography>
                            <Box sx={{ height: 400 }}>
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#DEE2E6" />
                                            <XAxis dataKey="name" tick={{ fontSize: 14, fill: '#6C757D' }} />
                                            <YAxis tick={{ fontSize: 14, fill: '#6C757D' }} />
                                            <Tooltip wrapperStyle={{ fontSize: '0.875rem' }} contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#DEE2E6' }} />
                                            <Legend wrapperStyle={{ fontSize: '0.875rem', color: '#6C757D' }} />
                                            <Bar dataKey="value" fill="#28A745" barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Typography align="center" color="textSecondary">
                                        No data available to display.
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )}
        </Box>
    );
}

export default Chart;
