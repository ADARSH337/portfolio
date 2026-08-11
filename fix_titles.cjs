const fs = require('fs');
let file = fs.readFileSync('src/utils/db.ts', 'utf8');

const titleMap = {
  'bike': 'Cinematic Bike Edit',
  'bike2': 'Motorcycle Motion Cut',
  'motivation': 'Motivation Cinematic Reel',
  'chai': 'Chai Cinematic Edit',
  'frds_trend_reel_edit': 'Friends Trend Reel',
  'friendshipday_compressed': 'Friendship Day Special Edit',
  'photographer': 'Behind the Lens',
  'photographer1': 'Photographer Cinematic Cut',
  'thunder': 'Thunderstorm Timelapse',
  'sky': 'Sky & Clouds Timelapse',
  'sky2': 'Golden Hour Sky Edit',
  'sky3': 'Cinematic Sky Aesthetics',
  'sky4': 'Evening Sky Transitions',
  'sky5': 'Sunset Sky Motion',
  'storage': 'Storage & Tech Setup Reel',
  'recording': 'Studio Recording Session',
  'ig': 'Instagram Viral Reel Edit',
  'rainbow_1': 'Cinematic Rainbow Capture'
};

const descMap = {
  'bike': 'High-octane motorcycle visual edit featuring speed ramping and heavy color grading.',
  'bike2': 'Dynamic bike motion reel showcasing cinematic riding angles and sound design.',
  'motivation': 'Inspirational visual sequence designed to motivate and engage audiences.',
  'chai': 'A moody, cinematic short film capturing the essence and warmth of a perfect cup of chai.',
  'frds_trend_reel_edit': 'Fast-paced, trendy social media reel capturing memorable moments with friends.',
  'friendshipday_compressed': 'Heartwarming compilation edit created specifically for Friendship Day.',
  'photographer': 'A raw look behind the scenes of a professional photography shoot.',
  'photographer1': 'Showcasing the art of photography through cinematic lenses and slow motion.',
  'thunder': 'Breathtaking capture of a live thunderstorm with heavy environmental sound design.',
  'sky': 'Beautiful, sweeping timelapse sequence of moving clouds and natural lighting.',
  'sky2': 'Rich sunset hues and golden hour aesthetics over dramatic landscapes.',
  'sky3': 'Visually striking sky compositions perfect for ambient backgrounds.',
  'sky4': 'Evening transitions capturing the shift from day to night in stunning detail.',
  'sky5': 'Warm and moody sunset motion capture focusing on light and shadows.',
  'storage': 'A clean, modern showcase of tech setups and studio organization.',
  'recording': 'Behind-the-scenes recording session capturing the creative audio process.',
  'ig': 'High-retention, fast-paced reel specifically formatted for Instagram algorithms.',
  'rainbow_1': 'Vivid capture of a double rainbow using polarizing filters for maximum contrast.'
};

let lines = file.split('\n');
let i = 0;
while (i < lines.length) {
  if (lines[i].includes('"id": "p25"')) {
    // Loop through p25 to p42
    let currentId = parseInt(lines[i].match(/"id": "p(\d+)"/)[1]);
    
    // Find the video URL to determine the file name
    let tempI = i;
    let videoFile = '';
    while (tempI < lines.length && !lines[tempI].includes('}')) {
      if (lines[tempI].includes('"video_url"')) {
        let match = lines[tempI].match(/\/([^\/]+)\.(mp4|mov)/i);
        if (match) videoFile = match[1];
      }
      tempI++;
    }
    
    if (videoFile && titleMap[videoFile]) {
      // Update title and description
      let titleI = i;
      while (titleI < tempI) {
        if (lines[titleI].includes('"title":')) {
          lines[titleI] = `    "title": "${titleMap[videoFile]}",`;
        }
        if (lines[titleI].includes('"slug":')) {
          let slug = titleMap[videoFile].toLowerCase().replace(/[^a-z0-9]+/g, '-');
          lines[titleI] = `    "slug": "${slug}",`;
        }
        if (lines[titleI].includes('"description":')) {
          lines[titleI] = `    "description": "${descMap[videoFile]}",`;
        }
        titleI++;
      }
    }
    i = tempI;
  }
  
  if (lines[i].includes('const DB_VERSION =')) {
      let v = parseInt(lines[i].match(/v(\d+)/)[1]);
      lines[i] = `const DB_VERSION = 'v${v+1}-accurate-titles';`;
  }
  
  i++;
}

fs.writeFileSync('src/utils/db.ts', lines.join('\n'));
console.log('Successfully updated titles for p25 to p42 based on filenames!');
