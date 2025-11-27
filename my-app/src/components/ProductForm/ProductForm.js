import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, TextField, Typography } from '@mui/material';
import ActionButton from '../ActionButton/ActionButton.js';

function ProductForm({ product, onSave, onCancel, saving = false }) {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        name: '', brand: '', price: '', image: '', category: '',
        colors: '', sizes: '', style: '', description: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                brand: product.brand || '',
                price: product.price || '',
                image: product.image || '',
                category: product.category || '',
                colors: (product.colors || []).join(', '),
                sizes: (product.sizes || []).join(', '),
                style: product.style || '',
                description: product.description || ''
            });
        }
    }, [product]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.brand.trim()) {
            newErrors.brand = 'Brand is required';
        }
        if (!formData.price || formData.price <= 0) {
            newErrors.price = 'Valid price required';
        }
        if (!formData.image.trim()) {
            newErrors.image = 'Image URL required';
        }
        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (validate()) {
            const data = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
            };
            onSave(data);
        }
    };

    const handleChange = (field) => (e) => {
        setFormData({ ...formData, [field]: e.target.value });
        if (errors[field]) setErrors({ ...errors, [field]: '' });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
            <Typography variant="h6" gutterBottom>
                {product ? t('admin.edit_product') : t('admin.add_product')}
            </Typography>

            <TextField label="Name" value={formData.name} onChange={handleChange('name')} error={!!errors.name} helperText={errors.name} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Brand" value={formData.brand} onChange={handleChange('brand')} error={!!errors.brand} helperText={errors.brand} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Price" type="number" value={formData.price} onChange={handleChange('price')} error={!!errors.price} helperText={errors.price} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Image URL" value={formData.image} onChange={handleChange('image')} error={!!errors.image} helperText={errors.image} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Category" value={formData.category} onChange={handleChange('category')} error={!!errors.category} helperText={errors.category} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Colors (comma separated)" value={formData.colors} onChange={handleChange('colors')} helperText="red, blue, white" fullWidth sx={{ mb: 2 }} />
            <TextField label="Sizes (comma separated)" value={formData.sizes} onChange={handleChange('sizes')} helperText="S, M, L" fullWidth sx={{ mb: 2 }} />
            <TextField label="Style" value={formData.style} onChange={handleChange('style')} fullWidth sx={{ mb: 2 }} />
            <TextField label="Description" multiline rows={3} value={formData.description} onChange={handleChange('description')} fullWidth sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <ActionButton 
                    type="submit"
                    color="success" 
                    fullWidth 
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save'}
                </ActionButton>
                
                <ActionButton 
                    type="button"
                    onClick={onCancel} 
                    variant="outlined" 
                    fullWidth 
                    disabled={saving}
                >
                    Cancel
                </ActionButton>
            </Box>
        </Box>
    );
}

export default ProductForm;