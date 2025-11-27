import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Paper, Typography, Box, Alert } from '@mui/material';
import CartItem from '../CartItem/CartItem';
import { updateQuantity, removeFromCart } from '../../Store/Slices/cartSlice.js';

function CartContainer() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  if (cart.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 4, fontSize: '1.2rem' }}>
        {t('cart.empty')}
      </Alert>
    );
  }

  return (
    <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {t('cart.your_cart')} ({cart.length} {t('cart.items')})
      </Typography>

      <Box sx={{ mb: 4 }}>
        {cart.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={(id, qty) => dispatch(updateQuantity({ id, quantity: qty }))}
            onRemove={(id) => dispatch(removeFromCart(id))}
          />
        ))}
      </Box>

      <Box sx={{ textAlign: 'right', borderTop: '2px solid #eee', pt: 3 }}>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {t('cart.total')}: ${total}
        </Typography>
      </Box>
    </Paper>
  );
}

export default CartContainer;