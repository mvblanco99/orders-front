export enum SoundEnum {
  BEEP = '/sound/scanner_beep.mp3',
}

const audioMap = new Map<string, HTMLAudioElement>();
let soundsLoaded = false;

const loadSound = (soundSrc: string) => {
  return new Promise<void>((resolve, reject) => {
    const audio = new Audio(soundSrc);
    audio.oncanplaythrough = () => resolve();
    audio.onerror = () =>
      reject(new Error(`Failed to load sound: ${soundSrc}`));
    audioMap.set(soundSrc, audio);
  });
};

const preloadSounds = async () => {
  if (soundsLoaded) return;
  const loadPromises = Object.values(SoundEnum).map(loadSound);
  await Promise.all(loadPromises);
  soundsLoaded = true;
};

const playSound = async (soundSrc: SoundEnum, volume = 0.4) => {
  const audio = audioMap.get(soundSrc);
  if (!audio) {
    throw new Error(`Sound not loaded: ${soundSrc}`);
  }
  audio.volume = volume;
  await audio.play();
};

const useSound = () => {
  return { preloadSounds, playSound };
};

export default useSound;
