import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

interface PrayerPhrase {
  id: number;
  name: string;
  arabic: string;
  transliteration: string;
  phonetics_spanish: string;
  translation_spanish: string;
  video_timestamp: number;
  duration: number;
  position_image_names: string[];
  translation_per_segment: string;
  highlight_timing: string;
}

const INITIAL_FAJR_PRAYER_PHRASES: PrayerPhrase[] = [
  {
    "id": 1,
    "name": "Takbir (Inicio de la oración)",
    "arabic": "الله أكبر",
    "transliteration": "Allāhu Akbar",
    "phonetics_spanish": "Al-lá-hu Ák-bar",
    "translation_spanish": "Dios es el más grande",
    "translation_per_segment": "Dios es el más grande",
    "video_timestamp": 4.5,
    "duration": 2.5,
    "highlight_timing": "0.0-2.5",
    "position_image_names": ["parado_mano_oreja.png"]
  },
  {
    "id": 2,
    "name": "Subḥānaka (Antes de Al-Fātiha)",
    "arabic": "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ،|وَتَبَارَكَ اسْمُكَ،|وَتَعَالَى جَدُّكَ،|وَلَا إِلَهَ غَيْرُكَ،|أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    "transliteration": "Subḥānaka Allāhumma wa biḥamdika|wa tabāraka smuka|wa taʿālā jadduka|wa lā ilāha ghayruk|aʿūdhu billāhi min ash-shayṭān ir-rajīm",
    "phonetics_spanish": "Sub-já-na-ka Al-lá-hu-mma wa bi jám-diká|wa ta-bá-raká is-muká|wa ta-ʿá-lá jad-du-ká|wa lá i-lá-ha ghei-ruk|a-ʿú-dhu bil-lá-hi min ash-shay-tán ir-ra-jím",
    "translation_spanish": "Glorificado seas, oh Allah, y alabado seas. Bendito es tu nombre, exaltada es tu majestad, no hay otro dios que Tú. Me refugio en Allah del demonio maldito",
    "translation_per_segment": "Glorificado seas, oh Allah, y alabado seas|Bendito es tu nombre|Exaltada es tu majestad|No hay otro dios que Tú|Me refugio en Allah del demonio maldito",
    "video_timestamp": 7,
    "duration": 12,
    "highlight_timing": "0.0-2.5|2.5-5|5-7.5|7.5-9.5|9.5-12",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 3,
    "name": "Sura Al-Fatiha (Verso 1)",
    "arabic": "بِسْمِ اللهِ|الرَّحْمٰنِ|الرَّحِيْمِ",
    "transliteration": "Bismillāhi|r-raḥmāni|r-raḥīm",
    "phonetics_spanish": "Bis-mil-lá-ji|Raj-má-ni|Ra-jím",
    "translation_spanish": "En el nombre de Dios, el Compasivo, el Misericordioso",
    "translation_per_segment": "En el nombre de Dios|El Compasivo|El Misericordioso",
    "video_timestamp": 19,
    "duration": 3.6,
    "highlight_timing": "0.0-1.2|1.2-2.4|2.4-3.6",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 4,
    "name": "Sura Al-Fatiha (Verso 2)",
    "arabic": "الْحَمْدُ|لِلَّهِ|رَبِّ|الْعَالَمِينَ",
    "transliteration": "Al-ḥamdu|lillāhi|rabbi|l-ʿālamīn",
    "phonetics_spanish": "al-jám-du|lil-lá-ji|rá-bi|al-‘a-la-mín",
    "translation_spanish": "Alabado sea Dios, Señor del universo",
    "translation_per_segment": "la alabanza|a Allah|Señor|de los mundos",
    "video_timestamp": 22.5,
    "duration": 3.72,
    "highlight_timing": "0.0-0.8|0.8-1.6|1.6-2.5|2.5-3.72",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 5,
    "name": "Sura Al-Fatiha (Versos 3-4)",
    "arabic": "الرَّحْمَٰنِ الرَّحِيمِ|مَالِكِ يَوْمِ الدِّينِ",
    "transliteration": "Ar-raḥmāni r-raḥīm|Māliki yawmi d-dīn",
    "phonetics_spanish": "Ar-raj-má-nir ra-jím|Má-li-ki yáu-mid-dín",
    "translation_spanish": "El Compasivo, el Misericordioso, Soberano del Día del Juicio",
    "translation_per_segment": "El Compasivo, el Misericordioso|Soberano del Día del Juicio",
    "video_timestamp": 26.1,
    "duration": 4.23,
    "highlight_timing": "0.0-2.1|2.1-4.23",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 6,
    "name": "Sura Al-Fatiha (Versos 5-6)",
    "arabic": "إِيَّاكَ نَعْبُدُ|وَإِيَّاكَ نَسْتَعِينُ|اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    "transliteration": "Iyyāka naʿbudu|wa iyyāka nastaʿīn|Ihdinā ṣ-ṣirāṭa l-mustaqīm",
    "phonetics_spanish": "Iy-yá-ka náb-bu-du|wa iy-yá-ka nas-ta-ín|Íj-di-nas si-rá-tal mus-ta-quím",
    "translation_spanish": "A Ti solo servimos y a Ti solo imploramos ayuda. Guíanos por el camino recto",
    "translation_per_segment": "A Ti solo servimos|y a Ti solo imploramos ayuda|Guíanos por el camino recto",
    "video_timestamp": 30.7,
    "duration": 6.4,
    "highlight_timing": "0.0-1|1-3.3|3.3-6.4",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 7,
    "name": "Sura Al-Fatiha (Verso 7)",
    "arabic": "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ|غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ|وَلَا الضَّالِّينَ",
    "transliteration": "Ṣirāṭa llaḏīna anʿamta ʿalayhim|ġayri l-maġḍūbi ʿalayhim|walā ḍ-ḍāllīn",
    "phonetics_spanish": "Si-rá-tal la-dí-na an-ám-ta a-lái-jim|gáir-ril mag-dú-bi a-lái-jim|wa-lad-dáal-lín",
    "translation_spanish": "El camino de los que has favorecido, no el de los que son motivo de ira, ni el de los extraviados",
    "translation_per_segment": "El camino de los que has favorecido|no el de los que son motivo de ira|ni el de los extraviados",
    "video_timestamp": 36.95,
    "duration": 11,
    "highlight_timing": "0.0-3.3|3.3-5.5|6.5-11",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 8,
    "name": "Āmīn (Después de Al-Fātiḥa)",
    "arabic": "آمِين",
    "transliteration": "Āmīn",
    "phonetics_spanish": "Aamín",
    "translation_spanish": "Amén / Oh Allah, acepta",
    "translation_per_segment": "Amén / Oh Allah, acepta",
    "video_timestamp": 48,
    "duration": 1.95,
    "highlight_timing": "0.0-1.95",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 9,
    "name": "Sura Al-Quraysh (Verso 1)",
    "arabic": "لِإِيلَافِ|قُرَيْشٍ",
    "transliteration": "Li-īlāfi|Quraysh",
    "phonetics_spanish": "Li í-la-fi|Ku-réish",
    "translation_spanish": "Por la protección concedida a Quraysh",
    "translation_per_segment": "Por la protección|concedida a Quraysh",
    "video_timestamp": 50,
    "duration": 3.21,
    "highlight_timing": "50-51.5|51.5-53.2",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 10,
    "name": "Sura Al-Quraysh (Verso 2)",
    "arabic": "إِيلَافِهِمْ|رِحْلَةَ|الشِّتَاءِ|وَالصَّيْفِ",
    "transliteration": "Īlāfihim|riḥlata|sh-shitā’i|waṣ-ṣayf",
    "phonetics_spanish": "Í-la-fi-jim|rij-la-tash|shi-tá-i|wa-sáif",
    "translation_spanish": "Su seguridad durante las caravanas de invierno y verano",
    "translation_per_segment": "Su seguridad|durante las caravanas|de invierno|y verano",
    "video_timestamp": 53.2,
    "duration": 4.8,
    "highlight_timing": "53.2-54.5|54.5-56|56-57.5|57.5-58.2",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 11,
    "name": "Sura Al-Quraysh (Verso 3)",
    "arabic": "فَلْيَعْبُدُوا|رَبَّ|هَٰذَا|الْبَيْتِ",
    "transliteration": "Fal-yaʿbudū|rabba|hāḏā|l-bayt",
    "phonetics_spanish": "Fal-yab-bu-dú|rab-ba|há-za|al-báit",
    "translation_spanish": "Que adoren, pues, al Señor de esta Casa (la Kaaba)",
    "translation_per_segment": "Que adoren|pues|al Señor|de esta Casa (la Kaaba)",
    "video_timestamp": 58,
    "duration": 3.4,
    "highlight_timing": "58-58.8|58.8-59.5|59.5-60.3|60.3-61.4",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 12,
    "name": "Sura Al-Quraysh (Verso 4)",
    "arabic": "الَّذِي|أَطْعَمَهُم|مِّن|جُوعٍ|وَآمَنَهُم|مِّنْ|خَوْفٍ",
    "transliteration": "Alladhī|aṭʿamahum|min|jūʿin|wa āmana-hum|min|khawf",
    "phonetics_spanish": "Al-la-dhí|at-a-ma-hum|min|yú-in|wa á-ma-na-hum|min|jáuf",
    "translation_spanish": "Que les dio de comer cuando tenían hambre y les protegió del temor",
    "translation_per_segment": "Que les dio|de comer|cuando|tenían hambre|y les protegió|min|del temor",
    "video_timestamp": 61.6,
    "duration": 7.7,
    "highlight_timing": "61.6-62.6|62.6-63.6|63.6-64.3|64.3-65.5|65.5-67|67-67.6|67.6-69.3",
    "position_image_names": ["parado_manos_cruzadas.png"]
  },
  {
    "id": 13,
    "name": "Takbir (al pasar a la inclinación)",
    "arabic": "الله|أكبر",
    "transliteration": "Allāhu|Akbar",
    "phonetics_spanish": "Al-lá-hu|Ák-bar",
    "translation_spanish": "Dios es el más grande (al pasar de pie a la posición de inclinación)",
    "translation_per_segment": "Dios es|el más grande (al pasar de pie a la posición de inclinación)",
    "video_timestamp": 69,
    "duration": 2,
    "highlight_timing": "69-70|70-71",
    "position_image_names": ["parado_mano_oreja.png", "inclinacion_ruku.png"]
  },
  {
    "id": 14,
    "name": "Ruku' (Inclinación)",
    "arabic": "سبحان|ربي|العظيم",
    "transliteration": "Subḥāna|rabbī|al-ʿaẓīm",
    "phonetics_spanish": "Sub-já-na|ráb-bi-yal|a-dím",
    "translation_spanish": "Glorificado sea mi Señor, el Grandioso",
    "translation_per_segment": "Glorificado sea|mi Señor|el Grandioso",
    "video_timestamp": 71.5,
    "duration": 6,
    "highlight_timing": "0-1.5|1.5-3.5|3.5-6",
    "position_image_names": ["inclinacion_ruku.png"]
  },
  {
    "id": 15,
    "name": "Al levantarse del Ruku'",
    "arabic": "سمع|الله|لمن|حمده،|ربنا|ولك|الحمد",
    "transliteration": "Samiʿa|llāhu|liman|ḥamidah,|Rabbanā|wa|laka l-ḥamd",
    "phonetics_spanish": "Sá-mi-al-lá-hu|lí-man|já-mi-daj|Ráb-ba-na|wa|lá-kal|jámd",
    "translation_spanish": "Dios escucha a quien le alaba. ¡Señor nuestro, a Ti la alabanza!",
    "translation_per_segment": "Dios escucha|a quien|le alaba.|¡Señor nuestro|a Ti|la alabanza!",
    "video_timestamp": 77.4,
    "duration": 6,
    "highlight_timing": "0-0.8|0.8-1.5|1.5-2.5|2.5-3.7|3.7-4.7|4.7-5.3|5.3-6",
    "position_image_names": ["parado_brazos_lados.png"]
  },
  {
    "id": 16,
    "name": "Takbir (al pasar a la postración)",
    "arabic": "الله|أكبر",
    "transliteration": "Allāhu|Akbar",
    "phonetics_spanish": "Al-lá-hu|Ák-bar",
    "translation_spanish": "Dios es el más grande (al bajar desde de pie a la primera postración)",
    "translation_per_segment": "Dios es|el más grande (al bajar desde de pie a la primera postración)",
    "video_timestamp": 83.5,
    "duration": 2,
    "highlight_timing": "0-1|1-2",
    "position_image_names": ["postracion_sujud.png"]
  },
  {
    "id": 17,
    "name": "Sujud (Primera postración)",
    "arabic": "سبحان|ربي|الأعلى",
    "transliteration": "Subḥāna|rabbī|al-aʿlā",
    "phonetics_spanish": "Sub-já-na|ráb-bi-yal|á-la",
    "translation_spanish": "Glorificado sea mi Señor, el Altísimo",
    "translation_per_segment": "Glorificado sea|mi Señor|el Altísimo",
    "video_timestamp": 86,
    "duration": 7,
    "highlight_timing": "0-2|2-4.5|4.5-7",
    "position_image_names": ["postracion_sujud.png"]
  },
  {
    "id": 18,
    "name": "Entre postraciones (al incorporarse y volver a postrarse)",
    "arabic": "الله|أكبر",
    "transliteration": "Allāhu|Akbar",
    "phonetics_spanish": "Al-lá-hu|Ák-bar",
    "translation_spanish": "Dios es el más grande (se pronuncia dos veces: al incorporarse y al volver a postrarse)",
    "translation_per_segment": "Dios es|el más grande (al incorporarse y al volver a postrarse)",
    "video_timestamp": 93,
    "duration": 4,
    "highlight_timing": "0-2|2-4",
    "position_image_names": ["sentado_tashahhud.png", "postracion_sujud.png"]
  },
  {
    "id": 19,
    "name": "Sujud (Segunda postración)",
    "arabic": "سبحان|ربي|الأعلى",
    "transliteration": "Subḥāna|rabbī|al-aʿlā",
    "phonetics_spanish": "Sub-já-na|ráb-bi-yal|á-la",
    "translation_spanish": "Glorificado sea mi Señor, el Altísimo",
    "translation_per_segment": "Glorificado sea|mi Señor|el Altísimo",
    "video_timestamp": 99.9,
    "duration": 7,
    "highlight_timing": "0-2|2-4.5|4.5-7",
    "position_image_names": ["postracion_sujud.png"]
  },
  {
    "id": 20,
    "name": "Levantarse al segundo rakaʿah",
    "arabic": "الله|أكبر",
    "transliteration": "Allāhu|Akbar",
    "phonetics_spanish": "Al-lá-hu|Ák-bar",
    "translation_spanish": "Dios es el más grande",
    "translation_per_segment": "Dios es|el más grande",
    "video_timestamp": 107,
    "duration": 2,
    "highlight_timing": "0-1|1-2",
    "position_image_names": ["parado_brazos_lados.png"]
  }
];

