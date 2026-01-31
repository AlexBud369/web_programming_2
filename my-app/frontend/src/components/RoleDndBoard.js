import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { bulkUpdateRoles } from '../store/slices/userSlice';
import { toast } from 'react-toastify';
import { DraggableUser } from './DraggableUser';
import { DroppableColumn } from './DroppableColumn';

const RoleDndBoard = ({ users, loading }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [activeUsers, setActiveUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeDragData, setActiveDragData] = useState(null);
  const [draggingOverColumn, setDraggingOverColumn] = useState(null);

  useEffect(() => {
    if (users) {
      setActiveUsers(users.filter(u => u.isActive));
    }
  }, [users]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveDragData(active.data.current);
  };

  const handleDragOver = (event) => {
    const { over } = event;
    if (over?.data.current?.type === 'column') {
      setDraggingOverColumn(over.data.current.role);
    } else {
      setDraggingOverColumn(null);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragData(null);
    setDraggingOverColumn(null);

    if (!over) return;

    const draggedUser = active.data.current?.user;
    const targetColumn = over.data.current?.role;

    if (targetColumn && draggedUser) {
      if (draggedUser.id === currentUser?.id) {
        toast.warning('Вы не можете изменить свою собственную роль');
        return;
      }

      if (draggedUser.role !== targetColumn) {
        const updatedUsers = activeUsers.map(user => 
          user.id === draggedUser.id 
            ? { ...user, role: targetColumn }
            : user
        );
        setActiveUsers(updatedUsers);
        toast.info(`Роль пользователя "${draggedUser.firstName}" изменена на ${targetColumn === 'admin' ? 'Администратора' : 'Пользователя'}`);
      }
    }
  };

  const handleRoleChange = (userId, newRole) => {
    if (userId === currentUser?.id) {
      toast.warning('Вы не можете изменить свою собственную роль');
      return;
    }
    
    setActiveUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      const updates = activeUsers
        .filter(user => user.id !== currentUser?.id)
        .filter(user => {
          const originalUser = users?.find(u => u.id === user.id);
          return !originalUser || originalUser.role !== user.role;
        })
        .map((user) => ({
          id: user.id,
          role: user.role
        }));
      
      if (updates.length === 0) {
        toast.info('Нет изменений для сохранения');
        setIsSaving(false);
        return;
      }
      
      await dispatch(bulkUpdateRoles(updates)).unwrap();
      toast.success(`Роли ${updates.length} пользователей обновлены`);
      
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast.error(error.message || 'Ошибка при сохранении изменений');
    } finally {
      setIsSaving(false);
    }
  };

  const admins = activeUsers.filter(user => user.role === 'admin');
  const regularUsers = activeUsers.filter(user => user.role === 'user');

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <DroppableColumn
              title="Администраторы"
              role="admin"
              count={admins.length}
              isActive={true}
              isDraggingOver={draggingOverColumn === 'admin'}
            >
              {admins.map(user => (
                <DraggableUser
                  key={user.id}
                  user={user}
                  isCurrentUser={user.id === currentUser?.id}
                  onRoleChange={handleRoleChange}
                  isOverAdminColumn={draggingOverColumn === 'admin'}
                  isOverUserColumn={draggingOverColumn === 'user'}
                />
              ))}
            </DroppableColumn>
          </Grid>

          <Grid item xs={12} md={6}>
            <DroppableColumn
              title="Пользователи"
              role="user"
              count={regularUsers.length}
              isActive={true}
              isDraggingOver={draggingOverColumn === 'user'}
            >
              {regularUsers.map(user => (
                <DraggableUser
                  key={user.id}
                  user={user}
                  isCurrentUser={user.id === currentUser?.id}
                  onRoleChange={handleRoleChange}
                  isOverAdminColumn={draggingOverColumn === 'admin'}
                  isOverUserColumn={draggingOverColumn === 'user'}
                />
              ))}
            </DroppableColumn>
          </Grid>
        </Grid>

        <DragOverlay>
          {activeDragData?.type === 'user' ? (
            <Paper
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                boxShadow: 3,
                borderRadius: 2,
                minWidth: 300,
                opacity: 0.8,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {activeDragData.user.firstName} {activeDragData.user.lastName}
                </Typography>
                <Typography 
                  variant="caption" 
                  color={activeDragData.user.role === 'admin' ? 'error' : 'primary'}
                  sx={{ 
                    bgcolor: activeDragData.user.role === 'admin' ? 'error.lighter' : 'primary.lighter',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1
                  }}
                >
                  {activeDragData.user.role === 'admin' ? 'Админ' : 'Пользователь'}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {activeDragData.user.email}
              </Typography>
            </Paper>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setActiveUsers(users?.filter(u => u.isActive) || [])}
          disabled={isSaving}
        >
          Сбросить
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveOrder}
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={20} /> : null}
        >
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        <strong>Инструкция:</strong>
        <br />• Перетащите пользователя в другую колонку, чтобы изменить его роль
        <br />• Или нажмите на роль, чтобы быстро изменить её
        <br />• <strong>Текущий пользователь (Вы)</strong> выделен и не может менять свою роль
        <br />• Нажмите "Сохранить изменения", чтобы применить все изменения
      </Typography>
    </Box>
  );
};

export default RoleDndBoard;