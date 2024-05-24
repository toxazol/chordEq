// Define the note frequencies
const noteFrequencies = {
    'A': 220,
    'C': 261.63,
    'D': 293.66,
    'E': 329.63,
    'G': 392
  };
  
  // Create an audio context
  let audioContext = null;
  
  let isPlaying = false; // Flag to track if notes are playing

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
  
  // Get the sliders
  const sliders = document.querySelectorAll('.slider');
  
  // Connect sliders to oscillators
  function connectSliders() {
    sliders.forEach(slider => {
      slider.addEventListener('input', () => {
        const note = slider.dataset.note;
        const gain = audioContext.createGain();
        gain.gain.value = slider.value;
        oscillators[note].disconnect();
        oscillators[note].connect(gain);
        gain.connect(audioContext.destination);
      });
    });
  }
  
  // Play all notes
  function playNotes() {
    sliders.forEach(slider => {
      const note = slider.dataset.note;
      oscillators[note].disconnect(); // Disconnect the oscillator first
      const gain = audioContext.createGain();
      gain.gain.value = slider.value;
      oscillators[note].connect(gain);
      gain.connect(audioContext.destination);
    });
  }

  function stopNotes() {
    for (const note in oscillators) {
      oscillators[note].disconnect();
    }
  }
  
  // the play button"
  const playButton = document.getElementById('playButton');
  playButton.addEventListener('click', switchAudioContext);