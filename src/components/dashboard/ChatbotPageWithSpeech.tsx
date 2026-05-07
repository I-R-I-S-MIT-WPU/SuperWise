import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { dataService } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

type TablePart = {
  type: 'table';
  headers: string[];
  rows: string[][];
} | {
  type: 'text';
  content: string;
};

interface ChatbotPageProps {
  user: any;
}

export function ChatbotPageWithSpeech({ user }: ChatbotPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello! I'm your AI superannuation advisor. I can help you understand your retirement projections, analyze your portfolio, and answer questions about your financial goals. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [voices, setVoices] = useState<any[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('en-AU-NatashaNeural');
  const [currentPlayingMessage, setCurrentPlayingMessage] = useState<string | null>(null);
  const [showVoiceSelect, setShowVoiceSelect] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadVoices();
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  const loadVoices = async () => {
    try {
      const response = await fetch('http://localhost:8000/voices');
      const data = await response.json();
      if (data.enabled) {
        setVoices(data.voices);
      } else {
        setSpeechEnabled(false);
        toast({
          title: "Speech Services Disabled",
          description: "Azure Speech Services are not configured. Text-only mode enabled.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      setSpeechEnabled(false);
    }
  };

  const parseMarkdownTable = (text: string) => {
    const tableRegex = /\|(.+)\|\s*\n\|[-\s|:]+\|\s*\n((?:\|.+\|\s*\n?)+)/g;
    const parts: TablePart[] = [];
    let lastIndex = 0;
    let match;

    while ((match = tableRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index).trim();
        if (beforeText) {
          parts.push({ type: 'text', content: beforeText });
        }
      }

      const headerRow = match[1];
      const headers = headerRow.split('|').map(h => h.trim()).filter(h => h);

      const bodyText = match[2];
      const rows = bodyText.trim().split('\n').map(row => {
        return row.split('|').map(cell => cell.trim()).filter(cell => cell);
      });

      parts.push({
        type: 'table',
        headers,
        rows: rows.filter(row => row.length === headers.length)
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex).trim();
      if (remainingText) {
        parts.push({ type: 'text', content: remainingText });
      }
    }

    if (parts.length === 0) {
      parts.push({ type: 'text', content: text });
    }

    return parts;
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const sectionHeaders = ['Summary', 'Strengths', 'Areas for Improvement', 'Recommendations',
      'Next Steps', 'Encouragement Statement', 'Key Metrics', 'Financial Snapshot'];

    return lines.map((line, lineIdx) => {
      const isHeading = sectionHeaders.some(header => line.trim().startsWith(header));
      const isBullet = line.trim().startsWith('-');
      const isNumbered = line.trim().match(/^\d+\./);

      return (
        <div
          key={lineIdx}
          className={`
            ${isHeading ? 'font-semibold mt-3 mb-2 text-card-foreground text-base' : ''}
            ${isBullet || isNumbered ? 'ml-4 mb-1' : 'mb-2'}
          `}
        >
          {line.trim()}
        </div>
      );
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        await processAudioInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Recording Started",
        description: "Speak your question now...",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioInput = async (audioBlob: Blob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const hexString = Array.from(uint8Array).map(b => b.toString(16).padStart(2, '0')).join('');

      const response = await fetch('http://localhost:8000/speech-to-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_data: hexString,
          language: 'en-AU'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setInputValue(result.text);
        toast({
          title: "Speech Recognized",
          description: `"${result.text}"`,
        });
      } else {
        toast({
          title: "Speech Recognition Failed",
          description: "Could not understand your speech. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Error",
        description: "Failed to process speech input.",
        variant: "destructive",
      });
    }
  };

  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentPlayingMessage(null);
    }
  };

  const textToSpeech = async (text: string, messageId?: string) => {
    if (!speechEnabled) return;

    stopAudioPlayback();

    try {
      const response = await fetch('http://localhost:8000/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice_name: selectedVoice
        }),
      });

      const result = await response.json();

      if (result.success) {
        const audioData = new Uint8Array(result.audio_data.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
        const audioBlob = new Blob([audioData], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setIsPlaying(true);
          setCurrentPlayingMessage(messageId || null);

          audioRef.current.onended = () => {
            setIsPlaying(false);
            setCurrentPlayingMessage(null);
            URL.revokeObjectURL(audioUrl);
          };
        }
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const userId = (user && (user.User_ID || user.id || user.userId)) as string;
      const response = await dataService.sendChatMessage(userId, currentInput);

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response || "I'm sorry, I couldn't process your request at the moment. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

      if (speechEnabled) {
        await textToSpeech(botResponse.content, botResponse.id);
      }
    } catch (error) {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm sorry, I'm having trouble connecting to the AI service. Please make sure the backend is running.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleQuestion = (question: string) => {
    setInputValue(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Voice display name helper
  const getVoiceDisplayName = () => {
    for (const [, voiceList] of Object.entries(voices)) {
      if (Array.isArray(voiceList)) {
        const found = voiceList.find((v: any) => v.name === selectedVoice);
        if (found) return found.display?.split(' ')[0] ?? 'Voice';
      }
    }
    return selectedVoice.includes('Natasha') ? 'Natasha' : 'Voice';
  };

  const sampleQuestions = [
    "What is my risk category?",
    "How much will I retire with?",
    "Am I on track?",
    "Compare to my age group",
    "Increase contribution by $200?",
    "Should I change risk profile?"
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Unified Chat Card */}
      <Card className="dashboard-card flex flex-col flex-1">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            {/* Title */}
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              AI Advisor
            </CardTitle>

            {/* Right: Mic + Speaker + Voice selector */}
            <div className="flex items-center gap-2">
              {/* Mic toggle button */}
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                className="h-9 w-9 rounded-lg"
                disabled={!speechEnabled}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>

              {/* Speaker / stop audio button */}
              <Button
                onClick={isPlaying ? stopAudioPlayback : () => setSpeechEnabled(!speechEnabled)}
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-lg"
                title={isPlaying ? "Stop audio" : speechEnabled ? "Disable speech" : "Enable speech"}
              >
                {isPlaying ? (
                  <VolumeX className="w-4 h-4 text-red-500" />
                ) : speechEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>

              {/* Voice selector dropdown */}
              {speechEnabled && (
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVoiceSelect(!showVoiceSelect)}
                    className="h-9 px-3 rounded-lg text-sm font-medium flex items-center gap-1"
                    title="Change voice"
                  >
                    {getVoiceDisplayName()}
                    <span className="text-muted-foreground text-xs">▾</span>
                  </Button>
                  {showVoiceSelect && (
                    <div className="absolute right-0 top-10 z-50 bg-card border border-border rounded-xl shadow-xl p-1 min-w-[220px]">
                      <p className="text-xs text-muted-foreground px-3 py-2 font-medium">Select Voice</p>
                      <div className="max-h-56 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/30 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50">
                        {Object.entries(voices).map(([lang, voiceList]: [string, any]) => (
                          <div key={lang}>
                            <p className="text-xs text-muted-foreground/60 px-3 py-1 uppercase tracking-wider font-semibold">
                              {lang}
                            </p>
                            {Array.isArray(voiceList) && voiceList.map((voice: any) => (
                              <button
                                key={voice.name}
                                onClick={() => { setSelectedVoice(voice.name); setShowVoiceSelect(false); }}
                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors hover:bg-muted flex items-center justify-between ${
                                  selectedVoice === voice.name
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-foreground'
                                }`}
                              >
                                {voice.display}
                                {selectedVoice === voice.name && (
                                  <span className="text-primary text-xs">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-0 pb-4 px-4 flex flex-col flex-1">
          {/* Chat Area */}
          <div className="flex-1 min-h-[300px] border border-border rounded-xl overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-full">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}

                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div
                        className={`p-3 rounded-xl text-sm ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        {message.type === 'bot' ? (
                          <div className="space-y-3">
                            {parseMarkdownTable(message.content).map((part, idx) => {
                              if (part.type === 'table') {
                                return (
                                  <div key={idx} className="my-4">
                                    <div className="overflow-x-auto">
                                      <table className="w-full border-collapse border border-border rounded-lg">
                                        <thead>
                                          <tr className="bg-muted/60">
                                            {part.headers.map((header: string, headerIdx: number) => (
                                              <th
                                                key={headerIdx}
                                                className="border border-border px-3 py-2 text-left font-semibold text-card-foreground text-sm"
                                              >
                                                {header}
                                              </th>
                                            ))}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {part.rows.map((row: string[], rowIdx: number) => (
                                            <tr key={rowIdx} className={rowIdx % 2 === 0 ? '' : 'bg-muted/30'}>
                                              {row.map((cell: string, cellIdx: number) => (
                                                <td
                                                  key={cellIdx}
                                                  className="border border-border px-3 py-2 text-card-foreground text-sm"
                                                >
                                                  {cell}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div key={idx}>
                                    {renderFormattedText(part.content)}
                                  </div>
                                );
                              }
                            })}
                          </div>
                        ) : (
                          message.content
                        )}
                      </div>
                      <div className={`text-xs text-muted-foreground mt-1 flex items-center gap-2 ${
                        message.type === 'user' ? 'text-right justify-end' : 'text-left justify-start'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.type === 'bot' && speechEnabled && (
                          <button
                            onClick={() => textToSpeech(message.content, message.id)}
                            className="p-1 hover:bg-muted rounded-full transition-colors"
                            title="Read this message"
                            disabled={isPlaying && currentPlayingMessage === message.id}
                          >
                            {isPlaying && currentPlayingMessage === message.id ? (
                              <VolumeX className="w-3 h-3 text-red-500" />
                            ) : (
                              <Volume2 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="p-3 bg-muted rounded-xl">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Input Row — styled container like the reference image */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-muted/20 dark:bg-muted/10">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 h-9 text-sm bg-transparent border-none shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground px-0"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="icon"
              className="h-8 w-8 flex-shrink-0 rounded-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {/* Sample Questions — chips below input */}
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSampleQuestion(question)}
                className="inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-border bg-background hover:bg-muted text-foreground transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element for TTS */}
      <audio ref={audioRef} />
    </div>
  );
}