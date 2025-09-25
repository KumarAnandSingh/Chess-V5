import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Puzzle, Monitor, Trophy, Target, Crown, Zap, TrendingUp, Gamepad2, Save } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
import { cn } from '../../lib/utils';
import { Progress } from './progress';
import { Badge } from './badge';
import DailyPlanHorizontal from '../DailyPlanHorizontal';

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  cta: string;
  iconColor: string;
  bgGradient: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  icon, 
  to, 
  cta, 
  iconColor,
  bgGradient
}) => {
  const isPrimary = cta.includes('Try Free') || cta.includes('Play Now');
  
  return (
    <Card className="group h-full cursor-pointer transform hover:scale-[1.02] transition-all duration-300 overflow-hidden relative glass-card hover:shadow-elevated" style={{ borderColor: 'var(--color-border-default)' }}>
      {/* Enhanced Background Gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500 ${bgGradient}`} />
      
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-accent-primary/5 to-transparent" />
      
      <CardHeader className="relative z-10 pb-4">
        <div className="flex items-start gap-4 mb-3">
          {/* Enhanced Icon with Animation */}
          <div className={cn(
            "p-4 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
            "shadow-card group-hover:shadow-elevated",
            iconColor
          )}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className={cn(
              "text-xl font-bold mb-2 transition-all duration-300",
              "group-hover:text-accent-primary",
              "text-text-primary"
            )}>
              {title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed text-text-secondary">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 pb-4">
        {/* Feature Highlights */}
        <div className="flex flex-wrap gap-2 mb-4">
          {title === 'Learn' && (
            <>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">Free Trial</Badge>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">Interactive</Badge>
            </>
          )}
          {title === 'Puzzles' && (
            <>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">Daily Fresh</Badge>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">Adaptive</Badge>
            </>
          )}
          {title === 'vs Computer' && (
            <>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">AI Opponents</Badge>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">All Levels</Badge>
            </>
          )}
          {title === 'Rate My Strength' && (
            <>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">Quick Test</Badge>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">Accurate</Badge>
            </>
          )}
          {title === 'Leaderboard' && (
            <>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">Global</Badge>
              <Badge variant="outline" className="text-xs bg-surface border-border-subtle">Live Updates</Badge>
            </>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="relative z-10 pt-0">
        <Button 
          asChild 
          className={cn(
            "w-full min-h-[48px] px-6 py-3 font-semibold transition-all duration-300 rounded-xl",
            isPrimary 
              ? "btn-primary text-white hover:scale-105" 
              : "bg-surface-elevated border-2 border-border-default text-text-primary hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/10"
          )}
        >
          <Link to={to} className="font-medium tracking-wide flex items-center justify-center gap-2">
            {cta}
            {isPrimary && <span className="text-lg">→</span>}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Progress Card Component
interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  progress?: number;
  color: string;
  icon?: React.ReactNode;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  progress,
  color,
  icon
}) => {
  const getColorValue = () => {
    switch (color) {
      case 'accent-primary': return 'var(--color-accent-primary)';
      case 'success': return 'var(--color-success)';
      case 'warning': return 'var(--color-warning)';
      case 'info': return 'var(--color-info)';
      default: return 'var(--color-accent-primary)';
    }
  };
  
  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 glass-card hover:scale-[1.01]" style={{ borderColor: 'var(--color-border-default)' }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110" style={{ backgroundColor: `${getColorValue()}20`, color: getColorValue() }}>
                {icon}
              </div>
            )}
            <h3 className="font-semibold text-lg text-text-primary">{title}</h3>
          </div>
          {progress !== undefined && (
            <Badge 
              className="bg-accent-primary/20 text-accent-primary border-accent-primary/30"
              size="sm"
            >
              {progress}%
            </Badge>
          )}
        </div>
        
        <div className="space-y-3">
          <div className="text-4xl font-bold tracking-tight transition-colors duration-300" style={{ color: getColorValue() }}>
            {value}
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">{subtitle}</p>
          
          {progress !== undefined && (
            <div className="space-y-3">
              <div className="relative">
                <Progress value={progress} className="h-3 rounded-full" />
                <div 
                  className="absolute top-0 left-0 h-3 rounded-full transition-all duration-700 ease-out opacity-30"
                  style={{ 
                    width: `${progress}%`, 
                    background: `linear-gradient(90deg, ${getColorValue()}, transparent)`,
                    filter: 'blur(2px)'
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-muted font-medium">Progress</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: getColorValue() }}>{progress}%</span>
                  <TrendingUp className="w-4 h-4" style={{ color: getColorValue() }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const SimpleDashboard: React.FC = () => {
  const dashboardCards = [
    {
      title: 'Learn',
      description: 'Master chess fundamentals with guided lessons. Free trial - no signup required!',
      icon: <Brain className="h-6 w-6 text-white" />,
      to: '/lessons',
      cta: 'Try Free Lessons',
      iconColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-500/20 to-blue-600/20'
    },
    {
      title: 'Puzzles',
      description: 'Sharpen your tactical skills with puzzles. Instant access - start solving now!',
      icon: <Puzzle className="h-6 w-6 text-white" />,
      to: '/puzzles',
      cta: 'Try Free Puzzles',
      iconColor: 'bg-gradient-to-br from-success to-green-600',
      bgGradient: 'bg-gradient-to-br from-success/20 to-green-600/20'
    },
    {
      title: 'vs Computer',
      description: 'Practice against AI opponents. Play instantly - no account needed!',
      icon: <Monitor className="h-6 w-6 text-white" />,
      to: '/play',
      cta: 'Play Now',
      iconColor: 'bg-gradient-to-br from-accent to-accent-600',
      bgGradient: 'bg-gradient-to-br from-accent/20 to-accent-600/20'
    },
    {
      title: 'Rate My Strength',
      description: 'Discover your chess rating level. Free assessment available!',
      icon: <Target className="h-6 w-6 text-white" />,
      to: '/strength-assessment',
      cta: 'Test Skills Free',
      iconColor: 'bg-gradient-to-br from-danger to-red-600',
      bgGradient: 'bg-gradient-to-br from-danger/20 to-red-600/20'
    },
    {
      title: 'Leaderboard',
      description: 'Compare with top players worldwide. View rankings and stats!',
      icon: <Trophy className="h-6 w-6 text-white" />,
      to: '/leaderboard',
      cta: 'View Rankings',
      iconColor: 'bg-gradient-to-br from-warning to-orange-500',
      bgGradient: 'bg-gradient-to-br from-warning/20 to-orange-500/20'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden border-b bg-gradient-to-br from-surface-elevated to-surface" style={{ borderColor: 'var(--color-border-subtle)' }}>
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-accent-secondary/3 to-transparent" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-primary/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent-secondary/5 to-transparent" />
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ 
            backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-text-primary) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
        </div>
        
        <div className="relative container mx-auto px-6 py-6 md:py-7 text-center max-w-4xl">
          {/* Enhanced Chess Crown Icon */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-8 group transition-all duration-500">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            {/* Main Container */}
            <div className="relative bg-gradient-to-br from-accent-primary to-accent-secondary p-1 rounded-2xl shadow-elevated group-hover:scale-110 transition-all duration-300">
              <div className="bg-gradient-to-br from-surface-elevated to-surface p-4 rounded-xl">
                <Crown className="w-12 h-12 text-accent-primary group-hover:text-accent-secondary transition-colors duration-300" aria-label="Chess Academy" />
              </div>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-accent-secondary rounded-full animate-pulse" />
            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-accent-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          {/* Enhanced Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-8 tracking-tighter leading-none animate-slide-up" style={{ color: 'var(--color-text-primary)' }}>
            Master Chess with
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary animate-gradient" style={{ 
              background: 'linear-gradient(90deg, var(--color-accent-primary) 0%, var(--color-accent-secondary) 50%, var(--color-accent-primary) 100%)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              animation: 'gradient 3s ease-in-out infinite'
            }}>
              AI-Powered Training
            </span>
          </h1>
          
          {/* Enhanced Subtitle */}
          <p className="text-xl md:text-2xl mb-10 leading-relaxed font-secondary max-w-3xl mx-auto animate-fade-in" style={{ 
            color: 'var(--color-text-secondary)',
            animationDelay: '0.3s'
          }}>
            Join thousands of players improving their chess skills with our AI-powered lessons, 
            tactical puzzles, and personalized learning paths designed by grandmasters.
          </p>
          
          {/* CTA Buttons - Primary Green Hierarchy */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="xl" 
              asChild 
              className="min-w-[200px] min-h-[44px] px-5 py-3 font-semibold transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--color-cta-primary)', 
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px'
              }}
            >
              <Link to="/lessons">Start Learning</Link>
            </Button>
            <Button 
              size="xl" 
              variant="outline" 
              asChild 
              className="min-w-[200px] min-h-[44px] px-5 py-3 font-semibold transition-all duration-200 border-2"
              style={{ 
                borderColor: 'var(--color-border-default)',
                color: 'var(--color-text-secondary)',
                borderRadius: '12px'
              }}
            >
              <Link to="/play">Play vs Computer</Link>
            </Button>
          </div>
          
          {/* Guest Trial Notice */}
          <div className="text-center mb-8 p-6" style={{ background: 'linear-gradient(90deg, var(--color-accent-primary-subtle) 0%, var(--color-accent-primary-subtle) 100%)', border: '1px solid var(--color-accent-primary)', opacity: 0.7, borderRadius: '12px' }}>
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2" style={{ color: 'var(--color-text-primary)' }}>
                <Gamepad2 className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} aria-label="Gaming" />
                <strong>Full Access - No Signup Required!</strong>
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Try everything for free: lessons, puzzles, play vs computer, strength assessment, and leaderboards. 
                No barriers, no payments - just pure chess learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <div className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Save className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} aria-label="Save progress" />
                  Want to save progress?
                </div>
                <button 
                  onClick={() => {
                    const modal = document.querySelector('[data-auth-modal]') as HTMLElement;
                    modal?.click();
                  }}
                  className="font-medium underline decoration-2 underline-offset-2" style={{ color: 'var(--color-accent-primary)' }}
                >
                  Create free account after trying →
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group text-center p-6 glass-card rounded-2xl border border-border-default hover:border-accent-primary/50 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.5s' }}>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-accent-primary/20 group-hover:bg-accent-primary/30 transition-colors duration-300">
                  <Target className="w-8 h-8 text-accent-primary group-hover:scale-110 transition-transform duration-300" aria-label="Personalized learning" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-text-primary group-hover:text-accent-primary transition-colors duration-300">Personalized</h3>
              <p className="text-sm text-text-secondary leading-relaxed">AI adapts to your skill level and creates custom learning paths</p>
            </div>
            <div className="group text-center p-6 glass-card rounded-2xl border border-border-default hover:border-accent-secondary/50 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.7s' }}>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-accent-secondary/20 group-hover:bg-accent-secondary/30 transition-colors duration-300">
                  <Zap className="w-8 h-8 text-accent-secondary group-hover:scale-110 transition-transform duration-300" aria-label="Interactive practice" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-text-primary group-hover:text-accent-secondary transition-colors duration-300">Interactive</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Practice with real-time feedback and instant move analysis</p>
            </div>
            <div className="group text-center p-6 glass-card rounded-2xl border border-border-default hover:border-success/50 transition-all duration-300 hover:scale-105 animate-scale-in" style={{ animationDelay: '0.9s' }}>
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-success/20 group-hover:bg-success/30 transition-colors duration-300">
                  <TrendingUp className="w-8 h-8 text-success group-hover:scale-110 transition-transform duration-300" aria-label="Progressive improvement" />
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 text-text-primary group-hover:text-success transition-colors duration-300">Progressive</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Track detailed progress and unlock advanced content</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sticky Mini-CTA Bar */}
      <div className="sticky top-0 z-40 bg-opacity-95 backdrop-blur-sm border-b" style={{ backgroundColor: 'var(--color-surface-elevated)', borderColor: 'var(--color-border-subtle)' }}>
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                Ready to start learning?
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                size="sm" 
                asChild 
                className="min-h-[36px]"
                style={{ 
                  backgroundColor: 'var(--color-cta-primary)', 
                  color: '#ffffff',
                  borderRadius: '8px'
                }}
              >
                <Link to="/lessons">Start Now</Link>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                asChild 
                className="min-h-[36px]"
                style={{ 
                  borderColor: 'var(--color-border-default)',
                  color: 'var(--color-text-secondary)',
                  borderRadius: '8px'
                }}
              >
                <Link to="/play">Play</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 max-w-7xl">

        {/* Daily Plan Widget */}
        <div className="mb-12 flex justify-center">
          <div className="w-full max-w-lg">
            <div className="p-6" style={{ background: 'linear-gradient(135deg, var(--color-surface-elevated) 0%, var(--color-surface) 100%)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--elevation-card)', borderRadius: '12px' }}>
              <h2 className="text-xl font-semibold font-primary mb-4 text-center" style={{ color: 'var(--color-text-primary)' }}>
                Today's Plan
              </h2>
              <DailyPlanHorizontal />
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-primary mb-3 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Choose Your Path
            </h2>
            <p className="text-lg font-secondary" style={{ color: 'var(--color-text-secondary)' }}>
              Select an area to focus on and start your chess improvement journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {dashboardCards.map((card) => (
              <DashboardCard
                key={card.title}
                title={card.title}
                description={card.description}
                icon={card.icon}
                to={card.to}
                cta={card.cta}
                iconColor={card.iconColor}
                bgGradient={card.bgGradient}
              />
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold font-primary mb-3 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>
              Your Progress
            </h2>
            <p className="text-lg font-secondary" style={{ color: 'var(--color-text-secondary)' }}>
              Track your chess development across different areas
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressCard
              title="Lessons Completed"
              value={0}
              subtitle="Begin your learning journey"
              progress={0}
              color="accent-primary"
              icon={<Brain className="h-4 w-4" />}
            />
            
            <ProgressCard
              title="Puzzles Solved"
              value={0}
              subtitle="Sharpen your tactics"
              progress={0}
              color="success"
              icon={<Puzzle className="h-4 w-4" />}
            />
            
            <ProgressCard
              title="Current Rating"
              value={1200}
              subtitle="Your estimated skill level"
              color="accent-primary"
              icon={<Target className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDashboard;