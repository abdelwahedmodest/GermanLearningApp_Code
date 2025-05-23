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
import AsyncStorage from '@react-native-async-storage/async-storage';
// Import Sound library if needed for feedback, but be mindful of linking issues
// import Sound from 'react-native-sound';

// Placeholder data for quiz questions - replace with actual data
// Ensure images exist in src/assets/images/
const quizQuestions = {
    food: [
        {
            key: 'q1',
            questionText: 'Was ist das?', // "What is this?"
            options: [
              { key: 'apple', image: require('../assets/images/quiz_apple.png') }, 
              { key: 'banana', image: require('../assets/images/quiz_banana.png') }, 
              { key: 'pear', image: require('../assets/images/quiz_pear.png') }, 
              { key: 'orange', image: require('../assets/images/quiz_orange.png') }, 
            ],
            correctAnswerKey: 'apple', // Example correct answer
          },
          // Add more food questions
    ],
    animals: [
        // Add animal questions
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

const QuizScreen = ({ navigation, route }) => {
  const category = route.params?.category || 'food'; // Default category
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctStreak, setCorrectStreak] = useState(0);

  const currentQuestions = quizQuestions[category] || [];

  useEffect(() => {
      // Reset state if category changes (though not typical for this screen)
      setCurrentQuestionIndex(0);
      setSelectedAnswerKey(null);
      setIsCorrect(null);
      setCorrectStreak(0);
  }, [category]);

  if (currentQuestions.length === 0) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>✕</Text> 
                </TouchableOpacity>
                <Text style={styles.headerTitle}>اختبر نفسك</Text>
            </View>
            <View style={styles.quizContainer}>
                <Text style={styles.questionText}>لا توجد أسئلة لهذه الفئة</Text>
            </View>
        </SafeAreaView>
    );
}

  const currentQuestion = currentQuestions[currentQuestionIndex];

  const handleAnswerSelect = (optionKey) => {
    if (isCorrect !== null) return; // Prevent selecting multiple answers

    setSelectedAnswerKey(optionKey);
    const correct = optionKey === currentQuestion.correctAnswerKey;
    setIsCorrect(correct);

    if (correct) {
        console.log('Correct!');
        addStars(2); // Add 2 stars for correct answer
        const newStreak = correctStreak + 1;
        setCorrectStreak(newStreak);
        if (newStreak >= 3) {
            console.log('3 correct in a row! Bonus stars!');
            addStars(5); // Bonus stars
            // Trigger reward animation/sound here (placeholder)
            Alert.alert('ممتاز!', '+5 نجوم إضافية!');
            setCorrectStreak(0); // Reset streak after bonus
        }
        // Play correct sound feedback (placeholder)
    } else {
        console.log('Incorrect!');
        setCorrectStreak(0); // Reset streak
        // Play incorrect sound feedback (placeholder)
    }

    // Automatically move to the next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswerKey(null);
        setIsCorrect(null);
      } else {
        // Quiz finished
        Alert.alert('أحسنت!', 'لقد أكملت هذا الاختبار!');
        navigation.goBack(); // Or navigate to a Success/Results screen
      }
    }, 1500); // 1.5 second delay
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>✕</Text> 
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lektion {currentQuestionIndex + 1} ({category})</Text> 
      </View>

      <View style={styles.quizContainer}>
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        
        <View style={styles.optionsGrid}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionCard,
                selectedAnswerKey === option.key && (isCorrect === true ? styles.correctOption : styles.incorrectOption),
                selectedAnswerKey === option.key && isCorrect === false && styles.incorrectOption // Explicitly style incorrect
              ]}
              onPress={() => handleAnswerSelect(option.key)}
              disabled={isCorrect !== null}
            >
              <Image source={option.image} style={styles.optionImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Navigation is handled by Tab Navigator */}
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
  quizContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
  },
  optionCard: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#2c3a52',
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  correctOption: {
    borderColor: 'green',
  },
  incorrectOption: {
    borderColor: 'red',
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
});

export default QuizScreen;
