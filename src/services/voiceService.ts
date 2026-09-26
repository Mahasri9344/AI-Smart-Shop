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
  private shouldBeListening: boolean = false;
  private currentLang: string = 'en-US';
  private callbacks: VoiceRecognitionCallbacks | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): void {
    const SpeechRecognition = (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) ||
      (globalThis as any).SpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLang;
    }
  }

  public isSupported(): boolean {
    return !!(
      (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) ||
      (globalThis as any).SpeechRecognition
    );
  }

  public setLanguage(langCode: string): void {
    this.currentLang = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  public toggleListening(callbacks: VoiceRecognitionCallbacks, langCode: string = 'en-US'): void {
    this.setLanguage(langCode);
    this.callbacks = callbacks;

    if (!this.isSupported()) {
      callbacks.onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (this.shouldBeListening) {
      this.stopListening();
      return;
    }

    this.startListeningSession();
  }

  private startListeningSession(): void {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) return;

    this.shouldBeListening = true;
    let accumulatedFinalTranscript = '';

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.callbacks) {
        this.callbacks.onStateChange('listening');
      }
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
      if (activeText && activeText.trim().length > 0 && this.callbacks) {
        this.callbacks.onResult(activeText.trim());
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        this.shouldBeListening = false;
        this.isListening = false;
        if (this.callbacks) {
          this.callbacks.onError('Microphone permission was denied. Please allow microphone access in your browser site settings.');
          this.callbacks.onStateChange('idle');
        }
      } else if (event.error === 'no-speech' || event.error === 'aborted') {
        // Non-fatal timeouts or aborts: onend will handle safe restart if shouldBeListening is true
      } else {
        if (this.callbacks) {
          this.callbacks.onError(`Voice recognition notice: ${event.error}`);
        }
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.shouldBeListening) {
        // Safely restart continuous recognition if user did not intentionally stop
        try {
          this.recognition.start();
        } catch (e) {
          this.shouldBeListening = false;
          if (this.callbacks) {
            this.callbacks.onStateChange('idle');
          }
        }
      } else {
        if (this.callbacks) {
          this.callbacks.onStateChange('idle');
        }
      }
    };

    try {
      this.recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition start error:', err);
      this.isListening = true;
    }
  }

  public stopListening(): void {
    this.shouldBeListening = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Silent catch for already stopped instance
      }
      this.isListening = false;
      if (this.callbacks) {
        this.callbacks.onStateChange('idle');
      }
    }
  }
}

export const voiceService = new VoiceService();
