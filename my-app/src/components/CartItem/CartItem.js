import { Box, Typography, IconButton, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

function CartItem({ item, onUpdateQuantity, onRemove }) {
    return (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, gap: 2 }}>
            <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 2,
                    boxShadow: 1
                }}
            />
            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium" noWrap>
                    {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {item.brand}
                </Typography>
                <Typography variant="h6" color="primary">
                    ${item.price}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                    size="small"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                >
                    <RemoveIcon />
                </IconButton>
                <Typography sx={{ minWidth: 32, textAlign: 'center', fontWeight: 'bold' }}>
                    {item.quantity}
                </Typography>
                <IconButton size="small" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Typography variant="subtitle1" sx={{ minWidth: 80, textAlign: 'right', fontWeight: 'bold' }}>
            ${(item.price * item.quantity).toFixed(2)}
            </Typography>

            <IconButton color="error" onClick={() => onRemove(item.id)}>
            <DeleteIcon />
            </IconButton>
        </Box>
        <Divider />
        </>
    );
}

export default CartItem;