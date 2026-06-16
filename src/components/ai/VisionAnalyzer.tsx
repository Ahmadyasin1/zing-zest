'use client';

import { useState, useRef } from 'react';
import { Eye, Upload, Loader2 } from 'lucide-react';
import { GlassCard, Btn, ErrorBanner } from '@/components/ui/primitives';
import { fetchJson } from '@/lib/utils';

type Task = 'caption' | 'vqa' | 'ocr';

export function VisionAnalyzer() {
  const [preview, setPreview] = useState('');
  const [question, setQuestion] = useState('What food items are visible?');
  const [task, setTask] = useState<Task>('caption');
  const [result, setResult] = useState('');
  const [objects, setObjects] = useState<{ label: string; score: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!preview) return;
    setLoading(true);
    setError('');
    setResult('');
    setObjects([]);
    try {
      const vision = await fetchJson<{ result: string }>('/api/ai/vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview, question, task }),
      });
      setResult(vision.result);

      const detect = await fetchJson<{ objects: { label: string; score: number }[] }>('/api/ai/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview }),
      });
      setObjects(detect.objects.slice(0, 8));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard>
      <div className="mb-4 flex items-center gap-2">
        <Eye className="h-5 w-5 text-teal-400" />
        <h3 className="font-bold">Computer Vision Lab</h3>
        <span className="text-[0.65rem] text-muted">Caption · VQA · OCR · DETR</span>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />

      <div
        onClick={() => fileRef.current?.click()}
        className="mb-3 flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 hover:border-teal-500/40"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Upload preview" className="max-h-full max-w-full rounded-lg object-contain" />
        ) : (
          <>
            <Upload className="mb-2 h-8 w-8 text-muted" />
            <p className="text-sm text-muted">Upload food/marketing image</p>
          </>
        )}
      </div>

      <div className="mb-2 flex gap-2">
        {(['caption', 'vqa', 'ocr'] as Task[]).map((t) => (
          <Btn key={t} variant={task === t ? 'primary' : 'secondary'} onClick={() => setTask(t)}>
            {t.toUpperCase()}
          </Btn>
        ))}
      </div>

      {task === 'vqa' && (
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
          placeholder="Ask a question about the image..."
        />
      )}

      <Btn onClick={analyze} disabled={!preview || loading} className="mb-4 w-full justify-center">
        {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing…</> : 'Run Vision Analysis'}
      </Btn>

      {error && <ErrorBanner message={error} onRetry={analyze} />}

      {result && (
        <div className="mb-3 rounded-xl bg-teal-500/10 p-3 text-sm leading-relaxed text-teal-100">
          <strong className="text-teal-400">Vision Result:</strong>
          <p className="mt-1">{result}</p>
        </div>
      )}

      {objects.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-muted">Object Detection (DETR)</p>
          <div className="flex flex-wrap gap-2">
            {objects.map((o, i) => (
              <span key={i} className="rounded-full bg-orange-500/15 px-2.5 py-1 text-xs text-orange-300">
                {o.label} ({Math.round(o.score * 100)}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}
