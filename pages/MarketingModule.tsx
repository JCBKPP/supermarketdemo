
import React, { useState } from 'react';
import { 
  Wand2, 
  Image as ImageIcon, 
  Type, 
  Sparkles, 
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { generateMarketingCopy, generatePromotionalImage } from '../services/gemini.ts';

const MarketingModule = () => {
  const [productName, setProductName] = useState('');
  const [tone, setTone] = useState('Excited');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  const handleGenerateCopy = async () => {
    if (!productName) return;
    setIsGeneratingCopy(true);
    const copy = await generateMarketingCopy(productName, tone);
    setGeneratedCopy(copy || '');
    setIsGeneratingCopy(false);
  };

  const handleGenerateImage = async () => {
    if (!productName) return;
    setIsGeneratingImage(true);
    const img = await generatePromotionalImage(productName);
    if (img) setGeneratedImageUrl(img);
    setIsGeneratingImage(false);
  };

  const handlePublish = () => {
    // Redirect to Facebook. In a real-world app, this might use a specific 
    // Graph API endpoint or a pre-filled share dialog, but for this requirement 
    // we redirect directly to the Facebook page.
    window.open('https://www.facebook.com', '_blank');
  };

  const hasContent = generatedCopy || generatedImageUrl;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Marketing & Campaign Lab</h1>
          <p className="text-slate-500">Create AI-powered marketing materials for your store.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Creation Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-blue-600 font-bold">
            <Wand2 size={20} />
            <h2>Campaign Assistant</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Target Product</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Organic Avocados, Fresh Whole Milk..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Tone</label>
              <div className="grid grid-cols-3 gap-3">
                {['Excited', 'Professional', 'Minimalist'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`py-2 text-sm font-medium rounded-lg border transition-all ${
                      tone === t ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 grid grid-cols-2 gap-4">
              <button 
                onClick={handleGenerateCopy}
                disabled={isGeneratingCopy || !productName}
                className="flex items-center justify-center gap-2 py-3 bg-white border border-blue-200 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingCopy ? <Loader2 className="animate-spin" size={20} /> : <Type size={20} />}
                Generate Copy
              </button>
              <button 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !productName}
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingImage ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                Generate Image
              </button>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Preview</span>
              <button 
                onClick={handlePublish}
                disabled={!hasContent}
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${
                  hasContent ? 'text-blue-600 hover:text-blue-700' : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <Send size={14} />
                Publish Post
              </button>
            </div>

            {!generatedCopy && !generatedImageUrl && (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-slate-400">
                <div className="p-4 bg-slate-50 rounded-full">
                  <Sparkles size={48} className="opacity-20" />
                </div>
                <p>Start generating content to see the magic happen.</p>
              </div>
            )}

            <div className="space-y-6">
              {generatedImageUrl && (
                <div className="aspect-square w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group relative">
                  <img src={generatedImageUrl} alt="Generated promo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              )}

              {generatedCopy && (
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 whitespace-pre-wrap text-slate-800 leading-relaxed italic">
                  "{generatedCopy}"
                </div>
              )}
            </div>

            {isGeneratingImage && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-blue-600" size={48} />
                <p className="font-bold text-slate-600">Generating Masterpiece...</p>
              </div>
            )}
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <p className="text-xs text-amber-800 leading-relaxed">
              AI content is generated for inspiration. Please review for accuracy and brand safety before publishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingModule;
