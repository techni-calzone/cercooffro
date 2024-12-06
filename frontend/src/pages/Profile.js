import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondary,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  useTheme
} from '@mui/material';
import {
  Edit,
  Favorite,
  History,
  Settings,
  CreditCard,
  School
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`profile-tabpanel-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const Profile = ({ language = 'it' }) => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch user profile, favorites, and history
        const profile = await fetch(`/api/v1/users/${user.id}/profile`).then(res => res.json());
        const favorites = await fetch(`/api/v1/users/${user.id}/favorites`).then(res => res.json());
        const history = await fetch(`/api/v1/users/${user.id}/search-history`).then(res => res.json());

        setUserProfile(profile);
        setFavoriteListings(favorites);
        setSearchHistory(history);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const response = await fetch(`/api/v1/users/${user.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updated = await response.json();
        setUserProfile(updated);
        setEditDialogOpen(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={userProfile?.avatar}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {userProfile?.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {userProfile?.email}
            </Typography>
            <Box mt={2}>
              <Chip
                label={userProfile?.subscription === 'premium' ? 'Premium' : 'Free'}
                color={userProfile?.subscription === 'premium' ? 'primary' : 'default'}
                sx={{ mr: 1 }}
              />
              <Chip
                label={userProfile?.university}
                icon={<School />}
                variant="outlined"
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{ mt: 2 }}
              onClick={() => setEditDialogOpen(true)}
            >
              {language === 'it' ? 'Modifica Profilo' : 'Edit Profile'}
            </Button>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                icon={<Favorite />}
                label={language === 'it' ? 'Preferiti' : 'Favorites'}
              />
              <Tab
                icon={<History />}
                label={language === 'it' ? 'Cronologia' : 'History'}
              />
              <Tab
                icon={<Settings />}
                label={language === 'it' ? 'Impostazioni' : 'Settings'}
              />
              <Tab
                icon={<CreditCard />}
                label={language === 'it' ? 'Abbonamento' : 'Subscription'}
              />
            </Tabs>

            {/* Favorites Tab */}
            <TabPanel value={activeTab} index={0}>
              <List>
                {favoriteListings.map((listing) => (
                  <ListItem
                    key={listing.id}
                    button
                    onClick={() => navigate(`/listings/${listing.id}`)}
                  >
                    <ListItemText
                      primary={listing.title}
                      secondary={`${listing.location} - €${listing.price}/month`}
                    />
                    <Chip
                      label={listing.status}
                      color={listing.status === 'available' ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
                {favoriteListings.length === 0 && (
                  <Typography color="textSecondary" align="center">
                    {language === 'it' ? 'Nessun preferito' : 'No favorites yet'}
                  </Typography>
                )}
              </List>
            </TabPanel>

            {/* History Tab */}
            <TabPanel value={activeTab} index={1}>
              <List>
                {searchHistory.map((search) => (
                  <ListItem key={search.id}>
                    <ListItemText
                      primary={search.query}
                      secondary={new Date(search.timestamp).toLocaleString(
                        language === 'it' ? 'it-IT' : 'en-US'
                      )}
                    />
                    <Button
                      size="small"
                      onClick={() => navigate('/search', { state: { filters: search.filters } })}
                    >
                      {language === 'it' ? 'Ripeti' : 'Repeat'}
                    </Button>
                  </ListItem>
                ))}
                {searchHistory.length === 0 && (
                  <Typography color="textSecondary" align="center">
                    {language === 'it' ? 'Nessuna ricerca' : 'No search history'}
                  </Typography>
                )}
              </List>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={activeTab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {language === 'it' ? 'Preferenze di Notifica' : 'Notification Preferences'}
                  </Typography>
                  {/* Add notification settings */}
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    {language === 'it' ? 'Privacy' : 'Privacy Settings'}
                  </Typography>
                  {/* Add privacy settings */}
                </Grid>
              </Grid>
            </TabPanel>

            {/* Subscription Tab */}
            <TabPanel value={activeTab} index={3}>
              <Box textAlign="center">
                <Typography variant="h6" gutterBottom>
                  {language === 'it' ? 'Il tuo piano' : 'Your Plan'}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {userProfile?.subscription === 'premium' ? 'Premium' : 'Free'}
                </Typography>
                {userProfile?.subscription !== 'premium' && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/subscription')}
                  >
                    {language === 'it' ? 'Passa a Premium' : 'Upgrade to Premium'}
                  </Button>
                )}
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>
          {language === 'it' ? 'Modifica Profilo' : 'Edit Profile'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={language === 'it' ? 'Nome' : 'Name'}
              defaultValue={userProfile?.name}
              margin="normal"
            />
            <TextField
              fullWidth
              label={language === 'it' ? 'Università' : 'University'}
              defaultValue={userProfile?.university}
              margin="normal"
            />
            <TextField
              fullWidth
              label={language === 'it' ? 'Bio' : 'Bio'}
              defaultValue={userProfile?.bio}
              multiline
              rows={4}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            {language === 'it' ? 'Annulla' : 'Cancel'}
          </Button>
          <Button
            variant="contained"
            onClick={() => handleProfileUpdate({
              name: document.querySelector('input[label="Name"]').value,
              university: document.querySelector('input[label="University"]').value,
              bio: document.querySelector('textarea').value,
            })}
          >
            {language === 'it' ? 'Salva' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
