import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, clearFilters } from '../../Store/Slices/productsSlice.js';

import { Chip, Select, MenuItem, Slider, Box, Typography, Input } from "@mui/material";

function AsidePanel({ filterOptions }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const currentFilters = useSelector(state => state.products.filters);

    const { categories, colors, sizes, dressStyles } = filterOptions || {};

    const [minPrice, setMinPrice] = useState(currentFilters.minPrice || 0);
    const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || 250);
    const [searchQuery, setSearchQuery] = useState(currentFilters.search || "");

    const handlePriceChange = (event, newValue) => {
        setMinPrice(newValue[0]);
        setMaxPrice(newValue[1]);
        dispatch(setFilter({ minPrice: newValue[0], maxPrice: newValue[1] }));
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        dispatch(setFilter({ search: value }));
    };

    return (
        <Box sx={{ width: 280, p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" fontWeight="bold">
                    {t('catalog.filters')}
                </Typography>
                <Chip 
                    label={t('catalog.clear')} 
                    onClick={() => dispatch(clearFilters())} 
                    color="error" 
                    size="small" 
                    variant="outlined"
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>{t('catalog.sort')}</Typography>
                <Select
                    fullWidth
                    size="small"
                    value={currentFilters.sort || "default"}
                    onChange={(e) => dispatch(setFilter({ sort: e.target.value }))}
                >
                    <MenuItem value="default">{t('catalog.default')}</MenuItem>
                    <MenuItem value="price-asc">{t('catalog.price_asc')}</MenuItem>
                    <MenuItem value="price-desc">{t('catalog.price_desc')}</MenuItem>
                    <MenuItem value="name-asc">{t('catalog.name_asc')}</MenuItem>
                    <MenuItem value="name-desc">{t('catalog.name_desc')}</MenuItem>
                </Select>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>{t('catalog.search')}</Typography>
                <Input
                    placeholder={t('catalog.search_placeholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    fullWidth
                    size="small"
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>{t('catalog.category')}</Typography>
                {categories?.map((category) => (
                    <Box key={category} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <input
                            type="checkbox"
                            checked={currentFilters.category === category}
                            onChange={(e) => dispatch(setFilter({ 
                                category: e.target.checked ? category : null 
                            }))}
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>{category}</Typography>
                    </Box>
                ))}
            </Box>

            <Box sx={{ mb: 4, px: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                    {t('catalog.price')}: ${minPrice} — ${maxPrice}
                </Typography>
                <Slider
                    value={[minPrice, maxPrice]}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    min={0}
                    max={250}
                    sx={{ color: 'secondary.main' }}
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>{t('catalog.colors')}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {colors?.map((color) => (
                        <Chip
                            key={color.name}
                            label={color.name}
                            clickable
                            color={currentFilters.color === color.name ? "primary" : "default"}
                            onClick={() => dispatch(setFilter({ 
                                color: currentFilters.color === color.name ? null : color.name 
                            }))}
                            sx={{
                                bgcolor: currentFilters.color === color.name ? color.hex : 'grey.300',
                                color: currentFilters.color === color.name ? 'white' : 'text.primary',
                                '&:hover': { bgcolor: color.hex + 'CC' }
                            }}
                        />
                    ))}
                </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>{t('catalog.size')}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {sizes?.map((size) => (
                        <Chip
                            key={size}
                            label={size}
                            clickable
                            color={currentFilters.size === size ? "primary" : "default"}
                            onClick={() => dispatch(setFilter({ 
                                size: currentFilters.size === size ? null : size 
                            }))}
                        />
                    ))}
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle2" gutterBottom>{t('catalog.style')}</Typography>
                <Select
                    fullWidth
                    size="small"
                    value={currentFilters.style || ""}
                    onChange={(e) => dispatch(setFilter({ style: e.target.value }))}
                >
                    <MenuItem value="">{t('catalog.all_styles')}</MenuItem>
                    {dressStyles?.map((style) => (
                        <MenuItem key={style} value={style}>{style}</MenuItem>
                    ))}
                </Select>
            </Box>
        </Box>
    );
}

export default AsidePanel;