import { Paper, Typography, Box } from '@mui/material';
import FormRow from '../FormRow/FormRow';
import ActionButton from '../ActionButton/ActionButton';

function CheckoutForm({ formData, setFormData, onSubmit }) {
  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>
            Checkout Information
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
            <FormRow
                label="Full Name"
                value={formData.name}
                onChange={handleChange('name')}
                required
            />
            <FormRow
                label="Email"
                value={formData.email}
                onChange={handleChange('email')}
                type="email"
                required
            />
            <FormRow
                label="Phone"
                value={formData.phone}
                onChange={handleChange('phone')}
                type="tel"
            />
            <FormRow
                label="Pickup Point"
                value={formData.pickup}
                onChange={handleChange('pickup')}
                required
            />

            <ActionButton
                type="submit"
                fullWidth
                size="large"
                color="success"
                sx={{ mt: 2 }}
            >
                Confirm Order
            </ActionButton>
        </Box>
    </Paper>
  );
}

export default CheckoutForm;