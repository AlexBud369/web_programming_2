import React, { useState } from "react";
import { 
  Chip, 
  Select, 
  MenuItem, 
  Slider, 
  Box, 
  Typography, 
  Input 
} from "@mui/material";

function AsidePanel({ 
  filterOptions, 
  onCategoryChange, 
  onSortChange, 
  onColorChange, 
  onSizeChange, 
  onStyleChange, 
  onPriceChange, 
  onSearchChange, 
  onClearFilters 
}) {
  const { categories, colors, sizes, dressStyles } = filterOptions || {};
  const [minPrice, setMinPrice] = useState(20);
  const [maxPrice, setMaxPrice] = useState(250);
  const [searchQuery, setSearchQuery] = useState("");

  const handlePriceChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
    onPriceChange(newValue[0], newValue[1]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearchChange(e.target.value);
  };

    return (
        <Box sx={{ width: 250, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Filter & Sort</Typography>
                <Chip label="Clear" onClick={onClearFilters} color="error" size="small" />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Sort By</Typography>
                <Select
                fullWidth
                size="small"
                defaultValue="default"
                onChange={(e) => onSortChange(e.target.value)}
                >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
                <MenuItem value="name-asc">Name: A to Z</MenuItem>
                <MenuItem value="name-desc">Name: Z to A</MenuItem>
                </Select>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Search</Typography>
                <Input
                placeholder="Name, description..."
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                size="small"
                />
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Category</Typography>
                {categories?.map((category, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <input
                    type="checkbox"
                    id={`cat-${index}`}
                    onChange={(e) => onCategoryChange(category, e.target.checked)}
                    />
                    <label htmlFor={`cat-${index}`} style={{ marginLeft: 8 }}>
                    {category}
                    </label>
                </Box>
                ))}
            </Box>

            <Box sx={{ mb: 3, px: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                Price: ${minPrice} — ${maxPrice}
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
                <Typography variant="subtitle2" gutterBottom>Colors</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {colors?.map((color, index) => (
                    <Chip
                    key={index}
                    label={color.name}
                    onClick={() => onColorChange(color.name, true)}
                    color="primary"
                    variant="outlined"
                    size="small"
                    sx={{
                        bgcolor: color.hex,
                        color: 'white',
                        '& .MuiChip-label': { color: 'white' }
                    }}
                    />
                ))}
                </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>Size</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {sizes?.map((size, index) => (
                    <Chip
                    key={index}
                    label={size}
                    onClick={() => onSizeChange(size)}
                    clickable
                    color="default"
                    size="small"
                    />
                ))}
                </Box>
            </Box>

            <Box>
                <Typography variant="subtitle2" gutterBottom>Dress Style</Typography>
                <Select
                fullWidth
                size="small"
                defaultValue=""
                onChange={(e) => onStyleChange(e.target.value)}
                >
                <MenuItem value="">All Styles</MenuItem>
                {dressStyles?.map((style, index) => (
                    <MenuItem key={index} value={style}>{style}</MenuItem>
                ))}
                </Select>
            </Box>
        </Box>
    );
}

export default AsidePanel;