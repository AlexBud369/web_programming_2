import { Box, Typography, TextField } from '@mui/material';

function FormRow({ label, value, onChange, type = "text", required = false, fullWidth = true }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                {label} {required && <span style={{ color: 'red' }}>*</span>}
            </Typography>
            <TextField
                fullWidth={fullWidth}
                variant="outlined"
                size="small"
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                sx={{ 
                '& .MuiOutlinedInput-root': { borderRadius: 2 },
                '& .MuiInputBase-input': { fontSize: '0.95rem' }
                }}
            />
        </Box>
    );
}

export default FormRow;