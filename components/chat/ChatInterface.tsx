'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, ClipboardList, MessageSquare, ThumbsUp, ThumbsDown, Loader2, ArrowRight } from "lucide-react";
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  displayText?: string;
  isTyping?: boolean;
  feedback?: 'positive' | 'negative';
};

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: "initial",
    role: "assistant",
    content: "Hi! I'm SyncIn's AI buddy. Ask me anything about your academic journey, upcoming hackathons, or resources you need! 😎",
    timestamp: new Date(),
    displayText: "Hi! I'm SyncIn's AI buddy. Ask me anything about your academic journey, upcoming hackathons, or resources you need! 😎"
  }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingInterval = useRef<NodeJS.Timeout>();

  const suggestedQuestions = [
    'What is SyncIn?',
    'How can I track my progress?',
    'What hackathons are available?',
    'How do I connect with mentors?'
  ];

  // Smooth scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Typewriter effect for AI messages
  const typeMessage = useCallback((messageId: string, fullText: string, onComplete?: () => void) => {
    let currentIndex = 0;
    
    // Clear any existing interval
    if (typingInterval.current) {
      clearInterval(typingInterval.current);
    }

    typingInterval.current = setInterval(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, displayText: fullText.substring(0, currentIndex) } 
            : msg
        )
      );
      
      currentIndex++;
      scrollToBottom();

      if (currentIndex > fullText.length) {
        if (typingInterval.current) {
          clearInterval(typingInterval.current);
        }
        if (onComplete) onComplete();
      }
    }, 10); // Adjust typing speed here (lower = faster)
  }, [scrollToBottom]);

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (typingInterval.current) {
        clearInterval(typingInterval.current);
      }
    };
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now().toString(10)}-user`,
      role: 'user',
      content: input,
      timestamp: new Date(),
      displayText: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
          context: messages
            .map(({ id, ...rest }) => rest)
            .slice(-4)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      const answer = data.answer || "I'm not sure how to respond to that.";

      const assistantMessage: Message = {
        id: `msg-${Date.now().toString(10)}`,
        content: answer,
        role: 'assistant',
        timestamp: new Date(),
        displayText: '',
        isTyping: true
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Start typing animation
      typeMessage(assistantMessage.id, answer, () => {
        // When typing is complete
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, isTyping: false }
              : msg
          )
        );
      });
      
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now().toString(10)}`,
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date(),
        displayText: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
    
    // Here you would typically send this feedback to your backend
    console.log(`Feedback for message ${messageId}:`, feedback);
  };

  // Format message content with markdown-like formatting
  const formatMessageContent = (text: string) => {
    if (!text) return null;
    
    // Split into paragraphs
    return text.split('\n\n').map((paragraph, i) => (
      <p key={i} className="mb-3 last:mb-0">
        {paragraph.split('\n').map((line, j, arr) => (
          <span key={j}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ))}
      </p>
    ));
  };

  return (
    <div className="flex flex-col h-full font-inter bg-background/50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Bot className="w-16 h-16 text-primary mx-auto" />
            </motion.div>
            <motion.h3 
              className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              How can I help you today?
            </motion.h3>
            <motion.p 
              className="text-muted-foreground mb-8 text-base max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Ask me anything about programming, algorithms, system design, or any technical topic.
            </motion.p>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  onClick={() => setInput(question)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-left p-4 rounded-xl border border-border/50 bg-card/50 hover:bg-accent/20 transition-all duration-200 hover:shadow-md backdrop-blur-sm"
                >
                  <p className="text-sm font-medium text-foreground">{question}</p>
                </motion.button>
              ))}
            </motion.div>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[90%] md:max-w-[85%] rounded-2xl p-5 shadow-sm relative overflow-hidden',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted/80 text-foreground rounded-bl-none border border-border/30'
                    )}
                  >
                    {/* Typing indicator for AI messages */}
                    {message.role === 'assistant' && message.isTyping && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                        <motion.div 
                          className="h-full bg-primary/70"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'reverse'
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5',
                        message.role === 'user' 
                          ? 'bg-primary-foreground/20' 
                          : 'bg-primary/10 text-primary'
                      )}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="prose prose-sm max-w-none text-foreground/90">
                          {formatMessageContent(message.displayText || message.content)}
                          
                          {/* Typing cursor */}
                          {message.isTyping && (
                            <span className="inline-block w-2 h-5 bg-primary/80 ml-1 animate-pulse"></span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/20">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          
                          {message.role === 'assistant' && !message.isTyping && (
                            <div className="flex space-x-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFeedback(message.id, 'positive');
                                }}
                                className={cn(
                                  'p-1.5 rounded-full transition-colors',
                                  message.feedback === 'positive'
                                    ? 'text-green-500 bg-green-500/10'
                                    : 'text-muted-foreground/60 hover:text-green-500 hover:bg-green-500/10'
                                )}
                                title="Helpful"
                              >
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFeedback(message.id, 'negative');
                                }}
                                className={cn(
                                  'p-1.5 rounded-full transition-colors',
                                  message.feedback === 'negative'
                                    ? 'text-red-500 bg-red-500/10'
                                    : 'text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/10'
                                )}
                                title="Not helpful"
                              >
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Input area */}
      <motion.div 
        className="border-t border-border/30 bg-background/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form 
          onSubmit={handleSubmit} 
          className="flex items-end gap-3 max-w-4xl mx-auto"
        >
          <div className="relative flex-1">
            <motion.div
              className={cn(
                'absolute -top-2 left-4 px-2 text-xs font-medium text-muted-foreground/70 bg-background/80 rounded-full border border-border/30',
                'transform -translate-y-1/2 transition-all duration-200',
                input ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              )}
            >
              Ask me anything...
            </motion.div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className={cn(
                'w-full rounded-2xl border border-border/50 bg-background/80 px-5 py-3.5 pr-14 text-base shadow-sm',
                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50',
                'disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-200',
                'placeholder:text-muted-foreground/40',
                'backdrop-blur-sm',
                input ? 'pt-5 pb-3' : 'py-3.5'
              )}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={!isLoading && input.trim() ? { scale: 1.05 } : {}}
              whileTap={!isLoading && input.trim() ? { scale: 0.95 } : {}}
              className={cn(
                'absolute right-2 bottom-2 p-2 rounded-full transition-all',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/30',
                !input.trim() || isLoading
                  ? 'text-muted-foreground/40'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'
              )}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </motion.button>
          </div>
        </form>
        
        {/* Quick suggestions when input is empty */}
        {!input.trim() && messages.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 mt-3 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <motion.button
                key={index}
                onClick={() => setInput(question)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs px-3 py-1.5 rounded-full bg-accent/30 text-foreground/80 hover:bg-accent/40 transition-colors"
              >
                {question}
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
