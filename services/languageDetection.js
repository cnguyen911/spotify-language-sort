
const commonWords = [
  'feat', 'ft', 'remix', 'version', 'edit', 'mix', 'remastered', 
  'original', 'radio', 'extended', 'instrumental', 'acoustic'
];

const detectLanguage = (text) => {
  const scores = {
    'Vietnamese': 0,
    'French': 0,
    'Spanish': 0,
    'German': 0,
    'Italian': 0,
    'Portuguese': 0,
    'Dutch': 0,
    'Swedish': 0,
    'Norwegian': 0,
    'Danish': 0,
    'Finnish': 0,
    'Polish': 0,
    'Czech': 0,
    'Hungarian': 0,
    'Romanian': 0,
    'Turkish': 0,
    'Greek': 0,
    'Russian': 0,
    'Ukrainian': 0,
    'Bulgarian': 0,
    'Japanese': 0,
    'Korean': 0,
    'Chinese': 0,
    'Traditional Chinese': 0,
    'Thai': 0,
    'Arabic': 0,
    'Hebrew': 0,
    'Hindi': 0,
    'Bengali': 0,
    'Tamil': 0,
    'Telugu': 0,
    'Kannada': 0,
    'Malayalam': 0,
    'Filipino': 0,
    'Indonesian': 0,
    'English': 0
  };
  
  if (/[ăâêôơưđ]/i.test(text)) {
    scores['Vietnamese'] += 15; 
  }
  if (/[àáạảãâấầậẩẫăắằặẳẵàáạảãèéẹẻẽêếềệểễìíịỉĩòóọỏõôốồộổỗơớờợởỡùúụủũưứừựửữỳýỵỷỹ]/i.test(text)) {
    scores['Vietnamese'] += 10;
  }
  if (/\b(và|của|có|không|là|đã|được|trong|một|người|những|cho|các|về|này|năm)\b/i.test(text)) {
    scores['Vietnamese'] += 10;
  }
  
  if (/[éèêëàâôûùïüÿœæç]/i.test(text)) {
    scores['French'] += 5;
  }
  if (/\b(le|la|les|du|des|au|aux|mon|ma|mes|ton|ta|tes|son|sa|ses|ce|cette|ces|je|tu|il|elle|nous|vous|ils|elles)\b/i.test(text)) {
    scores['French'] += 5;
  }
  
  if (/[áéíóúüñ¿¡]/i.test(text)) {
    scores['Spanish'] += 5;
  }
  if (/\b(el|la|los|las|un|una|unos|unas|y|o|de|del|al|a|en|con|por|para|mi|tu|su|nuestro|vuestra)\b/i.test(text)) {
    scores['Spanish'] += 5;
  }
  
  if (/[äöüß]/i.test(text)) {
    scores['German'] += 5;
  }
  if (/\b(der|die|das|ein|eine|zu|aus|mit|und|oder|nicht|ist|sind|war|waren|wird|werden)\b/i.test(text)) {
    scores['German'] += 5;
  }
  
  if (/[àèéìíîòóùú]/i.test(text)) {
    scores['Italian'] += 5;
  }
  if (/\b(il|lo|la|i|gli|le|un|uno|una|di|del|della|dei|degli|delle|in|con|su|per|tra|fra)\b/i.test(text)) {
    scores['Italian'] += 5;
  }
  if (/\b(italia|italie|italiano|italiani|italiana|italiane)\b/i.test(text)) {
    scores['Italian'] += 10;
  }

  if (/[ãõáàâäéèêëíìîïóòôöúùûüç]/i.test(text)) {
    scores['Portuguese'] += 5;
  }
  if (/\b(o|a|os|as|um|uma|uns|umas|de|da|do|das|dos|em|no|na|nos|nas|ao|aos|à|às)\b/i.test(text)) {
    scores['Portuguese'] += 5;
  }
  
  if (/\b(de|het|een|van|in|op|aan|met|door|over|voor|na|naar|uit|bij)\b/i.test(text)) {
    scores['Dutch'] += 5;
  }
  
  if (/[åäö]/i.test(text)) {
    scores['Swedish'] += 5;
  }
  if (/\b(och|att|det|som|en|ett|den|i|på|är|av|för|med|till)\b/i.test(text)) {
    scores['Swedish'] += 5;
  }
  
  
  if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/i.test(text)) {
    scores['Japanese'] += 15; 
  }
  
  if (/[\uac00-\ud7af\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff]/i.test(text)) {
    scores['Korean'] += 15; 
  }
  
  if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/i.test(text)) {
    scores['Chinese'] += 10;
    if (/[\u8aaa\u8a9e\u8caa\u8cc8\u9f4a\u9aa8\u9e7d\u9ea5\u9ebb\u9ef9\u820a\u81ea]/i.test(text)) {
      scores['Traditional Chinese'] += 5;
    }
  }
  
  if (/^[a-zA-Z0-9\s.,!?'";:()-]+$/.test(text)) {
    scores['English'] += 3; 
  }
  
  let highestScore = 0;
  let detectedLanguage = 'Unknown';
  
  for (const [language, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      detectedLanguage = language;
    }
  }
  
  if (highestScore === 0) {
    return 'Unknown';
  }
  
  return detectedLanguage;
};

exports.detectLanguage = async (trackName, artistName) => {
  try {
    let cleanTrackName = trackName;
    
    cleanTrackName = cleanTrackName.replace(/\([^)]*\)/g, ' ').replace(/\[[^\]]*\]/g, ' ');
    
    commonWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      cleanTrackName = cleanTrackName.replace(regex, ' ');
    });
    
    const text = `${cleanTrackName} ${cleanTrackName} ${artistName}`;
    
    return detectLanguage(text);
  } catch (error) {
    console.error('Language detection error:', error);
    
    if (/^[a-zA-Z0-9\s.,!?'";:()-]+$/.test(trackName + ' ' + artistName)) {
      return 'English'; 
    }
    
    return 'Unknown';
  }
};