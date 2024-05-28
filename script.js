// Define the note frequencies
const noteFrequencies = {
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42,
  'D#2': 77.78, 'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'G2': 98.00,
  'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47, 'C3': 130.81,
  'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08,
  'B3': 246.94, 'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30,
  'A4': 440.00, 'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37,
  'D5': 587.33, 'D#5': 622.25, 'E5': 659.26, 'F5': 698.46, 'F#5': 739.99,
  'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};

const slidersCount = 8;

let audioContext = null;
let isPlaying = false; 

const waveTypes = {'sine':0, 'square':1, 'sawtooth':2, 'triangle':3};

const playButton = document.getElementById('playButton');
playButton.addEventListener('click', switchAudioContext);


function addHtmlSliders(count) {

  let rowHtml = `
  <div class="row-container">
      <select class="note-select"></select>
      <input type="range" min="0" max="0.1" step="0.001" value="0" class="slider">
      <select class="wave-select"></select>
  </div>
  `
  while(count--) {
    document.querySelector(".equalizer").innerHTML += rowHtml;
  }
}

addHtmlSliders(slidersCount);

function switchAudioContext() {
  if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      createOscillators();
      connectSliders();
  }

  if (isPlaying) {
      stopNotes(); // Stop the notes if they are currently playing
      playButton.classList.remove('playing'); // Remove the 'playing' class
  } else {
      playNotes(); // Play the notes if they are not currently playing
      playButton.classList.add('playing'); // Add the 'playing' class
  }

  isPlaying = !isPlaying; // Toggle the isPlaying flag
}

// Create oscillators for each note
let oscillators = {};
function createOscillators() {
  for (const note in noteFrequencies) {
      oscillators[note] = audioContext.createOscillator();
      oscillators[note].type = 'sine';
      oscillators[note].frequency.value = noteFrequencies[note];
      oscillators[note].start();
  }
}

// Get the sliders and note selects
const rowContainers = document.querySelectorAll('.row-container');

function cycleOptions(selectOption, e) {
  e.preventDefault();
  let select = e.target;
  select.selectedIndex = (select.selectedIndex + 1) % select.options.length;
  selectOption(select.value);
}

function populateSelect(select, values) {
  for (const val in values) {
    const option = document.createElement('option');
    option.value = val;
    option.text = val;
    select.add(option);
  }
}

function switchWave(oscillator, slider, val) {
  oscillator.type = val;
}

// Connect sliders and note selects to oscillators
function connectSliders() {
  rowContainers.forEach((container, index) => {
      const noteSelect = container.querySelector('.note-select');
      const slider = container.querySelector('.slider');
      const waveSelect = container.querySelector('.wave-select');


      populateSelect(waveSelect, waveTypes);
      populateSelect(noteSelect, noteFrequencies);

      // Set the default notes
      const defaultNotes = ['A3', 'C4', 'D4', 'E4', 'G4', 'A2', 'C3', 'D3'];
      noteSelect.value = defaultNotes[index];

      // Store the currently selected note
      let currentNote = noteSelect.value;

      waveSelect.addEventListener('mousedown', cycleOptions.bind(this, switchWave.bind(this, oscillators[currentNote], slider)));

      // Connect the slider to the oscillator
      noteSelect.addEventListener('change', () => {
          const selectedNote = noteSelect.value;

          // Disconnect the previous note
          oscillators[currentNote].disconnect();

          const gain = audioContext.createGain();
          gain.gain.value = slider.value;
          oscillators[selectedNote].connect(gain);
          oscillators[selectedNote].gainNode = gain;
          gain.connect(audioContext.destination);

          // Update the current note
          currentNote = selectedNote;
      });

      slider.addEventListener('input', () => {
          const selectedNote = noteSelect.value;

          const gain = oscillators[selectedNote].gainNode;
          gain.gain.value = slider.value;
      });
  });
}

function playNotes() {
  rowContainers.forEach(container => {
      const noteSelect = container.querySelector('.note-select');
      const slider = container.querySelector('.slider');
      const selectedNote = noteSelect.value;

      // Disconnect the previous note
      oscillators[selectedNote].disconnect();

      const gain = audioContext.createGain();
      gain.gain.value = slider.value;
      oscillators[selectedNote].connect(gain);
      oscillators[selectedNote].gainNode = gain;
      gain.connect(audioContext.destination);
  });
}

function stopNotes() {
  for (const note in oscillators) {
      oscillators[note].disconnect();
  }
}
