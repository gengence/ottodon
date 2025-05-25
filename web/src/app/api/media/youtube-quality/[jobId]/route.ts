import { NextRequest, NextResponse } from 'next/server';
import { fileQueue } from '../../../../../lib/queue/fileQueue';
import { YouTubeDownloader } from '../../../../../lib/downloaders/youtubeDownloader';
import ytdl from '@distube/ytdl-core';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await context.params;
    const { quality } = await request.json();
    
    const job = await fileQueue.getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Extract YouTube URL from the original job
    // The URL should be stored somewhere in the job data
    const originalName = job.file.originalName;
    const videoId = originalName.match(/youtube_.*_([a-zA-Z0-9_-]{11})\./)?.[1];
    
    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract video ID' }, { status: 400 });
    }
    
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    
    const downloader = new YouTubeDownloader();
    
    const info = await ytdl.getInfo(url);
    
    let format;
    let filename;
    
    if (quality === 'audioonly') {
      format = ytdl.chooseFormat(info.formats, {
        quality: 'highestaudio',
        filter: 'audioonly'
      });
      
      const safeTitle = info.videoDetails.title
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100);
      
      filename = `youtube_${safeTitle}_${info.videoDetails.videoId}.mp3`;
    } else {
      const qualityMap: Record<string, string[]> = {
        '1080p': ['137', '248', '299', '303'],
        '720p': ['136', '247', '298', '302'],
        '480p': ['135', '244', '245', '246']
      };
      
      const itags = qualityMap[quality] || [];
      
      format = info.formats.find(f => itags.includes(f.itag.toString()));
      
      if (!format) {
        format = ytdl.chooseFormat(info.formats, {
          quality: 'highest',
          filter: (f) => f.qualityLabel === quality && f.hasVideo
        });
      }
      
      if (!format) {
        format = ytdl.chooseFormat(info.formats, {
          quality: 'highestvideo'
        });
      }
      
      const safeTitle = info.videoDetails.title
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '_')
        .substring(0, 100);
      
      filename = `youtube_${safeTitle}_${quality}_${info.videoDetails.videoId}.mp4`;
    }
    
    if (!format) {
      return NextResponse.json({ error: 'No suitable format found' }, { status: 400 });
    }
    
    const videoStream = ytdl(url, { format });
    const chunks: Buffer[] = [];
    
    return new Promise((resolve) => {
      videoStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      videoStream.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        resolve(new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': format.mimeType || (quality === 'audioonly' ? 'audio/mpeg' : 'video/mp4'),
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length.toString()
          }
        }));
      });
      
      videoStream.on('error', (error) => {
        resolve(NextResponse.json(
          { error: 'Failed to download video' },
          { status: 500 }
        ));
      });
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to download video with specified quality' },
      { status: 500 }
    );
  }
} 