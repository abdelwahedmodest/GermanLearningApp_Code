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
  Dimensions,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// Placeholder data for categories - replace with actual data and images
// Ensure these images exist in src/assets/images/
const categories = [
  {
    key: 'animals',
    title: 'الحيوانات',
    image: require('../assets/images/category_animals.png'),
  },
  {
    key: 'colors',
    title: 'الألوان',
    image: require('../assets/images/category_colors.png'),
  },
  {
    key: 'numbers',
    title: 'الأرقام',
    image: require('../assets/images/category_numbers.png'),
  },
  {
    key: 'food',
    title: 'الطعام',
    image: require('../assets/images/category_food.png'),
  },
  {
    key: 'family',
    title: 'العائلة',
    image: require('../assets/images/category_family.png'),
  },
];

const CategoriesScreen = ({ navigation, route }) => {
  const activityType = route.params?.activityType; // 'flashcards' or 'quiz'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await AsyncStorage.getItem('userProfile');
        if (profileData) {
          setProfile(JSON.parse(profileData));
        } else {
          navigation.replace('Onboarding');
        }
      } catch (e) {
        console.error('Failed to load profile in Categories:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [navigation]);

  const handleCategoryPress = (category) => {
    let targetScreen = 'Flashcards'; // Default
    if (activityType === 'quiz') {
      targetScreen = 'Quiz';
    } // Add more activity types if needed
    
    navigation.navigate(targetScreen, { category: category.key });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          {/* Show back button only if navigated from somewhere other than tab */} 
          {navigation.canGoBack() && !route.params?.activityType && (
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>اختر موضوعات</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.gridContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
            >
              <Image source={category.image} style={styles.categoryImage} resizeMode="cover" />
              <Text style={styles.categoryTitle}>{category.title}</Text>
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
   header: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#44526f',
    minHeight: 50, // Ensure header has height
  },
  backButton: {
      padding: 5,
      position: 'absolute', // Position absolutely to not affect title centering
      left: I18nManager.isRTL ? undefined : 15,
      right: I18nManager.isRTL ? 15 : undefined,
      zIndex: 1,
  },
  backButtonText: {
      color: '#fff',
      fontSize: 24,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  scrollContainer: {
    padding: 15,
  },
  gridContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 45) / 2,
    backgroundColor: '#2c3a52',
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    overflow: 'hidden',
    paddingBottom: 10,
  },
  categoryImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default CategoriesScreen;

