import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VoiceService } from './voiceService';

describe('VoiceService Continuous Voice Input', () => {
  let mockRecognition: any;

  beforeEach(() => {
    mockRecognition = {
      continuous: false,
      interimResults: false,
      lang: 'en-US',
      start: vi.fn(),
      stop: vi.fn(),
      onstart: null,
      onresult: null,
      onerror: null,
      onend: null
    };

    (globalThis as any).SpeechRecognition = vi.fn().mockImplementation(function () {
      return mockRecognition;
    });
  });

  it('1. should report supported when SpeechRecognition exists on globalThis', () => {
    const service = new VoiceService();
    expect(service.isSupported()).toBe(true);
  });

  it('2. should set continuous mode to true for uninterrupted listening', () => {
    const service = new VoiceService();
    expect(service.isSupported()).toBe(true);
    expect(mockRecognition.continuous).toBe(true);
  });

  it('3. should update language code via setLanguage', () => {
    const service = new VoiceService();
    service.setLanguage('ta-IN');
    expect(mockRecognition.lang).toBe('ta-IN');
  });

  it('4. should start listening session and set state to listening onstart', () => {
    const service = new VoiceService();
    let currentState = 'idle';

    service.toggleListening({
      onStateChange: (state) => { currentState = state; },
      onResult: vi.fn(),
      onError: vi.fn()
    }, 'ta-IN');

    expect(mockRecognition.start).toHaveBeenCalled();
    mockRecognition.onstart();
    expect(currentState).toBe('listening');
  });

  it('5. should safely restart on onend if user did not stop intentionally', () => {
    const service = new VoiceService();
    service.toggleListening({
      onStateChange: vi.fn(),
      onResult: vi.fn(),
      onError: vi.fn()
    });

    mockRecognition.onstart();
    mockRecognition.start.mockClear();

    // Simulate STT auto-end timeout while user is still in active listening session
    mockRecognition.onend();
    expect(mockRecognition.start).toHaveBeenCalledTimes(1);
  });

  it('6. should stop and set state to idle when user stops intentionally', () => {
    const service = new VoiceService();
    let currentState = 'idle';

    service.toggleListening({
      onStateChange: (state) => { currentState = state; },
      onResult: vi.fn(),
      onError: vi.fn()
    });

    mockRecognition.onstart();
    service.stopListening();

    expect(mockRecognition.stop).toHaveBeenCalled();
    expect(currentState).toBe('idle');
  });
});
