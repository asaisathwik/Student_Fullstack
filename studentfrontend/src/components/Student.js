import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';

export default function BasicTextFields() {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null); // Track if editing a student

    // Fetch students on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = () => {
        setLoading(true);
        fetch("http://localhost:8080/student/getAll")
            .then((res) => res.json())
            .then((result) => {
                setStudents(result);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
                setError('Failed to load students. Please try again.');
                setLoading(false);
            });
    };

    // Handle form submission for add/edit
    const handleClick = (e) => {
        e.preventDefault();
        if (!name || !address) {
            setFormError('Both Name and Address are required');
            return;
        }
        setFormError('');
        setIsSubmitting(true);

        const student = { name, address };

        // Check if editing or adding
        const url = editId ? `http://localhost:8080/student/update/${editId}` : "http://localhost:8080/student/add";
        const method = editId ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(student)
        })
            .then((response) => {
                if (response.ok) {
                    setSuccessMessage(editId ? 'Student updated successfully!' : 'Student added successfully!');
                    setName('');
                    setAddress('');
                    setEditId(null); // Reset editId after successful update
                    fetchStudents();
                } else {
                    throw new Error(editId ? 'Failed to update student' : 'Failed to add student');
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setError(editId ? 'Failed to update student. Please try again.' : 'Failed to add student. Please try again.');
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    // Edit student handler
    const handleEdit = (student) => {
        setName(student.name);
        setAddress(student.address);
        setEditId(student.id);
        setFormError('');
        setSuccessMessage('');
    };

    // Delete student handler
    const handleDelete = (id) => {
        fetch(`http://localhost:8080/student/delete/${id}`, {
            method: "DELETE"
        })
            .then((response) => {
                if (response.ok) {
                    setSuccessMessage('Student deleted successfully!');
                    fetchStudents();
                } else {
                    throw new Error('Failed to delete student');
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setError('Failed to delete student. Please try again.');
            });
    };

    // Clear form fields
    const clearForm = () => {
        setName('');
        setAddress('');
        setFormError('');
        setSuccessMessage('');
        setEditId(null);
    };

    return (
        <Container maxWidth="sm">
            {/* Form for adding/updating student */}
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    m: 8,
                    boxShadow: 3,
                    borderRadius: 5,
                    '& > :not(style)': { m: 1, width: '100%' },
                }}
                noValidate
                autoComplete="off"
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        mb: 2,
                        color: "black",
                        fontWeight: "800",
                        textDecoration: "underline",
                        textAlign: "center",
                        fontSize: "25px"
                    }}
                >
                    {editId ? "Edit Student Information" : "Student Information"}
                </Typography>
                <TextField
                    id="student-name"
                    label="Enter Student Name"
                    variant="outlined"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={formError ? true : false}
                    helperText={formError && !name ? 'Name is required' : ''}
                />
                <TextField
                    id="student-address"
                    label="Enter Student Address"
                    variant="outlined"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    error={formError ? true : false}
                    helperText={formError && !address ? 'Address is required' : ''}
                />
                <Button variant="contained" onClick={handleClick} disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : editId ? "Update" : "Submit"}
                </Button>
                {formError && <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>{formError}</Typography>}
                {successMessage && <Typography color="success" sx={{ mt: 2, textAlign: "center" }}>{successMessage}</Typography>}
                <Button variant="outlined" onClick={clearForm} sx={{ mt: 2 }}>
                    Clear Form
                </Button>
            </Box>

            {/* Display list of students with edit and delete buttons */}
            <Paper elevation={3} sx={{ p: 2 }}>
                {loading ? (
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>Loading students...</Typography>
                ) : error ? (
                    <Typography color="error" sx={{ textAlign: 'center' }}>{error}</Typography>
                ) : (
                    students.map(student => (
                        <Paper elevation={6} sx={{ margin: "10px", padding: "15px", textAlign: "left" }} key={student.id}>
                            Id: {student.id}<br />
                            Name: {student.name}<br />
                            Address: {student.address}<br />
                            <Button variant="outlined" color="primary" sx={{ mt: 1, mr: 1 }} onClick={() => handleEdit(student)}>
                                Edit
                            </Button>
                            <Button variant="outlined" color="secondary" sx={{ mt: 1 }} onClick={() => handleDelete(student.id)}>
                                Delete
                            </Button>
                        </Paper>
                    ))
                )}
            </Paper>
        </Container>
    );
}
