import { Button as MuiButton } from '@mui/material';

function ActionButton({ 
    children, 
    onClick, 
    variant = "contained", 
    color = "primary", 
    size = "medium",
    fullWidth = false,
    ...props 
    }) {
    return (
        <MuiButton
            variant={variant}
            color={color}
            size={size}
            onClick={onClick}
            fullWidth={fullWidth}
            sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': { boxShadow: 2 }
            }}
            {...props}
        >
        {children}
        </MuiButton>
    );
}

export default ActionButton;