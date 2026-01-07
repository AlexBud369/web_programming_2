import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const EntityCard = ({ 
  entity, 
  titleField = 'name', 
  imageField = 'flagImage', 
  fields, 
  basePath,
  entityType = 'default' 
}) => {
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'admin';

  if (!entity) return <Typography>Не найдено</Typography>;

  const canEditEntity = () => {
    if (entityType === 'sales') {
      return isAdmin || entity.createdBy === user?.id;
    }
    return isAdmin;
  };

  const renderFieldValue = (field, value) => {
    if (field.render && typeof field.render === 'function') {
      return field.render(value);
    }
    return value !== undefined && value !== null ? value : '—';
  };

  const canEdit = canEditEntity();

  return (
    <Card>
      {entity[imageField] && (
        <CardMedia
          component="img"
          height="300"
          image={entity[imageField]}
          alt={entity[titleField]}
          sx={{ objectFit: 'contain' }}
        />
      )}
      <CardContent>
        <Typography variant="h3" gutterBottom>
          {entity[titleField]}
        </Typography>

        {fields.map((field) => (
          <Typography key={field.key} variant="body1" paragraph>
            <strong>{field.label}:</strong>{' '}
            {renderFieldValue(field, entity[field.key])}
          </Typography>
        ))}

        <Box sx={{ mt: 4 }}>
          <Button component={Link} to={basePath} variant="outlined" sx={{ mr: 2 }}>
            Назад к списку
          </Button>
          
          {canEdit && (
            <Button 
              component={Link} 
              to={`${basePath}/edit/${entity.id}`} 
              variant="contained"
            >
              Редактировать
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default EntityCard;