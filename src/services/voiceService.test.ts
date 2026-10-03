import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VoiceService } from './voiceService';

describe('VoiceService Continuous Voice Input & Language Configuration', () => {
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

  it('3. should set voice recognition language to ta-IN for Tamil mode', () => {
    const service = new VoiceService();
    service.setLanguage('ta-IN');
    expect(mockRecognition.lang).toBe('ta-IN');
  });

  it('4. should set voice recognition language to en-US for English mode', () => {
    const service = new VoiceService();
    service.setLanguage('en-US');
    expect(mockRecognition.lang).toBe('en-US');
  });

  it('5. should start listening session with ta-IN language when requested', () => {
    const service = new VoiceService();
    let currentState = 'idle';

    service.toggleListening({
      onStateChange: (state) => { currentState = state; },
      onResult: vi.fn(),
      onError: vi.fn()
    }, 'ta-IN');

    expect(mockRecognition.lang).toBe('ta-IN');
    expect(mockRecognition.start).toHaveBeenCalled();
    mockRecognition.onstart();
    expect(currentState).toBe('listening');
  });

  it('6. should start listening session with en-US language when requested', () => {
    const service = new VoiceService();
    let currentState = 'idle';

    service.toggleListening({
      onStateChange: (state) => { currentState = state; },
      onResult: vi.fn(),
      onError: vi.fn()
    }, 'en-US');

    expect(mockRecognition.lang).toBe('en-US');
    expect(mockRecognition.start).toHaveBeenCalled();
    mockRecognition.onstart();
    expect(currentState).toBe('listening');
  });

  it('7. should safely restart on onend if user did not stop intentionally', () => {
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

  it('8. should stop and set state to idle when user stops intentionally', () => {
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
