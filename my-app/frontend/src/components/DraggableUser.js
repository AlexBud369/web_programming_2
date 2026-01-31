import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {
  Avatar,
  Chip,
  Box,
  Tooltip,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export const DraggableUser = ({ 
  user, 
  isCurrentUser, 
  onRoleChange,
  isOverAdminColumn,
  isOverUserColumn 
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: user.id,
    data: {
      type: 'user',
      user,
      currentRole: user.role
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const getBorderStyle = () => {
    if (isOverAdminColumn && user.role !== 'admin') {
      return { borderLeft: '4px solid #f44336' }; 
    }
    if (isOverUserColumn && user.role !== 'user') {
      return { borderLeft: '4px solid #1976d2' }; 
    }
    return {};
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <ListItem 
        sx={{ 
          bgcolor: 'background.paper',
          mb: 1,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'action.hover' },
          opacity: isCurrentUser ? 0.7 : 1,
          ...getBorderStyle()
        }}
      >
        <ListItemAvatar>
          <Avatar src={user.avatar}>
            {user.firstName?.[0]}{user.lastName?.[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{`${user.firstName} ${user.lastName}`}</span>
              {isCurrentUser && (
                <Chip 
                  label="Вы" 
                  size="small" 
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>
          }
          secondary={user.email}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isCurrentUser ? (
            <Tooltip title="Нельзя изменить свою роль">
              <span>
                <Chip
                  label={user.role === 'admin' ? 'Админ' : 'Пользователь'}
                  color={user.role === 'admin' ? 'error' : 'primary'}
                  size="small"
                  sx={{ cursor: 'not-allowed' }}
                />
              </span>
            </Tooltip>
          ) : (
            <Chip
              label={user.role === 'admin' ? 'Админ' : 'Пользователь'}
              color={user.role === 'admin' ? 'error' : 'primary'}
              size="small"
              onClick={() => onRoleChange(
                user.id, 
                user.role === 'admin' ? 'user' : 'admin'
              )}
              sx={{ cursor: 'pointer' }}
            />
          )}
          {!isCurrentUser && (
            <DragIndicatorIcon sx={{ color: 'text.disabled', cursor: 'grab' }} />
          )}
        </Box>
      </ListItem>
    </div>
  );
};