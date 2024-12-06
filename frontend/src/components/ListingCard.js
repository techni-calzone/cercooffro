import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Tooltip,
  useTheme
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Euro,
  Verified,
  Warning,
  Share
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { it, enUS } from 'date-fns/locale';

const ListingCard = ({ listing, onFavorite, language = 'it' }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const {
    title,
    description,
    price,
    location,
    images,
    amenities,
    verified,
    createdAt,
    size,
    rooms,
    isFavorited
  } = listing;

  const handleFavoriteClick = () => {
    if (!user) {
      // Show login prompt
      return;
    }
    onFavorite(listing.id);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } catch (err) {
        setShowShareDialog(true);
      }
    } else {
      setShowShareDialog(true);
    }
  };

  const getVerificationBadge = () => {
    if (verified) {
      return (
        <Tooltip title="Verified Listing">
          <Chip
            icon={<Verified />}
            label={language === 'it' ? 'Verificato' : 'Verified'}
            color="success"
            size="small"
            sx={{ mr: 1 }}
          />
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={images[0] || '/placeholder.jpg'}
          alt={title}
          onClick={() => setOpen(true)}
          sx={{ cursor: 'pointer' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6" component="div" noWrap>
              {title}
            </Typography>
            <Box>
              <IconButton onClick={handleFavoriteClick} size="small">
                {isFavorited ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
              <IconButton onClick={handleShare} size="small">
                <Share />
              </IconButton>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <LocationOn color="action" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {location}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <Euro color="action" sx={{ mr: 0.5 }} />
            <Typography variant="h6" color="primary">
              {price.toLocaleString(language === 'it' ? 'it-IT' : 'en-US', {
                style: 'currency',
                currency: 'EUR'
              })}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
              /month
            </Typography>
          </Box>

          <Box display="flex" gap={1} mb={1}>
            {getVerificationBadge()}
            <Chip
              label={`${rooms} ${language === 'it' ? 'stanze' : 'rooms'}`}
              size="small"
            />
            <Chip
              label={`${size}m²`}
              size="small"
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1
            }}
          >
            {description}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {formatDistanceToNow(new Date(createdAt), {
              addSuffix: true,
              locale: language === 'it' ? it : enUS
            })}
          </Typography>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {title}
            {getVerificationBadge()}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ position: 'relative' }}>
                <img
                  src={images[0] || '/placeholder.jpg'}
                  alt={title}
                  style={{ width: '100%', borderRadius: '4px' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                {language === 'it' ? 'Dettagli' : 'Details'}
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {language === 'it' ? 'Prezzo' : 'Price'}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    {price.toLocaleString(language === 'it' ? 'it-IT' : 'en-US', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                    <Typography component="span" variant="body2" color="text.secondary">
                      /month
                    </Typography>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {language === 'it' ? 'Posizione' : 'Location'}
                  </Typography>
                  <Typography>{location}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {language === 'it' ? 'Caratteristiche' : 'Features'}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {amenities.map((amenity, index) => (
                      <Chip key={index} label={amenity} size="small" />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
      >
        <DialogTitle>
          {language === 'it' ? 'Condividi annuncio' : 'Share Listing'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowShareDialog(false);
              }}
            >
              {language === 'it' ? 'Copia Link' : 'Copy Link'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListingCard;
