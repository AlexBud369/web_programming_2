import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, addPath }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
      <Typography variant="h4">{title}</Typography>
      <Button component={Link} to={addPath} variant="contained">
        Добавить
      </Button>
    </Box>
  );
};

export default PageHeader;