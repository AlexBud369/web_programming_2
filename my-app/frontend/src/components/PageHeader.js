import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PageHeader = ({ title, addPath, entityType = 'default' }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  const showAddButton = () => {
    if (entityType === 'sales') {
      return isAuthenticated;
    }
    return isAdmin;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4">{title}</Typography>
      {showAddButton() && (
        <Button component={Link} to={addPath} variant="contained">
          Добавить
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;