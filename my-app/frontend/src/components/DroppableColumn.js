import { useDroppable } from '@dnd-kit/core';
import {
  Paper,
  Typography,
  Box,
  Chip,
  List,
  Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

export const DroppableColumn = ({ 
  children, 
  title, 
  role, 
  count, 
  isActive,
  isDraggingOver 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${role}-column`,
    data: {
      type: 'column',
      role,
    },
  });

  const iconColor = role === 'admin' ? 'error.main' : 'primary.main';
  const Icon = role === 'admin' ? AdminPanelSettingsIcon : PersonIcon;
  
  const getColumnStyle = () => {
    if (isDraggingOver) {
      return {
        bgcolor: role === 'admin' ? 'error.lighter' : 'primary.lighter',
        border: `2px dashed ${role === 'admin' ? '#f44336' : '#1976d2'}`,
      };
    }
    if (isOver && isActive) {
      return {
        bgcolor: role === 'admin' ? 'error.50' : 'primary.50',
        border: `2px dashed ${role === 'admin' ? '#f44336' : '#1976d2'}`,
      };
    }
    return {};
  };

  return (
    <Paper 
      ref={setNodeRef}
      sx={{ 
        p: 2, 
        height: '100%',
        transition: 'all 0.2s ease',
        ...getColumnStyle()
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ mr: 1, color: iconColor }} />
        <Typography variant="h6" sx={{ color: iconColor }}>
          {title}
        </Typography>
        <Chip label={count} size="small" sx={{ ml: 1 }} />
      </Box>
      <Divider sx={{ mb: 2 }} />
      <List dense sx={{ minHeight: 300 }}>
        {children}
      </List>
      {count === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          {role === 'admin' ? 'Нет администраторов' : 'Нет обычных пользователей'}
        </Typography>
      )}
    </Paper>
  );
};