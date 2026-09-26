// Web Speech API type declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

export interface VoiceRecognitionCallbacks {
  onStateChange: (state: VoiceState) => void;
  onResult: (transcript: string) => void;
  onError: (errorMessage: string) => void;
}

export class VoiceService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLang: string = 'en-US';

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLang;
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public setLanguage(langCode: string): void {
    this.currentLang = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  public toggleListening(callbacks: VoiceRecognitionCallbacks, langCode: string = 'en-US'): void {
    this.setLanguage(langCode);

    if (!this.isSupported()) {
      callbacks.onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (this.isListening) {
      this.stopListening();
      callbacks.onStateChange('idle');
      return;
    }

    let accumulatedFinalTranscript = '';

    this.recognition.onstart = () => {
      this.isListening = true;
      callbacks.onStateChange('listening');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          accumulatedFinalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      const activeText = accumulatedFinalTranscript || interimTranscript;
      // Only send real non-empty speech text to the input field
      if (activeText && activeText.trim().length > 0) {
        callbacks.onResult(activeText.trim());
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      callbacks.onStateChange('idle');

      if (event.error === 'not-allowed') {
        callbacks.onError('Microphone permission was denied. Please allow microphone access in your browser site settings.');
      } else if (event.error === 'no-speech') {
        // Silent timeout when user says nothing: do not display error, do not insert text
      } else if (event.error !== 'aborted') {
        callbacks.onError(`Voice recognition notice: ${event.error}`);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      callbacks.onStateChange('idle');
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start error:', err);
      this.isListening = false;
      callbacks.onStateChange('idle');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Silent catch for already stopped instance
      }
      this.isListening = false;
    }
  }
}

export const voiceService = new VoiceService();
