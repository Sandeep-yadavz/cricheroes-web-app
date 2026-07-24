// Web Speech API for Live Cricket Audio Commentary
class CommentaryVoice {
  constructor() {
    this.synth = window.speechSynthesis || null;
  }

  speak(text) {
    if (!this.synth) return;
    try {
      this.synth.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      this.synth.speak(utterance);
    } catch (e) {}
  }
}

export const commentaryVoice = new CommentaryVoice();
