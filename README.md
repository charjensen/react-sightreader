# ABC Sightreader

ABC Sightreader is a web-based music sight-reading tool that allows users to load, play, and practice ABC notation files. The project provides real-time feedback on pitch accuracy, volume levels, and expected notes, helping musicians improve their sight-reading and intonation skills.

## 🚀 Features

### 🎼 **ABC Notation Playback**

- Loads ABC files and converts them into playable sheet music.
- Uses **ABCJS** to render the sheet music and play audio.
- Highlights the current note being played in red.

### 🎤 **Pitch Detection and Volume Monitoring**

- Real-time pitch detection using the microphone.
- Converts detected frequency into note names (e.g., "A4").
- Displays current and expected notes side-by-side.
- Monitors volume and provides visual feedback.

### 🔄 **Auto Continue and Ignore Duration**

- **Auto Continue**: Automatically moves to the next piece in the playlist when playback ends.
- **Ignore Duration**: Ignores the duration of notes, useful for practicing.

### 🎯 **Playback Controls**

- Start, stop, and reset playback.
- Adjustable tempo.
- Countdown before playback starts.

### 🎛️ **User Interface**

- Clean and responsive layout using Flexbox.
- Organized into separate sections for controls, notation, and pitch/volume display.
- Uses real-time highlighting to track progress.

## 📂 Folder Structure

```
├── public/                 # Static files
│   ├── js/                 # JavaScript libraries and utilities
│   └── music/              # Sample ABC notation files
├── src/                    # Source code
│   ├── components/         # React components
│   ├── utils/              # Utility functions (e.g., pitch detection, volume meter)
│   ├── App.jsx             # Main application logic
│   ├── main.jsx            # React entry point
├── .gitignore              # Files to ignore in Git
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## 🛠️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/abc-sightreader.git
```

2. **Navigate into the project directory:**

```bash
cd abc-sightreader
```

3. **Install dependencies:**

```bash
npm install
```

4. **Start the development server:**

```bash
npm start
```

## 🎯 Usage

1. Open the app in your browser:

```
http://localhost:3000
```

2. Select a music file from the dropdown or load an ABC notation file.
3. Click **Start** to begin playback.
4. Use the **Tune** button to enable microphone-based pitch detection.
5. Adjust settings like tempo, auto continue, and ignore duration.
6. View pitch accuracy and volume feedback in real-time.

## 🏆 Contributors

- **Charles Jensen - Developer**
