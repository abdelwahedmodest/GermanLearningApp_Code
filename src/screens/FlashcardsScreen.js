import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  I18nManager,
  Alert
} from 'react-native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enable playback in silence mode (iOS)
Sound.setCategory('Playback');

// Placeholder data for flashcards - replace with actual data and audio files
// Ensure audio files are placed correctly (e.g., in android/app/src/main/res/raw or linked appropriately)
const flashcardsData = {
  animals: [
    {
      key: 'cat',
      germanWord: 'Katze',
      arabicTranslation: 'قطة',
      image: require('../assets/images/4.png'), // Using 4.png directly for the cat example
      audio: 'katze.mp3', // Placeholder audio file name
    },
    {
      key: 'dog',
      germanWord: 'Hund',
      arabicTranslation: 'كلب',
      image: require('../assets/images/qa_dog.png'), // Using dog image from QA screen
      audio: 'hund.mp3',
    },
  ],
  colors: [
      // Add color flashcards
  ],
  // Add other categories
};

// Function to update progress (e.g., add stars)
const addStars = async (count) => {
    try {
        const profileData = await AsyncStorage.getItem('userProfile');
        if (profileData) {
            const profile = JSON.parse(profileData);
            profile.stars = (profile.stars || 0) + count;
            await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
            console.log(`Added ${count} stars. Total: ${profile.stars}`);
        }
    } catch (e) {
        console.error('Failed to update stars:', e);
    }
};

const FlashcardsScreen = ({ navigation, route }) => {
  const category = route.params?.category || 'animals'; // Default to animals if no category passed
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sound, setSound] = useState(null);

  const currentFlashcards = flashcardsData[category] || []; // Get flashcards for the category

  useEffect(() => {
    // Load sound for the current card
    if (currentFlashcards.length > 0 && currentFlashcards[currentIndex].audio) {
      const audioPath = currentFlashcards[currentIndex].audio;
      console.log('Loading sound:', audioPath);
      const newSound = new Sound(audioPath, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
          // Alert.alert('Error', 'Failed to load audio. Please ensure the file exists and react-native link ran successfully.');
          setSound(null);
          return;
        }
        // Sound loaded successfully
        console.log('Duration in seconds: ' + newSound.getDuration() + ' number of channels: ' + newSound.getNumberOfChannels());
        setSound(newSound);
      });
      // Cleanup function to release sound when component unmounts or index changes
      return () => {
        if (sound) {
          sound.release();
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, category]); // Reload sound when index or category changes

  if (currentFlashcards.length === 0) {
      return (
          <SafeAreaView style={styles.container}>
              <View style={styles.header}>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                      <Text style={styles.backButtonText}>←</Text> 
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>البطاقات التعليمية</Text>
              </View>
              <View style={styles.cardContainer}>
                  <Text style={styles.germanWord}>لا توجد بطاقات لهذه الفئة</Text>
              </View>
          </SafeAreaView>
      );
  }

  const currentCard = currentFlashcards[currentIndex];

  const handleNext = () => {
    if (currentIndex < currentFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      addStars(1); // Add 1 star for viewing a card
    } else {
      // Optionally navigate back or to a summary screen
      addStars(5); // Add bonus stars for finishing the set
      Alert.alert('أحسنت!', 'لقد أكملت هذه المجموعة!');
      navigation.goBack();
    }
  };

  const handleReplayAudio = () => {
    if (sound) {
      sound.play((success) => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
          // Reset sound to possibly fix issues
          sound.reset();
        }
      });
    } else {
        Alert.alert('خطأ', 'ملف الصوت غير متوفر أو لم يتم تحميله.');
        console.log('Audio not loaded or available for:', currentCard.audio);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text> 
          </TouchableOpacity>
          <Text style={styles.headerTitle}>البطاقات التعليمية ({category})</Text>
      </View>

      <View style={styles.cardContainer}>
        <Image source={currentCard.image} style={styles.cardImage} resizeMode="contain" />
        <Text style={styles.germanWord}>{currentCard.germanWord}</Text>
        <Text style={styles.arabicTranslation}>{currentCard.arabicTranslation}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={handleReplayAudio}>
          <Text style={styles.buttonSecondaryText}>إعادة الاستماع</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleNext}>
          <Text style={styles.buttonPrimaryText}>التالي</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e273a',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    minHeight: 50,
  },
  backButton: {
      padding: 5,
      position: 'absolute',
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  cardImage: {
    width: '80%',
    aspectRatio: 1,
    marginBottom: 20,
    borderRadius: 15,
  },
  germanWord: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  arabicTranslation: {
    fontSize: 24,
    color: '#aaa',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  buttonPrimary: {
    backgroundColor: '#4fc3f7',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#3a4763',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FlashcardsScreen;

