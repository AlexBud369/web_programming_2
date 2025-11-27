import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography } from '@mui/material';
import ActionButton from '../ActionButton/ActionButton';

function UniversalModal({ 
  open, 
  onClose, 
  title, 
  image, 
  content
}) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          {title && (
            <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              {title}
            </DialogTitle>
          )}
          
          <DialogContent>
            {image && (
              <Box
                component="img"
                src={image}
                alt={title}
                sx={{ 
                  width: '100%', 
                  maxHeight: 300, 
                  objectFit: 'contain', 
                  borderRadius: 2, 
                  my: 2,
                  boxShadow: 1
                }}
              />
            )}
            {content && (
              <Box sx={{ textAlign: 'center' }}>
                {typeof content === 'string' ? <Typography>{content}</Typography> : content}
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ justifyContent: 'center', pb: 2, gap: 2 }}>
            <ActionButton type="button" onClick={onClose} variant="outlined">
              Close
            </ActionButton>
          </DialogActions>
      </Dialog>
    );
}

export default UniversalModal;