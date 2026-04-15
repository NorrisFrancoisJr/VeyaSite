import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const inputPath = 'public/turtle-beach-villa/Turtle Villa Hero Video.mov';
const outputPath = 'public/turtle-beach-villa/turtle_hero_compressed.mp4';

console.log('Starting modern web-optimized compression (H.264, +faststart)...');

ffmpeg(inputPath)
  .outputOptions([
    '-c:v libx264',           // Encode to universally supported H.264
    '-preset slow',           // Use slow preset for maximum optimization vs size
    '-crf 24',                // Visually lossless web compression factor
    '-c:a aac',               // Ensure AAC audio (widely compatible)
    '-b:a 128k',              // Standard web audio bitrate
    '-movflags +faststart',   // CRITICAL for web: Stream instantly on load
    '-vf scale=\'min(1920,iw)\':-2', // Cap dimensions to 1080p to maintain WebVitals score
    '-pix_fmt yuv420p'        // Ensures 4:2:0 color space, mandatory for Safari/iOS compatibility
  ])
  .on('end', () => {
    console.log('Compression completed successfully!');
    process.exit(0);
  })
  .on('error', (err) => {
    console.error('Error during compression:', err);
    process.exit(1);
  })
  .on('progress', (progress) => {
    if (progress.percent && parseInt(progress.percent) % 20 === 0) {
       console.log(`Processing: ${Math.floor(progress.percent)}% done`);
    }
  })
  .save(outputPath);