const imageUrls: Record<string, string> = {
  "parado_mano_oreja.png": "https://i.imgur.com/bO8mUaN.png",
  "parado_manos_cruzadas.png": "https://i.imgur.com/b8D66LB.png",
  "inclinacion_ruku.png": "https://i.imgur.com/oxMBmRl.png",
  "parado_brazos_lados.png": "https://i.imgur.com/sBVEfiN.png",
  "postracion_sujud.png": "https://i.imgur.com/XDVE0mG.png",
  "sentado_entre_suyud.png": "https://i.imgur.com/D2j4M3D.png",
  "sentado_tashahhud.png": "https://i.imgur.com/ugLqbue.png",
};


const App: React.FC = () => {
  const [prayerPhrases, setPrayerPhrases] = useState<PrayerPhrase[]>(() => {
    try {
      const savedPhrases = localStorage.getItem('fajrPrayerPhrases');
      return savedPhrases ? JSON.parse(savedPhrases) : INITIAL_FAJR_PRAYER_PHRASES;
    } catch (error) {
      console.error("Could not parse localStorage data:", error);
      return INITIAL_FAJR_PRAYER_PHRASES;
    }
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activePhraseId, setActivePhraseId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const stopTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('fajrPrayerPhrases', JSON.stringify(prayerPhrases));
    } catch (error) {
      console.error("Could not save data to localStorage:", error);
    }
  }, [prayerPhrases]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateCurrentTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      setActivePhraseId(null);
    };

    audio.addEventListener('timeupdate', updateCurrentTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateCurrentTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', onEnded);
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const currentActivePhrase = prayerPhrases.find(p => 
      currentTime >= p.video_timestamp && currentTime < (p.video_timestamp + p.duration)
    );
    setActivePhraseId(currentActivePhrase ? currentActivePhrase.id : null);
  }, [currentTime, prayerPhrases]);


  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (stopTimeoutRef.current) {
          clearTimeout(stopTimeoutRef.current);
          stopTimeoutRef.current = null;
        }
        const playPromise = audioRef.current.play();
        setIsPlaying(true); // Optimistic update
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Error playing audio:", error);
              setIsPlaying(false); // Revert on actual error
            }
          });
        }
      }
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const time = parseFloat(event.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePlayPhrase = (phrase: PrayerPhrase) => {
    if (audioRef.current) {
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
      }
      audioRef.current.currentTime = phrase.video_timestamp;
      
      const playPromise = audioRef.current.play();
      setIsPlaying(true);
      setActivePhraseId(phrase.id);

      if (playPromise !== undefined) {
        playPromise.then(() => {
          stopTimeoutRef.current = window.setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
              setActivePhraseId(null);
              stopTimeoutRef.current = null;
            }
          }, phrase.duration * 1000);
        }).catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Error playing phrase:", error);
            setIsPlaying(false);
            setActivePhraseId(null);
          }
        });
      }
    }
  };

  const handleTimestampChange = (id: number, value: string) => {
    const newTimestamp = parseFloat(value);
    if (!isNaN(newTimestamp)) {
      setPrayerPhrases(prev =>
        prev.map(p => (p.id === id ? { ...p, video_timestamp: newTimestamp } : p))
      );
    }
  };

  const handleDurationChange = (id: number, value: string) => {
    const newDuration = parseFloat(value);
    if (!isNaN(newDuration)) {
      setPrayerPhrases(prev =>
        prev.map(p => (p.id === id ? { ...p, duration: newDuration } : p))
      );
    }
  };
  
  const toggleSettings = () => setShowSettings(prev => !prev);


  return (
    <div className="app-container">
      <audio
        ref={audioRef}
        src="https://ia601208.us.archive.org/14/items/how-to-perform-salat-al-fajr-dawn-prayer/How%20to%20Perform%20Salat%20al%20Fajr%20%28Dawn%20Prayer%29.mp3"
        preload="metadata"
      ></audio>

      <div className="card audio-player">
        <div className="audio-player-controls">
           <button onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              {isPlaying ? (
                <path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z"/>
              ) : (
                <path d="M8 5V19L19 12L8 5Z"/>
              )}
            </svg>
          </button>
          <span className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <input
            type="range"
            className="seek-bar"
            value={currentTime}
            max={duration || 0}
            onChange={handleSeek}
            aria-label="Seek audio"
          />
          {/* Add volume and other controls if needed */}
        </div>
      </div>
      
      <div className="settings-header">
         <button className="btn" onClick={toggleSettings}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.2305 6.01465L12.5322 4.71289L14.2871 6.46777L12.9854 7.76953C13.293 8.44141 13.5 9.18945 13.5 10C13.5 13.0322 11.0322 15.5 8 15.5C4.96777 15.5 2.5 13.0322 2.5 10C2.5 6.96777 4.96777 4.5 8 4.5C8.81055 4.5 9.55859 4.70703 10.2305 5.01465L11.2305 6.01465ZM15 3L13.5 1.5L11 4L9 2L7 4L4.5 1.5L3 3L5.5 5.5C4.55371 6.55176 4 7.91016 4 9.5C4 12.5322 6.46777 15 9.5 15C12.5322 15 15 12.5322 15 9.5C15 7.91016 14.4463 6.55176 13.5 5.5L15 3Z" fill="#6c757d"/>
          </svg>
          {showSettings ? 'Ocultar' : 'Mostrar'} Ajustes
        </button>
      </div>


      {prayerPhrases.map((phrase, index) => {
        const arabicSegments = phrase.arabic.split('|');
        const transliterationSegments = phrase.transliteration.split('|');
        const phoneticsSegments = phrase.phonetics_spanish.split('|');
        const translationSegments = phrase.translation_per_segment.split('|');
        const highlightTimings = phrase.highlight_timing.split('|').map(t => {
            const [start, end] = t.split('-').map(Number);
            return { start, end };
        });

        let activeSegmentIndex = -1;
        if (activePhraseId === phrase.id) {
            const phraseCurrentTime = currentTime - phrase.video_timestamp;
            activeSegmentIndex = highlightTimings.findIndex(timing => 
                phraseCurrentTime >= timing.start && phraseCurrentTime < timing.end
            );
        }

        return (
          <div key={phrase.id} className={`card ${activePhraseId === phrase.id ? 'active' : ''}`}>
            <div className="phrase-header">
              <h2>{index + 1}. {phrase.name}</h2>
              <div className="phrase-controls">
                {showSettings && (
                  <>
                    <div className="input-group">
                      <label htmlFor={`ts-${phrase.id}`}>Timestamp (seg)</label>
                      <input
                        id={`ts-${phrase.id}`}
                        type="number"
                        step="0.01"
                        value={phrase.video_timestamp}
                        onChange={(e) => handleTimestampChange(phrase.id, e.target.value)}
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor={`dur-${phrase.id}`}>Duración (seg)</label>
                      <input
                        id={`dur-${phrase.id}`}
                        type="number"
                        step="0.01"
                        value={phrase.duration}
                        onChange={(e) => handleDurationChange(phrase.id, e.target.value)}
                      />
                    </div>
                  </>
                )}
                <button className="btn btn-primary" onClick={() => handlePlayPhrase(phrase)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5V19L19 12L8 5Z"/>
                  </svg>
                  Escuchar
                </button>
              </div>
            </div>
            <div className="phrase-body">
              <div className="phrase-content">
                <div className="phrase-table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Árabe</th>
                        <th>Transliteración</th>
                        <th>Fonética (Español)</th>
                        <th>Significado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {arabicSegments.map((segment, i) => (
                        <tr key={i} className={i === activeSegmentIndex ? 'highlight' : ''}>
                          <td className="arabic-cell" dir="rtl">{segment}</td>
                          <td>{transliterationSegments[i] || ''}</td>
                          <td>{phoneticsSegments[i] || ''}</td>
                          <td>{translationSegments[i] || ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="full-translation">
                  <div className="label">Traducción Completa</div>
                  <div>{phrase.translation_spanish}</div>
                </div>
              </div>

              {phrase.position_image_names?.length > 0 && (
                <div className="position-images-container">
                  {phrase.position_image_names.map((name, idx) => (
                    <div key={idx} className="position-image-wrapper">
                      <img 
                        src={imageUrls[name]} 
                        alt={`Posición: ${name.replace('.png', '').replace(/_/g, ' ')}`} 
                      />
                      <span className="position-image-caption">
                        {name.replace('.png', '').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);