# German Learning App for Children (React Native)

This is an educational mobile application built with React Native, designed to help Arabic-speaking children (ages 3-10) learn German in a fun and interactive way.

## Features

*   **Onboarding:** Introduction slides, level selection (Beginner, Intermediate, Advanced), and profile creation (name, avatar).
*   **Dashboard:** Personalized greeting, stats (level, stars, badges), and quick access to learning modules.
*   **Learning Modules:**
    *   **Categories:** Thematic organization (Animals, Colors, Numbers, Food, Family).
    *   **Flashcards:** Image, German word, Arabic translation, audio pronunciation (requires audio files).
    *   **Quizzes:** Multiple-choice questions with image options and immediate feedback.
    *   **Q&A:** Select the correct image based on an Arabic question (voice input planned).
    *   **(Planned) Stories:** Interactive illustrated stories.
*   **Rewards:** Star-based system for completing activities and maintaining streaks.
*   **Persistence:** User profiles and progress are saved locally using AsyncStorage.
*   **UI/UX:** Child-friendly design, dark theme, large elements, and full Arabic RTL support.

## Setup and Running on Windows

Follow these steps to set up and run the project on a Windows machine for Android development.

### Prerequisites

1.  **Node.js and npm:** Install Node.js (LTS version recommended) from the [official website](https://nodejs.org/). npm is included with Node.js.
2.  **Java Development Kit (JDK):** React Native requires a JDK. Install a recent version (e.g., AdoptOpenJDK/Temurin 11 or later) from [Adoptium](https://adoptium.net/).
3.  **Android Studio:** Download and install Android Studio from the [official Android Developers site](https://developer.android.com/studio).
    *   During setup, make sure to install:
        *   Android SDK
        *   Android SDK Platform (select a recent API level, e.g., 33 or 34)
        *   Android Virtual Device (AVD) if you want to use an emulator.
4.  **Git:** Install Git for Windows from [git-scm.com](https://git-scm.com/download/win).

### Environment Variables

Configure the following environment variables (search for "Edit the system environment variables" in Windows):

1.  **JAVA_HOME:** Set this to the installation directory of your JDK (e.g., `C:\Program Files\Eclipse Adoptium\jdk-11.0.x.x-hotspot`).
2.  **ANDROID_HOME:** Set this to the location of your Android SDK. You can find this path in Android Studio under `Settings` > `Appearance & Behavior` > `System Settings` > `Android SDK`.
3.  **Path:** Add the following locations to your system `Path` variable:
    *   `%JAVA_HOME%\bin`
    *   `%ANDROID_HOME%\platform-tools`
    *   `%ANDROID_HOME%\emulator` (if using emulators)
    *   `%ANDROID_HOME%\tools`
    *   `%ANDROID_HOME%\tools\bin`

    *Restart your Command Prompt or PowerShell after setting environment variables.* 

### Setup Instructions

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/abdelwahedmodest/GermanLearningApp_Code.git
    cd GermanLearningApp_Code
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *(This step downloads all the necessary libraries defined in `package.json`)*

3.  **Prepare Android Device/Emulator:**
    *   **Emulator:** Launch an Android Virtual Device (AVD) from Android Studio (`Tools` > `AVD Manager`).
    *   **Physical Device:** Enable USB Debugging on your Android device (usually found under Developer Options) and connect it to your computer via USB. Ensure your computer recognizes the device (`adb devices` command in the terminal should list your device).

4.  **Run the Application:**
    ```bash
    npx react-native run-android
    ```
    *(This command builds the Android app, installs it on the connected device/emulator, and starts the Metro bundler.)*

### Important Notes

*   **Placeholder Content:** This project uses placeholder images and data (e.g., for avatars, categories, flashcards, quizzes). You will need to replace these with actual content.
*   **Audio Files:** The Flashcards feature expects audio files (e.g., `.mp3`) for pronunciation. These files need to be added to the appropriate location (e.g., `android/app/src/main/res/raw`) and potentially linked. The `react-native-sound` library might require manual linking steps if automatic linking fails.
*   **Vector Icons:** The project uses `react-native-vector-icons`. Ensure fonts are correctly linked for Android (the `build.gradle` modification attempts this, but manual steps might be needed if icons don't appear).
*   **First Build:** The first build process (`run-android`) might take a while as it downloads dependencies and compiles the native code.

## Contributing

(Add contribution guidelines if applicable)

## License

(Add license information if applicable)
