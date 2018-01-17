import detect from 'bpm-detective';

const AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();
export default function detectSoundBpm(url) {
// Fetch some audio file
    return fetch(url, {
        method: 'GET',
    })
    // Get response as ArrayBuffer
        .then(response => response.arrayBuffer())
        .then(buffer => {
            // Decode audio into an AudioBuffer
            return new Promise((resolve, reject) => {
                context.decodeAudioData(buffer, resolve, reject);
            });
        })
        // Run detection
        .then(buffer => {
            try {
                return detect(buffer);
            } catch (err) {
                return -1
            }
        });
}