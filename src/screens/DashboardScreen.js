import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  I18nManager,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Quick Access items (ensure images exist)
const quickAccessItems = [
  {
    key: 'flashcards',
    title: 'البطاقات التعليمية',
    description: 'Learn new words with fun flashcards',
    image: require('../assets/images/quick_access_flashcards.png'), // Placeholder - Use actual image from 2.png or generate/find one
    targetScreen: 'Categories', // Navigate to Categories first
  },
  {
    key: 'stories',
    title: 'القصص',
    description: 'Enjoy interactive stories in German',
    image: require('../assets/images/quick_access_stories.png'), // Placeholder - Use actual image from 2.png
    targetScreen: 'Stories',
  },
  {
    key: 'quiz',
    title: 'اختبر نفسك',
    description: 'Challenge yourself with quizzes',
    image: require('../assets/images/quick_access_quiz.png'), // Placeholder - Use actual image from 2.png
    targetScreen: 'Categories', // Navigate to Categories first for Quiz
  },
  {
    key: 'progress',
    title: 'التقدم',
    description: 'Track your learning journey',
    image: require('../assets/images/quick_access_progress.png'), // Placeholder - Use actual image from 2.png
    targetScreen: 'Rewards', // Assuming Progress links to Rewards/Progress screen
  },
];

const DashboardScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('userProfile');
        if (profileData) {
          setProfile(JSON.parse(profileData));
        } else {
          // Handle case where profile is missing (e.g., navigate back to onboarding)
          console.log('Profile not found, navigating to Onboarding');
          navigation.replace('Onboarding');
        }
      } catch (e) {
        console.error('Failed to load profile:', e);
        // Optionally show an error message to the user
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigation]);

  const handleQuickAccessPress = (item) => {
      if (item.key === 'flashcards' || item.key === 'quiz') {
          // Pass the intended activity type to Categories screen
          navigation.navigate(item.targetScreen, { activityType: item.key });
      } else {
          navigation.navigate(item.targetScreen);
      }
  };

  if (loading || !profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  // Find the avatar source based on the stored key
  // const avatarSource = avatars.find(a => a.key === profile.avatarKey)?.source || require('../assets/images/avatar_default.png'); // Add a default avatar

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Greeting */}
        <View style={styles.headerRow}>
            {/* <Image source={avatarSource} style={styles.avatarImage} /> */} 
            <View>
                <Text style={styles.greetingText}>مرحبًا يا {profile.name}!</Text>
                <Text style={styles.subGreetingText}>Learn German</Text>
            </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.level || 1}</Text> {/* Default level 1 if not set */}
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.stars}</Text>
            <Text style={styles.statLabel}>Stars</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.badges}</Text>
            <Text style={styles.statLabel}>Badges</Text>
          </View>
        </View>

        {/* Quick Access Section */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickAccessGrid}>
          {quickAccessItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.quickAccessCard}
              onPress={() => handleQuickAccessPress(item)}
            >
              <Image source={item.image} style={styles.quickAccessImage} resizeMode="cover" />
              <Text style={styles.quickAccessTitle}>{item.title}</Text>
              {/* <Text style={styles.quickAccessDescription}>{item.description}</Text> */}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Bottom Navigation is handled by Tab Navigator */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e273a',
  },
  container: {
    flex: 1,
    backgroundColor: '#1e273a',
  },
  scrollContainer: {
    padding: 20,
  },
  headerRow: {
      flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      alignItems: 'center',
      marginBottom: 10,
  },
//   avatarImage: {
//       width: 50,
//       height: 50,
//       borderRadius: 25,
//       marginRight: I18nManager.isRTL ? 0 : 15,
//       marginLeft: I18nManager.isRTL ? 15 : 0,
//   },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  subGreetingText: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 20,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  statsContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2c3a52',
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  quickAccessGrid: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: '48%',
    backgroundColor: '#2c3a52',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    alignItems: 'center', // Center content
    paddingBottom: 10,
  },
  quickAccessImage: {
    width: '100%',
    height: 120,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10, // Adjusted margin
    textAlign: 'center',
  },
//   quickAccessDescription: {
//     fontSize: 12,
//     color: '#aaa',
//     marginBottom: 10,
//     marginHorizontal: 10,
//     textAlign: I18nManager.isRTL ? 'right' : 'left',
//   },
});

export default DashboardScreen;

