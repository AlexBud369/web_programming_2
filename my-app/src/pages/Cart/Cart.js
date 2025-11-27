import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Container, Typography } from '@mui/material';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CartContainer from '../../components/CartContainer/CartContainer';
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm';
import UniversalModal from "../../components/Modal/modal.js";
import { clearCart } from '../../Store/Slices/cartSlice.js';

const Cart = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);

  const [openSuccess, setOpenSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickup: ''
  });

  const handleCheckout = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.pickup) {
      dispatch(clearCart()); 
      setOpenSuccess(true);
      setFormData({ name: '', email: '', phone: '', pickup: '' });
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          {t('cart.title')}
        </Typography>

        <CartContainer />

        {cart.length > 0 && (
          <CheckoutForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleCheckout}
          />
        )}
      </Container>
      <Footer />

      <UniversalModal
        open={openSuccess}
        onClose={() => setOpenSuccess(false)}
        title={t('cart.success_title')}
        content={
          <>
            <Typography variant="h6">{t('cart.thank_you', { name: formData.name })}</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {t('cart.contact_message', { email: formData.email })}
            </Typography>
          </>
        }
      />
    </>
  );
};

export default Cart;