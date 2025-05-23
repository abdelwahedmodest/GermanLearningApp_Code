import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  I18nManager
} from 'react-native';

// Placeholder data for Q&A - replace with actual data
const qaData = [
  {
    key: 'qa1',
    questionText: 'أين القطة؟', // "Where is the cat?"
    options: [
      { key: 'cat', image: require('../assets/images/qa_cat.png') }, // Placeholder - Use image from 6.png
      { key: 'dog', image: require('../assets/images/qa_dog.png') }, // Placeholder - Use image from 6.png
      { key: 'bird', image: require('../assets/images/qa_bird.png') }, // Placeholder - Use image from 6.png
      { key: 'fish', image: require('../assets/images/qa_fish.png') }, // Placeholder - Use image from 6.png
    ],
    correctAnswerKey: 'cat', // Example correct answer
  },
  // Add more questions
];

const QAScreen = ({ navigation, route }) => {
  const category = route.params?.category; // Get category if passed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerKey, setSelectedAnswerKey] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const currentQuestion = qaData[currentQuestionIndex];

  const handleAnswerSelect = (optionKey) => {
    if (isCorrect !== null) return; // Prevent selecting multiple answers

    setSelectedAnswerKey(optionKey);
    const correct = optionKey === currentQuestion.correctAnswerKey;
    setIsCorrect(correct);

    // Provide feedback (visual/audio)
    console.log(correct ? 'Correct!' : 'Incorrect!');

    // Automatically move to the next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < qaData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswerKey(null);
        setIsCorrect(null);
      } else {
        // Q&A finished - navigate to results or back
        navigation.goBack(); // Or navigate to a Success/Results screen
      }
    }, 1500); // 1.5 second delay
  };

  const handleVoiceInput = () => {
      // Placeholder for voice input functionality
      console.log("Voice input activated");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Assuming Stack Navigator provides back button */} 
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text> 
          </TouchableOpacity>
          <Text style={styles.headerTitle}>أسئلة وأجوبة {category ? `(${category})` : ''}</Text> 
      </View>

      <View style={styles.qaContainer}>
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
        <Text style={styles.subQuestionText}>Choose the correct image</Text>
        
        <View style={styles.optionsGrid}>
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionCard,
                selectedAnswerKey === option.key && (isCorrect ? styles.correctOption : styles.incorrectOption)
              ]}
              onPress={() => handleAnswerSelect(option.key)}
              disabled={isCorrect !== null}
            >
              <Image source={option.image} style={styles.optionImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Microphone Button */} 
      <TouchableOpacity style={styles.micButton} onPress={handleVoiceInput}>
          <Text style={styles.micIcon}>🎤</Text> {/* Placeholder Icon */}
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e273a', // Dark background from image 6.png
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
      padding: 5,
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
    marginRight: I18nManager.isRTL ? 0 : -30, 
    marginLeft: I18nManager.isRTL ? -30 : 0,
  },
  qaContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center', // Center content vertically
  },
  questionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
   subQuestionText: {
    fontSize: 16,
    color: '#aaa',
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
    width: '45%', // Two cards per row
    aspectRatio: 1, // Make cards square
    backgroundColor: '#2c3a52',
    borderRadius: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent', // Default no border
  },
  correctOption: {
    borderColor: 'green', // Highlight correct answer
  },
  incorrectOption: {
    borderColor: 'red', // Highlight incorrect answer
  },
  optionImage: {
    width: '100%',
    height: '100%',
  },
  micButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: '#4fc3f7', // Blue button like in 6.png
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5, // Shadow for Android
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
  },
  micIcon: {
      fontSize: 30,
      color: '#fff',
  }
});

export default QAScreen;

