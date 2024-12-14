import { useEffect, useState } from "react";
import api from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Chip,
  Button,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/api/payments/pay");
        setPayments(response.data.payment);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("Failed to load payment data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Typography variant="h4" align="center" gutterBottom>
        Payment Records
      </Typography>

      {/* Show error if any */}
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {/* Loading Spinner */}
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      )}

      {/* Payment Table */}
      {!loading && !error && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Payment ID
                </TableCell>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Project ID
                </TableCell>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Date
                </TableCell>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Amount
                </TableCell>
                <TableCell align="left" style={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <TableRow hover key={payment._id}>
                    <TableCell>{payment._id}</TableCell>
                    <TableCell>{payment.projectId}</TableCell>
                    <TableCell>
                      {new Date(payment.date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell>
                      {payment.amount
                        ? `₹${payment.amount.toLocaleString()}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={payment.status === "paid" ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    style={{ fontStyle: "italic" }}
                  >
                    No payments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default Payments;
