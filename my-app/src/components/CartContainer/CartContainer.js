import { Paper, Typography, Box, Alert } from '@mui/material';
import CartItem from '../CartItem/CartItem';
import ActionButton from '../ActionButton/ActionButton';

function CartContainer({ cart, onUpdateQuantity, onRemove }) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    if (cart.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Your cart is empty
        </Alert>
      );
    }

    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom>
            Your Cart 
          </Typography>
          <Box sx={{ mb: 3 }}>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </Box>

          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Typography variant="h6" color="primary">
                Total: ${total}
            </Typography>
          </Box>
      </Paper>
    );
}

export default CartContainer;