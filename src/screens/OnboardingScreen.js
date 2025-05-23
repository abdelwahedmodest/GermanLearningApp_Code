import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  I18nManager,
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Assuming images are named appropriately in assets
const onboardingSlides = [
  { key: '1', image: require('../assets/images/1.png') }, // Using 1.png as placeholder for slides
  { key: '2', image: require('../assets/images/1.png') },
  { key: '3', image: require('../assets/images/1.png') },
];

const levels = [
  { key: 'beginner', label: 'مبتدئ' },
  { key: 'intermediate', label: 'متوسط' },
  { key: 'advanced', label: 'متقدم' },
];

// Sample avatars (replace with actual avatar selection logic/images)
// Ensure these images exist in src/assets/images/
const avatars = [
  { key: 'avatar1', source: require('../assets/images/avatar1.png') }, // Placeholder paths
  { key: 'avatar2', source: require('../assets/images/avatar2.png') },
  { key: 'avatar3', source: require('../assets/images/avatar3.png') },
  { key: 'avatar4', source: require('../assets/images/avatar4.png') },
  { key: 'avatar5', source: require('../assets/images/avatar5.png') },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [childName, setChildName] = useState('');
  const [selectedAvatarKey, setSelectedAvatarKey] = useState(null);
  const flatListRef = useRef();

  // Check if profile already exists on mount
  useEffect(() => {
    const checkProfile = async () => {
      const profileData = await AsyncStorage.getItem('userProfile');
      if (profileData) {
        // If profile exists, skip onboarding and go to main app
        navigation.replace('MainApp');
      }
    };
    checkProfile();
  }, [navigation]);

  const handleNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < onboardingSlides.length) {
      const offset = nextSlideIndex * width;
      flatListRef?.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const handleStartLearning = async () => {
    if (!childName.trim()) {
        Alert.alert('خطأ', 'الرجاء إدخال اسم الطفل');
        return;
    }
    if (!selectedLevel) {
        Alert.alert('خطأ', 'الرجاء اختيار المستوى');
        return;
    }
    if (!selectedAvatarKey) {
        Alert.alert('خطأ', 'الرجاء اختيار صورة رمزية');
        return;
    }

    const profile = {
      name: childName.trim(),
      level: selectedLevel,
      avatarKey: selectedAvatarKey,
      stars: 0, // Initial stats
      badges: 0,
      progress: {},
    };

    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      // Navigate to Main App (Tabs)
      navigation.replace('MainApp');
    } catch (e) {
      console.error('Failed to save profile:', e);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الملف الشخصي.');
    }
  };

  const renderSlide = ({ item }) => {
    return (
      <View style={styles.slideContainer}>
        <Image source={item.image} style={styles.slideImage} resizeMode="contain" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.slideshowContainer}>
        <FlatList
          ref={flatListRef}
          data={onboardingSlides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          style={{ width }}
          onMomentumScrollEnd={(event) => {
            const index = Math.floor(event.nativeEvent.contentOffset.x / width);
            setCurrentSlideIndex(index);
          }}
          scrollEnabled={false} 
        />
        <View style={styles.paginationContainer}>
          {onboardingSlides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentSlideIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.controlsContainer}>
        {currentSlideIndex === onboardingSlides.length - 1 ? (
          <>
            <Text style={styles.title}>اختر المستوى</Text>
            <View style={styles.levelContainer}>
              {levels.map((level) => (
                <TouchableOpacity
                  key={level.key}
                  style={[
                    styles.levelButton,
                    selectedLevel === level.key && styles.levelButtonSelected,
                  ]}
                  onPress={() => setSelectedLevel(level.key)}
                >
                  <Text style={styles.levelText}>{level.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.title}>إنشاء ملف الطفل</Text>
            <TextInput
              style={styles.input}
              placeholder="اسم الطفل"
              placeholderTextColor="#aaa"
              value={childName}
              onChangeText={setChildName}
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
            />
            {/* Avatar Selection */}
            <Text style={styles.title}>اختر صورة رمزية</Text>
            <View style={styles.avatarContainer}>
              {avatars.map((avatar) => (
                <TouchableOpacity 
                  key={avatar.key} 
                  onPress={() => setSelectedAvatarKey(avatar.key)}
                  style={[styles.avatarWrapper, selectedAvatarKey === avatar.key && styles.avatarSelected]} >
                  <Image source={avatar.source} style={styles.avatarImage} />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.startButton} onPress={handleStartLearning}>
              <Text style={styles.startButtonText}>ابدأ التعلم</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.startButton} onPress={handleNextSlide}>
            <Text style={styles.startButtonText}>التالي</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222b3c',
    alignItems: 'center',
  },
  slideshowContainer: {
    height: height * 0.45, // Adjusted height
    width: '100%',
  },
  slideContainer: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: {
    width: '90%',
    height: '90%',
  },
  paginationContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
  },
  controlsContainer: {
    flex: 1,
    width: '90%',
    alignItems: 'center',
    paddingTop: 15,
  },
  title: {
    fontSize: 16, // Adjusted size
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-start',
  },
  levelContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  levelButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6c7a9c',
  },
  levelButtonSelected: {
    backgroundColor: '#6c7a9c',
    borderColor: '#fff',
  },
  levelText: {
    color: '#fff',
    fontSize: 14,
  },
  input: {
    width: '100%',
    backgroundColor: '#3a4763',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  avatarContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
    flexWrap: 'wrap', // Allow wrapping if many avatars
  },
  avatarWrapper: {
      borderRadius: 30,
      padding: 3,
      borderWidth: 2,
      borderColor: 'transparent',
      margin: 5,
  },
  avatarSelected: {
      borderColor: '#4fc3f7', // Highlight selected avatar
  },
  avatarImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
  },
  startButton: {
    backgroundColor: '#4fc3f7',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto', // Push button to bottom
    marginBottom: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
