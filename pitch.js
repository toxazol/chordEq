const defaultPitch = 440;  // Default to A3 (440 Hz)
const defaultGain = 0.05;  // Default volume

// Create an audio context
let audioContext = null;
// Create oscillators for each note
let oscillators = {};

if (!audioContext) {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  createOscillators();
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
      oscillators[index].frequency.value = slider.value;
    });
  });
}