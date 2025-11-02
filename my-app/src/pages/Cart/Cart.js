import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import CartContainer from '../../components/CartContainer/CartContainer';
import CheckoutForm from '../../components/CheckoutForm/CheckoutForm';
import UniversalModal from "../../components/Modal/Modal.js";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickup: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart(cart.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeFromCart = (id) => {
    saveCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.pickup) {
      saveCart([]);
      setOpenSuccess(true);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CartContainer
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={() => {}}
        />

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
        title="Order Confirmed!"
        content={
            <>
            <Typography variant="h6">Thank you, {formData.name}!</Typography>
            <Typography variant="body2" color="text.secondary">
                We will contact you at {formData.email}
            </Typography>
            </>
        }
        />
    </>
  );
};

export default Cart;