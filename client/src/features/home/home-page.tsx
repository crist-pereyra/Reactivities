'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Moon, Sun, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UsersIcon } from '@/components/ui/users';

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  darkGradient,
  lightGradient,
  isDark,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  darkGradient: string;
  lightGradient: string;
  isDark: boolean;
}) {
  const gradient = isDark ? darkGradient : lightGradient;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn('absolute', className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
        style={{
          width,
          height,
        }}
        className='relative'
      >
        <div
          className={cn(
            'absolute inset-0 rounded-full',
            'bg-gradient-to-r to-transparent',
            gradient,
            'backdrop-blur-[2px] border-2',
            isDark ? 'border-white/[0.15]' : 'border-black/[0.1]',
            isDark
              ? 'shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]'
              : 'shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]',
            'after:absolute after:inset-0 after:rounded-full',
            isDark
              ? 'after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]'
              : 'after:bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.1),transparent_70%)]'
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export const HomePage = () => {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Handle theme detection and changes
  useEffect(() => {
    setMounted(true);
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  // Don't render until we've checked the theme to avoid flashing
  if (!mounted) return null;

  return (
    <div
      className={cn(
        'relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden',
        isDark ? 'bg-[#030303]' : 'bg-[#f8f9fa]'
      )}
    >
      {/* Theme toggle button in top right */}
      <motion.div
        className='absolute top-4 right-4 z-50'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant='outline'
          size='icon'
          className={cn(
            'rounded-full',
            isDark
              ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50 hover:text-white backdrop-blur-sm'
              : 'bg-white/50 border-slate-200/50 hover:bg-slate-100/50 backdrop-blur-sm'
          )}
          onClick={toggleTheme}
          aria-label='Toggle theme'
        >
          {isDark ? (
            <Sun className='h-5 w-5 text-yellow-300' />
          ) : (
            <Moon className='h-5 w-5 text-slate-700' />
          )}
        </Button>
      </motion.div>

      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br blur-3xl',
          isDark
            ? 'from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]'
            : 'from-indigo-500/[0.03] via-transparent to-rose-500/[0.03]'
        )}
      />

      <div className='absolute inset-0 overflow-hidden'>
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          darkGradient='from-indigo-500/[0.15]'
          lightGradient='from-indigo-500/[0.1]'
          isDark={isDark}
          className='left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]'
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          darkGradient='from-rose-500/[0.15]'
          lightGradient='from-rose-500/[0.1]'
          isDark={isDark}
          className='right-[-5%] md:right-[0%] top-[70%] md:top-[75%]'
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          darkGradient='from-violet-500/[0.15]'
          lightGradient='from-violet-500/[0.1]'
          isDark={isDark}
          className='left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]'
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          darkGradient='from-amber-500/[0.15]'
          lightGradient='from-amber-500/[0.1]'
          isDark={isDark}
          className='right-[15%] md:right-[20%] top-[10%] md:top-[15%]'
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          darkGradient='from-cyan-500/[0.15]'
          lightGradient='from-cyan-500/[0.1]'
          isDark={isDark}
          className='left-[20%] md:left-[25%] top-[5%] md:top-[10%]'
        />
      </div>

      <div className='relative z-10 container mx-auto px-4 md:px-6'>
        <div className='max-w-3xl mx-auto text-center'>
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial='hidden'
            animate='visible'
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1 rounded-full  border  mb-8 md:mb-12',
              isDark
                ? 'bg-white/[0.03] border-white/[0.08]'
                : 'bg-black/[0.03] border-black/[0.08]'
            )}
          >
            <UsersIcon
              className={cn('my-2', isDark ? 'text-white' : 'text-black')}
            />
          </motion.div>
          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial='hidden'
            animate='visible'
          >
            <h1 className='text-4xl sm:text-6xl md:text-8xl font-bold mb-6 md:mb-8 tracking-tight'>
              <span
                className={cn(
                  'bg-clip-text text-transparent bg-gradient-to-r',
                  isDark
                    ? 'from-indigo-300 via-white/90 to-rose-300'
                    : 'from-indigo-600 via-purple-600 to-rose-600'
                )}
              >
                Reactivities
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial='hidden'
            animate='visible'
          >
            <p
              className={cn(
                'text-base sm:text-lg md:text-xl mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4',
                isDark ? 'text-white/40' : 'text-black/60'
              )}
            >
              Welcome to Reactivities! A React app for activities with ASP .NET
              Core.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial='hidden'
            animate='visible'
          >
            <Link to='/activities'>
              <Button
                className={cn(
                  'px-8! py-6 rounded-full font-medium text-base mx-auto',
                  'bg-gradient-to-r shadow-lg',
                  'group flex items-center gap-2',
                  isDark
                    ? 'from-indigo-500 to-rose-500 text-white hover:from-indigo-600 hover:to-rose-600'
                    : 'from-indigo-400 to-rose-400 text-white hover:from-indigo-500 hover:to-rose-500'
                )}
              >
                Go to Activities
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t pointer-events-none',
          isDark
            ? 'from-[#030303] via-transparent to-[#030303]/80'
            : 'from-[#f8f9fa] via-transparent to-[#f8f9fa]/80'
        )}
      />
    </div>
  );
};
