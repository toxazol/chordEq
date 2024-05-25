const defaultPitch = 440;  // Default to A4 (440 Hz)
const defaultGain = 0.05;  // Default volume


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

const notes = Object.entries(noteFrequencies).map(([note, freq]) => ({
  note,
  freq,
}));

const defaultPitchIndex = notes.findIndex((n)=>n.note == 'A4');


// Create an audio context
let audioContext = null;
// Create oscillators for each note
let oscillators = {};

addHtmlSliders(8);

if (!audioContext) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  createOscillators();
}

function addHtmlSliders(count) {

  let rowHtml = `
  <div class="row-container">
    <button class="oscillator-button"></button>
    <input type="range" min="0" max="${notes.length}" step="1" value="${defaultPitchIndex}" class="slider">
  </div>
  `
  while(count--) {
    document.querySelector(".equalizer").innerHTML += rowHtml;
  }
  
}

function createOscillators() {
  const rowContainers = document.querySelectorAll('.row-container');
  rowContainers.forEach((container, index) => {
    const oscillatorButton = container.querySelector('.oscillator-button');
    const slider = container.querySelector('.slider');

    oscillators[index] = audioContext.createOscillator();
    oscillators[index].type = 'sine';
    oscillators[index].frequency.value = defaultPitch;

    oscillatorButton.addEventListener('click', () => {
      if (oscillatorButton.classList.contains('playing')) {
        oscillators[index].disconnect();
        oscillatorButton.classList.remove('playing');
      } else {
        const gain = audioContext.createGain();
        gain.gain.value = defaultGain; // Set the initial gain value
        oscillators[index].connect(gain);
        gain.connect(audioContext.destination);

        if(!oscillators[index].isStarted) {
          oscillators[index].start();
          oscillators[index].isStarted = true;
        }
        
        oscillatorButton.classList.add('playing');
      }
    });

    slider.addEventListener('input', () => {
      oscillators[index].frequency.value = notes[slider.value].freq;
    });
  });
}